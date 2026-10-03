import { createThemeInspection } from '@sabinmarcu/theme-core';
import type {
  InspectedTheme,
  InspectionChange,
  ThemeInspection,
} from '@sabinmarcu/theme-core';
import {
  envelope,
  messageOf,
  readMessage,
} from './remote-protocol.js';
import type {
  RemoteEvent,
  RemoteRequest,
  RemoteTargetValues,
  RemoteTransport,
} from './remote-protocol.js';

export type InspectionAgentOptions = {
  /** Explicit catalog; omitted discovers embedded `data-theme-manifests` metadata. */
  readonly manifests?: readonly unknown[];
};

export type InspectionAgent = {
  /** Report which targets' allocation roots contain `element`; `null` clears the selection. */
  select(element: Element | null): void;
  /** Stop answering requests; application sources are untouched. Idempotent. */
  dispose(): void;
};

const valuesFor = (
  target: InspectedTheme,
  change?: NonNullable<InspectionChange>,
): RemoteTargetValues => {
  const { manifest } = target;
  try {
    const derived = manifest.outputs.flatMap((output) => (output.role === 'derived' ? [output] : []));
    const sourceNames = change?.sources ?? manifest.sources.map((source) => source.name);
    const outputNames = change?.outputs ?? derived.map((output) => output.name);
    const outputName = new Map(derived.map((output) => [JSON.stringify(output.path), output.name]));
    return {
      targetId: manifest.id,
      inputs: target.export(),
      sources: sourceNames.length === 0 ? {} : target.readSources(sourceNames),
      outputs: outputNames.length === 0
        ? {}
        : Object.fromEntries(target.readOutputs(outputNames).map((output) => [
          outputName.get(JSON.stringify(output.path))!,
          output.value,
        ])),
    };
  } catch (error) {
    return {
      targetId: manifest.id,
      error: messageOf(error),
    };
  }
};

/**
 * Page-side half of the remote inspector. Owns one headless `createThemeInspection` and
 * answers a single remote inspector over `transport`; it needs DOM access only, never the
 * application's JavaScript realm or the private inspector UI.
 */
export function createInspectionAgent(
  document: Document,
  transport: RemoteTransport,
  options: InspectionAgentOptions = {},
): InspectionAgent {
  let active = true;
  let inspection: ThemeInspection | undefined;
  let catalogError: string | undefined;
  let announced: readonly InspectedTheme[] = [];
  let selected: Element | null = null;
  let stopWatching: (() => void) | undefined;

  const send = (event: RemoteEvent) => {
    if (active) transport.send(envelope(event));
  };
  const selection = (): readonly string[] | null => {
    const element = selected;
    if (!element || !inspection) return null;
    return inspection.targets.flatMap(({ manifest }) => {
      const roots = document.querySelectorAll(manifest.root.selector);
      return roots.length === 1 && roots[0]!.contains(element) ? [manifest.id] : [];
    });
  };
  const announce = () => {
    const targets = inspection?.targets ?? [];
    announced = targets;
    send({
      type: 'catalog',
      manifests: targets.map((target) => target.manifest),
      values: targets.map((target) => valuesFor(target)),
      selection: selection(),
      ...(catalogError === undefined ? {} : { error: catalogError }),
    });
  };
  const changed = (change: InspectionChange) => {
    if (!active || !inspection) return;
    const { targets } = inspection;
    if (targets.length !== announced.length
      || targets.some((target, index) => target !== announced[index])) {
      announce();
      return;
    }
    if (change) {
      const target = targets.find((candidate) => candidate.manifest.id === change.targetId);
      if (target) {
        send({
          type: 'values',
          values: [valuesFor(target, change)],
          change,
        });
      }
      return;
    }
    send({
      type: 'values',
      values: targets.map((target) => valuesFor(target)),
    });
  };
  const release = () => {
    stopWatching?.();
    stopWatching = undefined;
    inspection?.dispose();
    inspection = undefined;
  };
  const connect = (manifests: readonly unknown[] | undefined) => {
    release();
    try {
      inspection = createThemeInspection(document, manifests);
      catalogError = undefined;
      stopWatching = inspection.subscribe(changed);
    } catch (error) {
      catalogError = messageOf(error);
    }
  };
  const replaceCatalog = (manifests: readonly unknown[] | undefined, explicit: boolean) => {
    if (!inspection) {
      connect(manifests);
      announce();
      return;
    }
    try {
      // Successful replacement notifies `changed`, which announces the new catalog.
      if (explicit) inspection.setManifests(manifests);
      else inspection.refresh();
    } catch (error) {
      send({
        type: 'error',
        message: messageOf(error),
      });
    }
  };
  const patch = (request: Extract<RemoteRequest, { type: 'patch' }>) => {
    const target = inspection?.targets.find(
      (candidate) => candidate.manifest.id === request.targetId,
    );
    try {
      if (!target) throw new Error(`Unknown theme inspection target: ${request.targetId}`);
      target.patch(request.input);
      send({
        type: 'result',
        id: request.id,
      });
    } catch (error) {
      send({
        type: 'result',
        id: request.id,
        error: messageOf(error),
      });
      // The inspector applied the patch optimistically; resynchronize it from the page.
      if (target) {
        send({
          type: 'values',
          values: [valuesFor(target)],
        });
      }
    }
  };
  const receive = (value: unknown) => {
    const message = readMessage(value);
    if (!active || !message) return;
    switch (message.type) {
      case 'hello': {
        connect(options.manifests);
        announce();
        break;
      }
      case 'refresh': {
        replaceCatalog(options.manifests, false);
        break;
      }
      case 'setManifests': {
        replaceCatalog(message.manifests, true);
        break;
      }
      case 'patch': {
        patch(message);
        break;
      }
      default: {
        break;
      }
    }
  };
  const unsubscribe = transport.subscribe(receive);

  return Object.freeze({
    select(element: Element | null) {
      if (!active) return;
      selected = element;
      send({
        type: 'selection',
        targetIds: selection(),
      });
    },
    dispose() {
      if (!active) return;
      active = false;
      unsubscribe();
      release();
    },
  });
}
