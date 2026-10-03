import {
  createManifestPatchDecoder,
  validateThemeManifest,
} from '@sabinmarcu/theme-core';
import type {
  InspectedTheme,
  InspectionChange,
  ManifestDerivedOutput,
  ManifestSource,
  ThemeInspection,
  ThemeManifest,
} from '@sabinmarcu/theme-core';
import {
  envelope,
  messageOf,
  readMessage,
} from './remote-protocol.js';
import type {
  RemoteRequest,
  RemoteTargetValues,
  RemoteTransport,
} from './remote-protocol.js';

/** A remote mirror is an ordinary `ThemeInspection`; the caller owns `dispose()`. */
export type RemoteInspection = ThemeInspection;

export type RemoteInspectionOptions = {
  /** `selection` exposes only targets whose root contains the agent's selected element. */
  readonly scope?: 'all' | 'selection';
  /** Asynchronous agent failures: catalog errors and rejected patches. */
  readonly onError?: (message: string) => void;
};

type Tree = Readonly<Record<string, unknown>>;

const freeze = <Value>(value: Value): Value => {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) freeze(nested);
    Object.freeze(value);
  }
  return value;
};

const withValue = (tree: Tree, path: readonly string[], value: unknown): Tree => {
  const [head, ...rest] = path;
  if (head === undefined) return tree;
  const current = tree[head];
  const branch = current !== null && typeof current === 'object' && !Array.isArray(current)
    ? current as Tree
    : {};
  return Object.freeze({
    ...tree,
    [head]: rest.length === 0 ? freeze(value) : withValue(branch, rest, value),
  });
};

type MirroredTarget = {
  readonly target: InspectedTheme;
  update(values: RemoteTargetValues): void;
  notify(change: InspectionChange): void;
};

/**
 * Inspector-side half of the remote inspector: a synchronous `ThemeInspection` mirror fed by
 * a page agent over `transport`. Reads are served from the mirror; patches are validated and
 * applied optimistically with the same codecs, then committed by the agent. The caller owns
 * disposal; pass the result to `createThemeDevtools(container, { inspection })`.
 */
export function createRemoteInspection(
  transport: RemoteTransport,
  options: RemoteInspectionOptions = {},
): RemoteInspection {
  let active = true;
  let mirrored: MirroredTarget[] = [];
  let selection: ReadonlySet<string> | null = null;
  let visible: readonly InspectedTheme[] = Object.freeze([]);
  let nextPatch = 0;
  /** Patch id → acknowledgement that releases its optimistic source values. */
  const pendingPatches = new Map<number, () => void>();
  const listeners = new Set<(change: InspectionChange) => void>();

  const ensure = () => { if (!active) throw new Error('Disposed remote theme inspection'); };
  const send = (request: RemoteRequest) => { transport.send(envelope(request)); };
  const reportError = (message: string) => { options.onError?.(message); };
  const notify = (change?: InspectionChange) => {
    for (const listener of listeners) listener(change);
  };
  const recompute = (): boolean => {
    const next = options.scope === 'selection'
      ? mirrored.filter(({ target }) => selection?.has(target.manifest.id) ?? false)
      : mirrored;
    const changed = next.length !== visible.length
      || next.some(({ target }, index) => target !== visible[index]);
    if (changed) visible = Object.freeze(next.map(({ target }) => target));
    return changed;
  };

  const mirror = (manifest: ThemeManifest): MirroredTarget => {
    const decode = createManifestPatchDecoder(manifest);
    const sourceByName = new Map<string, ManifestSource>(
      manifest.sources.map((source) => [source.name, source]),
    );
    const derived = manifest.outputs.flatMap((output) => (output.role === 'derived' ? [output] : []));
    const derivedByName = new Map<string, ManifestDerivedOutput>(
      derived.map((output) => [output.name, output]),
    );
    const sources = new Map<string, unknown>();
    const outputs = new Map<string, unknown>();
    const pending = new Map<string, number>();
    const targetListeners = new Set<(change: InspectionChange) => void>();
    let inputs: Tree = Object.freeze({});
    let error: string | undefined = 'Waiting for the page agent';

    const ensureTarget = () => {
      ensure();
      if (error !== undefined) throw new Error(error);
    };
    const readSources = (names: readonly string[]): Tree => {
      ensureTarget();
      return Object.freeze(Object.fromEntries(names.map((name) => {
        if (!sourceByName.has(name)) throw new Error(`Undeclared theme source: ${name}`);
        if (!sources.has(name)) throw new Error(`Missing declared theme source: ${name}`);
        return [name, sources.get(name)];
      })));
    };
    const settle = (names: readonly string[]) => {
      for (const name of names) {
        const count = (pending.get(name) ?? 1) - 1;
        if (count > 0) pending.set(name, count);
        else pending.delete(name);
      }
    };
    const target: InspectedTheme = Object.freeze({
      manifest,
      read() { ensureTarget(); return inputs; },
      export() { ensureTarget(); return inputs; },
      readSource(name: string) { return readSources([name])[name]; },
      readSources,
      readOutputs(names?: readonly string[]) {
        ensureTarget();
        const requested = names === undefined ? undefined : new Set(names);
        if (requested) {
          for (const name of requested) {
            if (!derivedByName.has(name)) throw new Error(`Undeclared theme output: ${name}`);
          }
        }
        const selected = requested === undefined
          ? manifest.outputs
          : derived.filter((output) => requested.has(output.name));
        return Object.freeze(selected.map((output) => {
          if (output.role === 'static') {
            return Object.freeze({
              path: output.path,
              value: output.value,
            });
          }
          if (!outputs.has(output.name)) {
            throw new Error(`Missing declared theme output: ${output.name}`);
          }
          return Object.freeze({
            path: output.path,
            value: outputs.get(output.name),
          });
        }));
      },
      patch(input: Readonly<Record<string, unknown>>) {
        ensureTarget();
        const decoded = decode(input);
        const names = Object.keys(decoded);
        if (names.length === 0) return;
        for (const name of names) {
          if (!sources.has(name)) throw new Error(`Missing declared theme source: ${name}`);
        }
        for (const name of names) {
          sources.set(name, decoded[name]);
          inputs = withValue(inputs, sourceByName.get(name)!.inputPath, decoded[name]);
          pending.set(name, (pending.get(name) ?? 0) + 1);
        }
        nextPatch += 1;
        pendingPatches.set(nextPatch, () => settle(names));
        send({
          type: 'patch',
          id: nextPatch,
          targetId: manifest.id,
          input,
        });
      },
      subscribe(listener: (change: InspectionChange) => void) {
        ensure();
        targetListeners.add(listener);
        return () => { targetListeners.delete(listener); };
      },
    });
    return {
      target,
      update(values) {
        if (values.error !== undefined) {
          error = values.error;
          return;
        }
        error = undefined;
        // In-flight optimistic edits win until the agent acknowledges them.
        if (values.inputs && pending.size === 0) inputs = freeze(values.inputs);
        for (const [name, value] of Object.entries(values.sources ?? {})) {
          if (!pending.has(name)) sources.set(name, freeze(value));
        }
        for (const [name, value] of Object.entries(values.outputs ?? {})) outputs.set(name, value);
      },
      notify(change) {
        for (const listener of targetListeners) listener(change);
      },
    };
  };

  const receive = (value: unknown) => {
    const message = readMessage(value);
    if (!active || !message) return;
    switch (message.type) {
      case 'catalog': {
        pendingPatches.clear();
        try {
          mirrored = message.manifests.map((manifest) => mirror(validateThemeManifest(manifest)));
        } catch (error) {
          mirrored = [];
          reportError(messageOf(error));
        }
        for (const values of message.values) {
          mirrored.find(({ target }) => target.manifest.id === values.targetId)?.update(values);
        }
        selection = message.selection === null ? null : new Set(message.selection);
        recompute();
        if (message.error !== undefined) reportError(message.error);
        notify();
        break;
      }
      case 'values': {
        const changed: MirroredTarget[] = [];
        for (const values of message.values) {
          const record = mirrored.find(({ target }) => target.manifest.id === values.targetId);
          if (record) {
            record.update(values);
            changed.push(record);
          }
        }
        for (const record of changed) record.notify(message.change);
        notify(message.change);
        break;
      }
      case 'result': {
        pendingPatches.get(message.id)?.();
        pendingPatches.delete(message.id);
        if (message.error !== undefined) reportError(message.error);
        break;
      }
      case 'error': {
        reportError(message.message);
        break;
      }
      case 'selection': {
        selection = message.targetIds === null ? null : new Set(message.targetIds);
        if (recompute()) notify();
        break;
      }
      default: {
        break;
      }
    }
  };
  const unsubscribe = transport.subscribe(receive);
  send({ type: 'hello' });

  return Object.freeze({
    get targets() {
      ensure();
      return visible;
    },
    setManifests(manifests?: readonly unknown[]) {
      ensure();
      if (manifests !== undefined) {
        if (!Array.isArray(manifests)) throw new Error('Theme manifests must be an array');
        for (const manifest of manifests) validateThemeManifest(manifest);
      }
      send({
        type: 'setManifests',
        ...(manifests === undefined ? {} : { manifests }),
      });
    },
    refresh() {
      ensure();
      send({ type: 'refresh' });
    },
    subscribe(listener: (change: InspectionChange) => void) {
      ensure();
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    dispose() {
      if (!active) return;
      active = false;
      unsubscribe();
      listeners.clear();
      pendingPatches.clear();
      mirrored = [];
      visible = Object.freeze([]);
    },
  });
}
