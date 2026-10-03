import { createThemeInspection } from '@sabinmarcu/theme-core';
import type { ThemeManifest } from '@sabinmarcu/theme-core';
import {
  hostTag,
  registerDevtoolsElements,
} from './elements.js';
import { createDevtoolsMemory } from './persistence.js';
import { mountUITheme } from './ui-theme.js';
import { createDevtoolsView } from './view.js';
import type {
  DevtoolsHostElement,
  DevtoolsView,
  ThemeDevtools,
  ThemeDevtoolsOptions,
} from './types.js';

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** UI ownership is local to the container; inspection is document-scoped or caller-owned. */
export function createThemeDevtools(
  container: HTMLElement,
  options: ThemeDevtoolsOptions = {},
): ThemeDevtools {
  const document = container.ownerDocument;
  const realm = document.defaultView;
  if (!realm || !(container instanceof realm.HTMLElement) || !container.isConnected) {
    throw new Error('Theme devtools require a connected HTML container in an active document');
  }
  if ([...container.children].some((child) => child.localName === hostTag
    && child.attributes.getNamedItem('data-theme-devtools-root')?.value === '1')) {
    throw new Error('A theme devtools instance already owns this container');
  }
  if (options.inspection
    && (options.manifests !== undefined || options.inspectionDocument !== undefined)) {
    throw new Error(
      'A supplied inspection cannot be combined with manifests or an inspection document',
    );
  }
  const ownsInspection = !options.inspection;
  const inspection = options.inspection ?? createThemeInspection(
    options.inspectionDocument ?? document,
    options.manifests,
  );
  let active = true;
  let host: DevtoolsHostElement | undefined;
  let ui: ReturnType<typeof mountUITheme> | undefined;
  let view: DevtoolsView | undefined;
  let unsubscribe: (() => void) | undefined;
  const ensure = () => { if (!active) throw new Error('Theme devtools instance is destroyed'); };
  const report = (error: unknown) => { view?.setError(messageOf(error)); };
  const refresh = () => {
    ensure();
    try {
      inspection.refresh();
      view?.setError();
    } catch (error) {
      report(error);
      throw error;
    }
  };
  const cleanup = () => {
    if (ownsInspection) inspection.dispose();
    unsubscribe?.();
    try {
      view?.dispose();
    } finally {
      try { ui?.dispose(); } finally { host?.remove(); }
    }
  };
  try {
    registerDevtoolsElements(document);
    host = document.createElement(hostTag) as DevtoolsHostElement;
    host.dataset.themeDevtoolsRoot = '1';
    host.dataset.themeInspection = 'private';
    container.append(host);
    const root = host.initialize(options.shadowMode ?? 'open');
    ui = mountUITheme(host, root, {
      nonce: options.nonce,
      input: options.ui,
    });
    view = createDevtoolsView(root, {
      nonce: options.nonce,
      presentation: options.presentation ?? 'window',
      memory: createDevtoolsMemory(realm, options.persistence),
      refresh,
      close() { options.onClose?.(); },
    });
    let bound = inspection.targets;
    view.setTargets(bound);
    unsubscribe = inspection.subscribe((change) => {
      if (!active) return;
      try {
        const { targets } = inspection;
        if (targets.length === bound.length
          && targets.every((target, index) => target === bound[index])) {
          view!.sync(change);
        } else {
          view!.setTargets(targets);
          bound = targets;
        }
      } catch (error) { report(error); }
    });
    const ownedHost = host;
    const ownedUI = ui;
    return Object.freeze({
      host: ownedHost,
      setManifests(manifests?: readonly ThemeManifest[]) {
        ensure();
        try {
          inspection.setManifests(manifests);
          view!.setError();
        } catch (error) {
          report(error);
          throw error;
        }
      },
      refresh,
      exportInputs() {
        ensure();
        return inspection.targets.map((target) => ({
          id: target.manifest.id,
          inputs: target.export(),
        }));
      },
      updateUI(input) {
        ensure();
        ownedUI.update(input);
      },
      subscribe(listener: () => void) { ensure(); return inspection.subscribe(listener); },
      destroy() {
        if (!active) return;
        active = false;
        cleanup();
      },
    });
  } catch (error) {
    active = false;
    cleanup();
    throw error;
  }
}
