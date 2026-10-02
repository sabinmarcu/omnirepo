import {
  createStylesheet,
  stylesheetCommitEvent,
} from '@sabinmarcu/stylesheet';
import type { BrowserStylesheet } from '@sabinmarcu/stylesheet';
import { encodeThemePatch } from './inputs.js';
import { readThemeSources } from './live.js';
import {
  themeFromManifest,
  validateThemeManifest,
} from './manifest.js';
import type { ThemeManifest } from './manifest.js';

export type InspectedTheme = {
  readonly manifest: ThemeManifest;
  read(): Readonly<Record<string, unknown>>;
  /** Complete current source inputs, suitable for replay through the original setup. */
  export(): Readonly<Record<string, unknown>>;
  patch(input: Readonly<Record<string, unknown>>): void;
  /** Public outputs are informational, never accepted by patch. */
  readOutputs(): readonly { readonly path: readonly string[]; readonly value: unknown }[];
  subscribe(listener: () => void): () => void;
};

export type ThemeInspection = {
  readonly targets: readonly InspectedTheme[];
  /** undefined discovers DOM metadata; an explicit list replaces it, including []. */
  setManifests(manifests?: readonly unknown[]): void;
  /** Explicit refresh; discovers again only while no programmatic catalog is supplied. */
  refresh(): void;
  subscribe(listener: () => void): () => void;
  dispose(): void;
};

const privateSelector = '[data-theme-inspection="private"]';
const ownedSheets = (document: Document, id: string) => (
  [...document.querySelectorAll<HTMLStyleElement>('style[data-stylesheet-id]')]
    .filter((element) => element.dataset.stylesheetId === id)
);

const resolve = (document: Document, manifest: ThemeManifest) => {
  const roots = document.querySelectorAll(manifest.root.selector);
  if (roots.length !== 1) throw new Error(`Ambiguous or missing theme root: ${manifest.id}`);
  const root = roots[0]!;
  if (root.getRootNode() !== document || root.closest(privateSelector)) {
    throw new Error(`Theme inspection requires an application light-DOM root: ${manifest.id}`);
  }
  const sheets = ownedSheets(document, manifest.root.sheetId);
  if (sheets.length !== 1) throw new Error(`Ambiguous or missing theme stylesheet: ${manifest.id}`);
  const element = sheets[0]!;
  if (element.getRootNode() !== document || element.closest(privateSelector)
    || !element.sheet || element.sheet.disabled
    || (element.media && !document.defaultView!.matchMedia(element.media).matches)) {
    throw new Error(`Theme inspection requires an active application light-DOM sheet: ${manifest.id}`);
  }
  return {
    root,
    element,
  };
};

const inspect = (document: Document, manifest: ThemeManifest) => {
  const allocation = resolve(document, manifest);
  const stylesheet: BrowserStylesheet = createStylesheet({ id: manifest.root.sheetId })
    .mount(document);
  const theme = themeFromManifest(manifest);
  let active = true;
  const listeners = new Set<() => void>();
  let stop: (() => void) | undefined;
  const ensure = () => {
    if (!active) throw new Error(`Disposed theme inspection target: ${manifest.id}`);
    const current = resolve(document, manifest);
    if (current.root !== allocation.root || current.element !== allocation.element) {
      throw new Error(`Replaced theme inspection allocation: ${manifest.id}; refresh the catalog`);
    }
    // Inspect allocations, not computed/inherited guesses or another rule's values.
    for (const source of manifest.sources) {
      if (stylesheet.read(manifest.root.selector, source.name, manifest.root.layer) === undefined) {
        throw new Error(`Missing declared theme source: ${source.name}`);
      }
    }
    for (const output of manifest.outputs) {
      if (output.role === 'derived'
        && stylesheet.read(
          manifest.root.selector,
          output.name,
          manifest.root.layer,
        ) === undefined) {
        throw new Error(`Missing declared theme output: ${output.name}`);
      }
    }
  };
  const read = (): Readonly<Record<string, unknown>> => {
    ensure();
    const inputs = readThemeSources(theme, stylesheet, manifest.root.selector, manifest.root.layer);
    if (manifest.kind === 'family') {
      const families = inputs.families as Record<string, unknown> | undefined;
      return {
        shared: inputs.shared ?? {},
        families: Object.fromEntries(manifest.families!.map((member) => [member,
          families?.[member] ?? {}])),
      };
    }
    return inputs;
  };
  const notify = () => { for (const listener of listeners) listener(); };
  const target: InspectedTheme = {
    manifest,
    read,
    export: read,
    patch(input) {
      read();
      const declarations = encodeThemePatch(theme, input);
      if (Object.keys(declarations).length === 0) return;
      stylesheet.update([{
        selector: manifest.root.selector,
        layer: manifest.root.layer,
        rules: declarations,
      }]);
    },
    readOutputs() {
      ensure();
      const computed = document.defaultView!.getComputedStyle(allocation.root);
      return manifest.outputs.map((output) => ({
        path: output.path,
        value: output.role === 'static' ? output.value : computed.getPropertyValue(output.name).trim(),
      }));
    },
    subscribe(listener) {
      ensure();
      listeners.add(listener);
      if (!stop) {
        const observer = new document.defaultView!.MutationObserver(() => { notify(); });
        observer.observe(allocation.element, {
          childList: true,
          characterData: true,
          subtree: true,
        });
        const committed = () => {
          // A backend commit already reports the same text replacement synchronously.
          observer.takeRecords();
          notify();
        };
        allocation.element.addEventListener(stylesheetCommitEvent, committed);
        stop = () => {
          observer.disconnect();
          allocation.element.removeEventListener(stylesheetCommitEvent, committed);
        };
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) { stop?.(); stop = undefined; }
      };
    },
  };
  ensure();
  return {
    target: Object.freeze(target),
    dispose() {
      active = false;
      stop?.();
      stop = undefined;
      listeners.clear();
    },
  };
};

const discover = (document: Document): unknown[] => {
  const manifests: unknown[] = [];
  for (const node of document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/json"][data-theme-manifests]',
  )) {
    if (!node.closest(privateSelector)) {
      const entries: unknown = JSON.parse(node.textContent ?? '');
      if (!Array.isArray(entries)) throw new Error('Embedded theme manifests must be an array');
      manifests.push(...entries);
    }
  }
  return manifests;
};

/** Headless optional access to declared application sheets; never initializes theme values. */
export function createThemeInspection(
  document: Document,
  manifests?: readonly unknown[],
): ThemeInspection {
  if (document.nodeType !== 9 || !document.defaultView) {
    throw new Error('Theme inspection requires an active Document, never a ShadowRoot');
  }
  let active = true;
  let supplied: readonly ThemeManifest[] | undefined;
  let current: ReturnType<typeof inspect>[] = [];
  let subscriptions: (() => void)[] = [];
  const listeners = new Set<() => void>();
  const ensure = () => { if (!active) throw new Error('Disposed theme inspection catalog'); };
  const notify = () => { for (const listener of listeners) listener(); };
  const watch = () => {
    for (const unsubscribe of subscriptions) unsubscribe();
    subscriptions = listeners.size === 0
      ? []
      : current.map(({ target }) => target.subscribe(notify));
  };
  const replace = (values: readonly unknown[] | undefined) => {
    ensure();
    if (values !== undefined && !Array.isArray(values)) throw new Error('Theme manifests must be an array');
    const validated = (values ?? discover(document)).map(validateThemeManifest);
    const ids = new Set<string>();
    const sheetIds = new Set<string>();
    const next: ReturnType<typeof inspect>[] = [];
    try {
      for (const manifest of validated) {
        if (ids.has(manifest.id) || sheetIds.has(manifest.root.sheetId)) {
          throw new Error(`Duplicate theme inspection target: ${manifest.id}`);
        }
        ids.add(manifest.id);
        sheetIds.add(manifest.root.sheetId);
        next.push(inspect(document, manifest));
      }
    } catch (error) {
      for (const target of next) target.dispose();
      throw error;
    }
    for (const unsubscribe of subscriptions) unsubscribe();
    subscriptions = [];
    for (const target of current) target.dispose();
    current = next;
    supplied = values === undefined ? undefined : Object.freeze(validated);
    watch();
    notify();
  };
  replace(manifests);
  return Object.freeze({
    get targets() { ensure(); return Object.freeze(current.map(({ target }) => target)); },
    setManifests: replace,
    refresh() { replace(supplied); },
    subscribe(listener: () => void) {
      ensure();
      listeners.add(listener);
      watch();
      return () => { listeners.delete(listener); if (active) watch(); };
    },
    dispose() {
      if (!active) return;
      active = false;
      for (const unsubscribe of subscriptions) unsubscribe();
      subscriptions = [];
      for (const target of current) target.dispose();
      current = [];
      listeners.clear();
    },
  });
}
