import { createSourceEditorClass } from './editor.js';
import type { DevtoolsHostElement } from './types.js';

export const hostTag = 'sabinmarcu-theme-devtools';
export const editorTag = 'sabinmarcu-theme-source-editor';
export const elementVersion = '2';

type VersionedConstructor = CustomElementConstructor & {
  readonly themeDevtoolsVersion?: unknown;
};

function isCompatible(
  constructor: VersionedConstructor | undefined,
  methods: readonly string[],
): boolean {
  const prototype = constructor?.prototype as unknown as Record<string, unknown> | undefined;
  return constructor?.themeDevtoolsVersion === elementVersion
    && methods.every((method) => typeof prototype?.[method] === 'function');
}

function createHostClass(realm: Window & typeof globalThis): CustomElementConstructor {
  class ThemeDevtoolsHostElement extends realm.HTMLElement implements DevtoolsHostElement {
    static readonly themeDevtoolsVersion = elementVersion;

    #root: ShadowRoot | undefined;

    initialize(mode: ShadowRootMode): ShadowRoot {
      if (this.#root) throw new Error('The devtools host shadow root is already initialized');
      if (this.shadowRoot) throw new Error('The devtools host already has an unmanaged shadow root');
      this.#root = this.attachShadow({ mode });
      return this.#root;
    }
  }

  return ThemeDevtoolsHostElement;
}

function preflight(
  registry: CustomElementRegistry,
  tag: string,
  methods: readonly string[],
): VersionedConstructor | undefined {
  const existing = registry.get(tag) as VersionedConstructor | undefined;
  if (existing && !isCompatible(existing, methods)) {
    throw new Error(`Incompatible devtools custom element is already registered: ${tag}`);
  }
  return existing;
}

/** Register owner-realm classes only after a concrete browser document is supplied. */
export function registerDevtoolsElements(document: Document): void {
  const realm = document.defaultView;
  if (!realm || !realm.customElements) {
    throw new Error('Devtools element registration requires an active document custom-element registry');
  }
  const registry = realm.customElements;

  // Both existing registrations are validated before defining either missing tag.
  const existingHost = preflight(registry, hostTag, ['initialize']);
  const existingEditor = preflight(registry, editorTag, ['configure', 'sync', 'dispose']);
  const HostElement = existingHost ?? createHostClass(realm);
  const EditorElement = existingEditor ?? createSourceEditorClass(realm);

  if (!isCompatible(HostElement, ['initialize'])
    || !isCompatible(EditorElement as VersionedConstructor, ['configure', 'sync', 'dispose'])) {
    throw new Error('Devtools element factories must expose the current compatibility marker and protocol');
  }
  if (!existingHost) registry.define(hostTag, HostElement);
  if (!existingEditor) registry.define(editorTag, EditorElement);
}
