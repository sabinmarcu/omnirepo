import {
  bindTheme,
  createThemeSetup,
  createThemeManifest,
  rebaseThemeDefinition,
  validateThemeManifest,
} from '@sabinmarcu/theme-core';
import type {
  CompiledTheme,
  Theme,
  ThemeSchema,
  ThemeManifest,
  ThemeSetup,
  ThemeSetupOptions,
} from '@sabinmarcu/theme-core';
import { partitionThemeDefinition } from './partition.js';
import type {
  FamilyBinding,
  FamilyInput,
  FamilyOptions,
  FamilyPatch,
  ThemeFamily,
} from './types.js';

type RecordInput = Record<string, unknown>;
const record = (value: unknown): RecordInput => {
  if (value === undefined) return {};
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected a family input object');
  }
  return value as RecordInput;
};
const emptyInput = (value: unknown) => {
  if (Object.keys(record(value)).length > 0) throw new Error('This scope has no source inputs');
};
const validName = (value: string) => /^[a-z][a-z\d]*(?:-[a-z\d]+)*$/.test(value);
const reservedNames = new Set(['base', 'constructor', 'prototype', '__proto__']);
const pathKey = (path: readonly string[]) => JSON.stringify(path);

type RuntimeFamily = {
  (input: unknown): Theme['contract'];
  update(input: unknown): Theme['contract'];
  pick(member: string, selector?: string): Theme['contract'];
  read(): { shared: unknown; families: Record<string, unknown> };
  manifest(): ThemeManifest;
  mount(root: Document | ShadowRoot): RuntimeFamily;
  readonly stylesheet: ThemeSetup<ThemeSchema, string>['stylesheet'];
  readonly selector: string;
};

const memberView = (
  schema: ThemeSchema,
  publicView: RecordInput,
  privateView: RecordInput,
): RecordInput => (
  Object.freeze(Object.fromEntries(Object.entries(schema).map(([key, node]) => {
    if (node.kind === 'static' || (node.kind === 'variable' && node.scope === 'shared')) {
      return [key, publicView[key]];
    }
    if (node.kind === 'variable') return [key, privateView[key]];
    return [key, memberView(
      node as ThemeSchema,
      publicView[key] as RecordInput,
      privateView[key] as RecordInput ?? {},
    )];
  })))
);

/** Compose independent root allocations from intrinsic descriptor scope, never a vary list. */
export function createThemeFamily<
  const Schema extends ThemeSchema,
  const Prefix extends string,
  const Names extends readonly string[],
  const Id extends string,
>(theme: Theme<Schema, Prefix>, options: FamilyOptions<Names, Id>):
ThemeFamily<Schema, Prefix, Names, Id>;
export function createThemeFamily(
  theme: Theme,
  options: FamilyOptions<readonly string[], string>,
): unknown {
  if (typeof options.id !== 'string' || !validName(options.id)) {
    throw new Error('Family configuration id must be a kebab namespace');
  }
  if (!Array.isArray(options.families)) throw new Error('Family members must be an array');
  const members = ['base', ...options.families];
  const names = new Set<string>(['base']);
  for (const member of options.families) {
    if (typeof member !== 'string' || !validName(member)
      || reservedNames.has(member) || names.has(member)) {
      throw new Error(`Invalid or duplicate family member: ${member}`);
    }
    names.add(member);
  }
  const shared = partitionThemeDefinition(theme.definition, 'shared');
  const contextual = partitionThemeDefinition(theme.definition, 'contextual');
  const hasShared = Object.keys(shared.schema).length > 0;
  const hasContextual = Object.keys(contextual.schema).length > 0;
  const parts: CompiledTheme[] = [rebaseThemeDefinition(shared, ['shared'])];
  for (const member of members) parts.push(rebaseThemeDefinition(contextual, ['families', member]));
  const schema: ThemeSchema = Object.freeze({
    shared: shared.schema,
    families: Object.freeze(Object.fromEntries(
      members.map((member) => [member, contextual.schema]),
    )),
  });
  const definition: CompiledTheme = Object.freeze({
    schema,
    sources: Object.freeze(parts.flatMap((part) => part.sources)),
    tokens: Object.freeze(parts.flatMap((part) => part.tokens)),
  });
  const allocationNames = new Set<string>();
  for (const allocation of [...definition.sources, ...definition.tokens]) {
    if (allocationNames.has(allocation.name)) {
      throw new Error(`Family allocation name collision: ${allocation.name}`);
    }
    allocationNames.add(allocation.name);
  }
  const privatePrefix = `${theme.prefix}-family-${options.id}`;
  const privateTheme = bindTheme<ThemeSchema, string>(definition, { prefix: privatePrefix });
  const publicContextual = theme.tokens.filter((token) => token.scope === 'contextual'
    && token.visibility === 'public');
  const publicShared = theme.tokens.filter((token) => token.scope === 'shared'
    && token.visibility === 'public');
  const allocated = new Map(privateTheme.tokens.filter((token) => token.visibility === 'public')
    .map((token) => [pathKey(token.path), token.name]));
  const contextualMappings = Object.freeze(Object.fromEntries(members.map((member) => [member,
    Object.freeze(Object.fromEntries(publicContextual.map((token) => [token.name,
      `var(${allocated.get(pathKey(['families', member, ...token.path]))!})`])))])));
  const sharedMapping = Object.freeze(Object.fromEntries(publicShared.map((token) => [token.name,
    `var(${allocated.get(pathKey(['shared', ...token.path]))!})`])));
  const selectors = Object.freeze(Object.fromEntries(members.map((member) => [member,
    `[data-theme-family="${member}"]`])));
  const themes = Object.freeze(Object.fromEntries(members.map((member) => [member,
    memberView(
      theme.definition.schema,
      theme.contract,
      (privateTheme.contract.families as Record<string, RecordInput>)[member]!,
    )])));
  const bindings: readonly FamilyBinding[] = Object.freeze(
    privateTheme.sources.map((source) => Object.freeze({
      name: source.name,
      inputPath: Object.freeze(source.variant
        ? [...source.path, source.variant]
        : [...source.path]),
      scope: source.scope,
      member: source.scope === 'contextual' ? source.path[1] : undefined,
      variant: source.variant,
      generatorPath: source.generatorPath,
    })),
  );
  const initialRules: NonNullable<ThemeSetupOptions['rules']> = (selector) => [
    {
      selector,
      layer: options.mappingLayer ?? options.layer,
      rules: {
        ...sharedMapping,
        ...contextualMappings.base,
      },
    },
    ...members.map((member) => ({
      selector: selector === ':host'
        ? `:host(${selectors[member]}), :host ${selectors[member]}`
        : `${selector}${selectors[member]}, ${selector} ${selectors[member]}`,
      layer: options.mappingLayer ?? options.layer,
      rules: contextualMappings[member],
    })),
  ];
  const renderer = createThemeSetup(privateTheme, {
    id: options.id,
    nonce: options.nonce,
    debugId: options.debugId,
    selector: options.selector,
    layer: options.layer,
    variantLayer: options.variantLayer,
    ownedNamesLayer: options.mappingLayer,
    rules: initialRules,
    ownedNames: [...publicShared, ...publicContextual].map((token) => token.name),
  });
  const normalize = (input: unknown, initial: boolean): RecordInput => {
    const provided = record(input);
    for (const key of Object.keys(provided)) {
      if (key !== 'shared' && key !== 'families') throw new Error(`Unknown family container: ${key}`);
    }
    const familyInputs = record(provided.families);
    for (const member of Object.keys(familyInputs)) {
      if (!names.has(member)) throw new Error(`Unknown family member: ${member}`);
    }
    const normalized: RecordInput = {};
    if (hasShared) {
      if (initial || provided.shared !== undefined) {
        normalized.shared = provided.shared === undefined ? {} : provided.shared;
      }
    } else emptyInput(provided.shared);
    if (hasContextual) {
      if (initial) {
        normalized.families = Object.fromEntries(members.map((member) => [member,
          familyInputs[member] === undefined ? {} : familyInputs[member]]));
      } else if (provided.families !== undefined) normalized.families = familyInputs;
    } else for (const value of Object.values(familyInputs)) emptyInput(value);
    return normalized;
  };
  const mounts = new WeakMap<Document | ShadowRoot, RuntimeFamily>();
  const wrap = (live: ThemeSetup<ThemeSchema, string>, adopted: boolean): RuntimeFamily => {
    let initialized = adopted;
    const setup = ((input: unknown) => {
      live(normalize(input, !initialized) as FamilyInput<ThemeSchema, string>);
      initialized = true;
      return theme.contract;
    }) as RuntimeFamily;
    setup.update = (input) => {
      live.update(normalize(input, false) as FamilyPatch<ThemeSchema, string>);
      return theme.contract;
    };
    setup.read = () => {
      const current = live.read() as { shared?: unknown; families?: Record<string, unknown> };
      return {
        shared: current.shared ?? {},
        families: Object.fromEntries(members.map((member) => [member,
          current.families?.[member] ?? {}])),
      };
    };
    setup.manifest = () => {
      const manifest = createThemeManifest(privateTheme, {
        sheetId: live.stylesheet.id,
        selector: live.selector,
        layer: options.layer,
        kind: 'family',
        prefix: theme.prefix,
        families: members,
      });
      const staticOutputs = createThemeManifest(theme, {
        sheetId: live.stylesheet.id,
        selector: live.selector,
      }).outputs.filter((output) => output.role === 'static');
      const groups = new Map(manifest.groups.map((path) => [pathKey(path), path]));
      for (const path of [['shared'], ['families'], ...members.map((member) => ['families', member])]) {
        groups.set(pathKey(path), path);
      }
      return validateThemeManifest({
        ...manifest,
        kind: 'family',
        prefix: theme.prefix,
        families: members,
        groups: [...groups.values()],
        sources: manifest.sources.map((source) => ({
          ...source,
          member: source.scope === 'contextual' ? source.inputPath[1] : undefined,
        })),
        outputs: [...manifest.outputs, ...staticOutputs],
      });
    };
    setup.pick = (member, selector = live.selector) => {
      if (!names.has(member)) throw new Error(`Unknown family member: ${member}`);
      if (!initialized) throw new Error('Initialize family sources before picking');
      const mappings = contextualMappings[member]!;
      if (Object.keys(mappings).length > 0) {
        live.stylesheet.update([{
          selector,
          layer: options.mappingLayer ?? options.layer,
          rules: mappings,
        }]);
      }
      return theme.contract;
    };
    setup.mount = (root) => {
      const mounted = live.mount(root);
      const existing = mounts.get(root);
      if (existing) return existing;
      const family = wrap(mounted, true);
      mounts.set(root, family);
      return family;
    };
    for (const [key, value] of Object.entries({
      contract: theme.contract,
      families: Object.freeze([...members]),
      selectors,
      themes,
      bindings,
    })) {
      Reflect.defineProperty(setup, key, {
        value,
        enumerable: true,
      });
    }
    Reflect.defineProperty(setup, 'stylesheet', {
      value: live.stylesheet,
      enumerable: true,
    });
    Reflect.defineProperty(setup, 'selector', {
      value: live.selector,
      enumerable: true,
    });
    return setup;
  };
  return wrap(renderer, false);
}
