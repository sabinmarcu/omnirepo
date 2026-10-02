import { createStylesheet } from '@sabinmarcu/stylesheet';
import type {
  Stylesheet,
  StylesheetState,
  StylesheetRuleSet,
} from '@sabinmarcu/stylesheet';
import {
  encodeThemePatch,
  resolveThemeInputs,
} from './inputs.js';
import { readThemeSources } from './live.js';
import { createThemeManifest } from './manifest.js';
import type { ThemeManifest } from './manifest.js';
import {
  claimThemeAllocations,
  releaseThemeAllocations,
} from './ownership.js';
import type {
  PropertyRegistration,
  ResolvedThemeInput,
  Theme,
  ThemeContract,
  ThemeInput,
  ThemePatch,
  ThemeSchema,
} from './types.js';

export type ThemeSetupOptions = {
  readonly id: string;
  readonly debugId?: string;
  readonly nonce?: string;
  readonly selector?: string;
  readonly layer?: string;
  readonly variantLayer?: string;
  /** Additional structural rules emitted in the same initial commit as allocations. */
  readonly rules?: (selector: string) => readonly StylesheetRuleSet[];
  /** Public aliases belong to the same root owner as their source graph. */
  readonly ownedNames?: readonly string[];
  readonly ownedNamesLayer?: string;
};

export type ThemeSetup<Schema extends ThemeSchema, Prefix extends string> = {
  (input: ThemeInput<Schema>): ThemeContract<Schema, Prefix>;
  update(patch: ThemePatch<Schema>): ThemeContract<Schema, Prefix>;
  read(): ResolvedThemeInput<Schema>;
  readonly stylesheet: StylesheetState;
  readonly selector: string;
  mount(root: Document | ShadowRoot): ThemeSetup<Schema, Prefix>;
  manifest(): ThemeManifest;
};

type Registration = PropertyRegistration & { readonly name: string };
type ObservedRegistration = Pick<CSSPropertyRule, 'syntax' | 'inherits' | 'initialValue'>;
const sameRegistration = (left: ObservedRegistration, right: ObservedRegistration) => (
  left.syntax === right.syntax && left.inherits === right.inherits
    && left.initialValue === right.initialValue
);

const registrationsOf = (theme: Pick<Theme, 'sources' | 'tokens'>): readonly Registration[] => (
  [...theme.sources.map((source) => ({
    name: source.name,
    registration: source.descriptor.registration,
  })),
  ...theme.tokens.map((token) => ({
    name: token.name,
    registration: token.registration,
  }))]
    .flatMap(({ name, registration }) => (registration
      ? [{
        name,
        ...registration,
      }]
      : []))
);

/** Document-owned CSS registrations also serve private hosts and survive module duplication. */
const registerProperties = (
  document: Document,
  registrations: readonly Registration[],
  nonce?: string,
) => {
  if (registrations.length === 0) return;
  const declared = new Map<string, ObservedRegistration>();
  const visit = (rules: CSSRuleList) => {
    for (const rule of rules) {
      if ('syntax' in rule && 'inherits' in rule && 'initialValue' in rule && 'name' in rule) {
        const property = rule as CSSPropertyRule;
        const entry = {
          syntax: property.syntax,
          inherits: property.inherits,
          initialValue: property.initialValue,
        };
        const previous = declared.get(property.name);
        if (previous && !sameRegistration(previous, entry)) {
          throw new Error(`Conflicting CSS property registration: ${property.name}`);
        }
        declared.set(property.name, entry);
      }
      if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const node of document.querySelectorAll<HTMLStyleElement>('style[data-stylesheet-id]')) {
    if (node.sheet) visit(node.sheet.cssRules);
  }
  for (const entry of registrations) {
    const previous = declared.get(entry.name);
    if (previous && !sameRegistration(previous, entry)) {
      throw new Error(`Conflicting CSS property registration: ${entry.name}`);
    }
  }
  const missing = registrations.filter((entry) => !declared.has(entry.name));
  if (missing.length === 0) return;
  createStylesheet({
    id: `property-types:${missing.map((entry) => entry.name).join(':')}`,
    nonce,
    rules: missing.map((entry) => ({
      selector: `@property ${entry.name}`,
      rules: {
        syntax: JSON.stringify(entry.syntax),
        inherits: String(entry.inherits),
        'initial-value': entry.initialValue,
      },
    })),
  }).mount(document);
};

const allocationRoot = (root: Document | ShadowRoot, selector: string): object => {
  if (root.nodeType !== 9) {
    if (selector !== ':host') throw new Error('Shadow theme sources must allocate on :host');
    return (root as ShadowRoot).host;
  }
  const targets = root.querySelectorAll(selector);
  if (targets.length !== 1) throw new Error('A document theme needs one explicit allocation root');
  return targets[0]!;
};

type RuntimeSetup = {
  (input: unknown): Theme['contract'];
  update(input: unknown): Theme['contract'];
  read(): unknown;
  readonly stylesheet: StylesheetState;
  readonly selector: string;
  manifest(): ThemeManifest;
  mount(root: Document | ShadowRoot): RuntimeSetup;
};

export function createThemeSetup<const Schema extends ThemeSchema, const Prefix extends string>(
  theme: Theme<Schema, Prefix>, options: ThemeSetupOptions,
): ThemeSetup<Schema, Prefix>;
export function createThemeSetup(theme: Theme, options: ThemeSetupOptions): unknown {
  const registrations = registrationsOf(theme);
  const sourceNames = new Set(theme.sources.map((source) => source.name));
  const mounts = new WeakMap<Document | ShadowRoot, RuntimeSetup>();
  const createServer = (): Stylesheet => createStylesheet({
    id: options.id,
    debugId: options.debugId,
    nonce: options.nonce,
    rules: registrations.map((entry) => ({
      selector: `@property ${entry.name}`,
      rules: {
        syntax: JSON.stringify(entry.syntax),
        inherits: String(entry.inherits),
        'initial-value': entry.initialValue,
      },
    })),
  });
  const server = createServer();
  const serverSelector = options.selector ?? ':root';
  const createHarness = (stylesheet: StylesheetState, selector: string, adopted: boolean) => {
    let initialized = adopted;
    const read = () => readThemeSources(theme, stylesheet, selector, options.layer);
    const patch = (input: unknown) => {
      if (!initialized) throw new Error('Initialize theme sources before updating');
      read(); // Verify current authoritative allocations before a partial commit.
      const declarations = encodeThemePatch(theme, input as ThemePatch<ThemeSchema>);
      if (Object.keys(declarations).length > 0) {
        stylesheet.update([{
          selector,
          layer: options.layer,
          rules: declarations,
        }]);
      }
      return theme.contract;
    };
    const setup = ((input: unknown) => {
      if (initialized) return patch(input);
      const resolved = resolveThemeInputs(theme, input as ThemeInput<ThemeSchema>);
      const sources = encodeThemePatch(theme, resolved as ThemePatch<ThemeSchema>);
      const formulas = Object.fromEntries(theme.tokens.map((token) => [token.name, token.value]));
      const selected = (variant: string) => (selector === ':host'
        ? `:host([data-theme-variant="${variant}"]), :host [data-theme-variant="${variant}"]`
        : `${selector}[data-theme-variant="${variant}"], ${selector} [data-theme-variant="${variant}"]`);
      stylesheet.update([
        {
          selector,
          layer: options.layer,
          rules: {
            ...sources,
            ...formulas,
            'color-scheme': 'light dark',
          },
        },
        {
          selector: selected('light'),
          layer: options.variantLayer ?? options.layer,
          rules: { 'color-scheme': 'light' },
        },
        {
          selector: selected('dark'),
          layer: options.variantLayer ?? options.layer,
          rules: { 'color-scheme': 'dark' },
        },
        ...(options.rules?.(selector) ?? []),
      ]);
      initialized = true;
      return theme.contract;
    }) as RuntimeSetup;
    setup.update = patch;
    setup.manifest = () => createThemeManifest(theme, {
      id: options.id,
      sheetId: options.id,
      selector,
      ...(options.layer === undefined ? {} : { layer: options.layer }),
    });
    setup.read = read;
    Reflect.defineProperty(setup, 'stylesheet', {
      value: stylesheet,
      enumerable: true,
    });
    Reflect.defineProperty(setup, 'selector', {
      value: selector,
      enumerable: true,
    });
    setup.mount = (root) => {
      const selectorForRoot = options.selector ?? (root.nodeType === 9 ? ':root' : ':host');
      const allocation = allocationRoot(root, selectorForRoot);
      const existing = mounts.get(root);
      if (existing) {
        existing.stylesheet.read(selectorForRoot, 'color-scheme', options.layer);
        return existing;
      }
      const nodes = [...root.querySelectorAll<HTMLStyleElement>('style[data-stylesheet-id]')]
        .filter((node) => node.dataset.stylesheetId === options.id);
      if (nodes.length > 1) throw new Error(`Ambiguous stylesheet ownership: ${options.id}`);
      // Validate SSR/source ownership before constructor defaults can touch an adopted sheet.
      if (nodes[0]) {
        claimThemeAllocations(theme, allocation, nodes[0], options.ownedNames);
      }
      let targetServer = server;
      if (selectorForRoot !== serverSelector && nodes.length === 0) {
        targetServer = createServer();
        const prepared = createHarness(targetServer, selectorForRoot, false);
        const hasSources = [...sourceNames].every(
          (name) => server.read(serverSelector, name, options.layer) !== undefined,
        );
        prepared(hasSources ? readThemeSources(theme, server, serverSelector, options.layer) : {});
      }
      const live = targetServer.mount(root);
      try {
        claimThemeAllocations(theme, allocation, live.element, options.ownedNames);
        const ownerDocument = root.nodeType === 9 ? root as Document : root.ownerDocument!;
        registerProperties(ownerDocument, registrations, live.element.nonce || undefined);
        const present = [...sourceNames].filter(
          (name) => live.read(selectorForRoot, name, options.layer) !== undefined,
        );
        if (present.length > 0 && present.length !== sourceNames.size) {
          throw new Error('Adopted theme stylesheet has incomplete source allocations');
        }
        const hasFormulas = theme.tokens.every(
          (token) => live.read(selectorForRoot, token.name, options.layer) !== undefined,
        );
        const hasAliases = (options.ownedNames ?? []).every(
          (name) => live.read(
            selectorForRoot,
            name,
            options.ownedNamesLayer ?? options.layer,
          ) !== undefined,
        );
        const complete = present.length === sourceNames.size && hasFormulas && hasAliases;
        const mounted = createHarness(live, selectorForRoot, complete);
        if (!complete) {
          if (nodes.length > 0) throw new Error('Adopted sheet is missing theme allocations');
          mounted({});
        }
        mounts.set(root, mounted);
        return mounted;
      } catch (error) {
        if (nodes.length === 0) {
          releaseThemeAllocations(allocation, live.element);
          live.element.remove();
        }
        throw error;
      }
    };
    return setup;
  };
  return createHarness(server, serverSelector, false);
}
