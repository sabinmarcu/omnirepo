import {
  colorCodec,
  jsonCodec,
  numberUnitCodec,
  sourceRepresentation,
} from './codecs.js';
import {
  immutable,
  isSource,
  numberCodec,
  source as sourceDescriptor,
  stringCodec,
  variantSource,
} from './descriptors.js';
import type {
  AssignmentScope,
  BoundSource,
  JsonValue,
  SourceCodec,
  SourceRepresentation,
  SourceTree,
  Theme,
  ThemeSchema,
  VariableDescriptor,
} from './types.js';

export type ManifestSource = {
  readonly name: string;
  readonly inputPath: readonly string[];
  readonly generatorPath: readonly string[];
  readonly scope: AssignmentScope;
  readonly codec: SourceRepresentation;
  readonly variant?: 'light' | 'dark';
  readonly member?: string;
};

export type ManifestDerivedOutput = {
  readonly role: 'derived';
  readonly name: string;
  readonly path: readonly string[];
  readonly scope: AssignmentScope;
  /** Transitive editable source allocation dependencies in source allocation order. */
  readonly sources: readonly string[];
};

export type ManifestStaticOutput = {
  readonly role: 'static';
  readonly path: readonly string[];
  readonly value: JsonValue;
};

export type ManifestOutput = ManifestDerivedOutput | ManifestStaticOutput;

export type ThemeManifest = {
  readonly version: 2;
  readonly id: string;
  readonly kind: 'direct' | 'family';
  readonly prefix: string;
  readonly allocationPrefix: string;
  readonly root: {
    readonly sheetId: string;
    readonly selector: string;
    readonly layer?: string;
  };
  readonly sources: readonly ManifestSource[];
  readonly outputs: readonly ManifestOutput[];
  readonly groups: readonly (readonly string[])[];
  readonly families?: readonly string[];
};

type ManifestOptions = {
  readonly id?: string;
  readonly sheetId: string;
  readonly selector?: string;
  readonly layer?: string;
  /** Family projection is used by theme-family's private allocation graph. */
  readonly kind?: 'family';
  readonly families?: readonly string[];
  readonly prefix?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
    && (Reflect.getPrototypeOf(value) === Object.prototype
      || Reflect.getPrototypeOf(value) === null)
    && Object.values(Object.getOwnPropertyDescriptors(value)).every((descriptor) => 'value' in descriptor)
);
const isDataArray = (value: unknown): value is readonly unknown[] => (
  Array.isArray(value)
    && Object.values(Object.getOwnPropertyDescriptors(value)).every((descriptor) => 'value' in descriptor)
);

const pathPart = (value: unknown): value is string => (
  typeof value === 'string' && /^[a-zA-Z][a-zA-Z\d-]*$/.test(value)
    && value !== 'constructor' && value !== 'prototype'
);
const prefix = (value: unknown): value is string => (
  typeof value === 'string' && /^[a-z][a-z\d-]*$/.test(value)
    && !value.endsWith('-') && !value.includes('--') && !value.startsWith('devtools-theme')
);
const familyName = (value: unknown): value is string => (
  typeof value === 'string' && /^[a-z][a-z\d]*(?:-[a-z\d]+)*$/.test(value)
    && !['constructor', 'prototype', '__proto__'].includes(value)
);
const sameKeys = (
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
) => (
  required.every((key) => Object.hasOwn(value, key))
    && Object.keys(value).every((key) => required.includes(key) || optional.includes(key))
);
function fail(message: string): never { throw new Error(`Invalid theme manifest: ${message}`); }
const pathKey = (value: readonly string[]) => JSON.stringify(value);
const hasPrefix = (path: readonly string[], prefixPath: readonly string[]) => (
  prefixPath.length <= path.length && prefixPath.every((part, index) => path[index] === part)
);

const clonePath = (value: unknown, field: string): readonly string[] => {
  if (!isDataArray(value) || !value.every(pathPart)) fail(`${field} must be a path`);
  return Object.freeze([...value]);
};

const cloneJson = (value: unknown): JsonValue => {
  const seen = new WeakSet<object>();
  const visit = (child: unknown): JsonValue => {
    if (child === null || typeof child === 'string' || typeof child === 'boolean') return child;
    if (typeof child === 'number') {
      if (!Number.isFinite(child)) fail('static output must be JSON-safe');
      return child;
    }
    if (typeof child !== 'object' || (!isDataArray(child) && !isRecord(child))) {
      return fail('static output must be JSON-safe');
    }
    if (seen.has(child)) return fail('static output must be acyclic');
    seen.add(child);
    if (isDataArray(child)) {
      const copy = Object.freeze(child.map(visit));
      seen.delete(child);
      return copy;
    }
    const copy = Object.create(null) as Record<string, JsonValue>;
    for (const [key, nested] of Object.entries(child)) {
      Reflect.defineProperty(copy, key, {
        value: visit(nested),
        enumerable: true,
        writable: false,
        configurable: false,
      });
    }
    seen.delete(child);
    return Object.freeze(copy);
  };
  return visit(value);
};

const cloneRepresentation = (value: unknown): SourceRepresentation => {
  if (!isRecord(value) || typeof value.kind !== 'string') fail('codec must be declared');
  if (value.kind === 'number') {
    if (!sameKeys(value, ['kind'], ['unit']) || (value.unit !== undefined
      && (typeof value.unit !== 'string' || !/^[a-zA-Z%][a-zA-Z\d%]*$/.test(value.unit)))) {
      fail('number codec is malformed');
    }
    return Object.freeze(value.unit === undefined
      ? { kind: 'number' }
      : {
        kind: 'number',
        unit: value.unit,
      });
  }
  if (value.kind === 'string' || value.kind === 'color' || value.kind === 'json') {
    if (!sameKeys(value, ['kind'])) fail('codec is malformed');
    return Object.freeze({ kind: value.kind });
  }
  return fail('codec is unsupported');
};

const sourceName = (
  kind: ThemeManifest['kind'],
  allocationPrefix: string,
  source: Pick<ManifestSource, 'inputPath' | 'scope' | 'member'>,
): string => {
  if (kind === 'direct') return `--${allocationPrefix}-source-${source.inputPath.join('-')}`;
  if (source.scope === 'shared') {
    if (source.inputPath[0] !== 'shared') fail('shared source path must begin with shared');
    return `--${allocationPrefix}-shared-source-${source.inputPath.slice(1).join('-')}`;
  }
  if (source.inputPath[0] !== 'families' || source.inputPath[1] !== source.member) {
    fail('contextual source member does not match its path');
  }
  return `--${allocationPrefix}-families-${source.member}-source-${source.inputPath.slice(2).join('-')}`;
};

const cloneSource = (
  value: unknown,
  kind: ThemeManifest['kind'],
  allocationPrefix: string,
  families: ReadonlySet<string>,
): ManifestSource => {
  if (!isRecord(value) || !sameKeys(
    value,
    ['name', 'inputPath', 'generatorPath', 'scope', 'codec'],
    ['variant', 'member'],
  )) {
    return fail('source is malformed');
  }
  if (typeof value.name !== 'string' || (value.scope !== 'shared' && value.scope !== 'contextual')) {
    return fail('source name or scope is malformed');
  }
  const { scope } = value;
  const inputPath = clonePath(value.inputPath, 'source inputPath');
  const generatorPath = clonePath(value.generatorPath, 'source generatorPath');
  if (inputPath.length === 0 || generatorPath.length === 0
    || !hasPrefix(inputPath, generatorPath)) {
    return fail('generatorPath must prefix source inputPath');
  }
  const variant = value.variant === undefined ? undefined : value.variant;
  if (variant !== undefined && variant !== 'light' && variant !== 'dark') fail('source variant is malformed');
  if (variant !== undefined && inputPath.at(-1) !== variant) fail('source variant must suffix inputPath');
  const member = value.member === undefined ? undefined : value.member;
  if (member !== undefined && !familyName(member)) fail('source member is malformed');
  if (kind === 'direct' && member !== undefined) fail('direct source cannot have a family member');
  if (kind === 'family') {
    if (scope === 'contextual') {
      if (!member || !families.has(member)) fail('contextual source member is unknown');
    } else if (member !== undefined) fail('shared source cannot have a family member');
  }
  const source = Object.freeze({
    name: value.name,
    inputPath,
    generatorPath,
    scope,
    codec: cloneRepresentation(value.codec),
    ...(variant === undefined ? {} : { variant }),
    ...(member === undefined ? {} : { member }),
  });
  if (source.name !== sourceName(kind, allocationPrefix, source)) fail('source name does not match its path');
  return source;
};

const cloneOutput = (value: unknown, allocationPrefix: string): ManifestOutput => {
  if (!isRecord(value) || typeof value.role !== 'string') return fail('output is malformed');
  if (value.role === 'derived') {
    if (!sameKeys(value, ['role', 'name', 'path', 'scope', 'sources']) || typeof value.name !== 'string'
      || (value.scope !== 'shared' && value.scope !== 'contextual')) return fail('derived output is malformed');
    const { scope } = value;
    const path = clonePath(value.path, 'derived output path');
    if (path.length === 0 || value.name !== `--${allocationPrefix}-${path.join('-')}`
      || value.name.startsWith(`--${allocationPrefix}-private-`)) {
      return fail('derived output enters a private namespace');
    }
    if (!isDataArray(value.sources) || value.sources.some((source) => typeof source !== 'string')) {
      return fail('derived output sources are malformed');
    }
    const sources = Object.freeze([...value.sources] as string[]);
    if (new Set(sources).size !== sources.length) fail('derived output sources are duplicate');
    return Object.freeze({
      role: 'derived',
      name: value.name,
      path,
      scope,
      sources,
    });
  }
  if (value.role === 'static') {
    if (!sameKeys(value, ['role', 'path', 'value'])) return fail('static output is malformed');
    const path = clonePath(value.path, 'static output path');
    if (path.length === 0) return fail('static output path is empty');
    return Object.freeze({
      role: 'static',
      path,
      value: cloneJson(value.value),
    });
  }
  return fail('output role is unsupported');
};

const cloneGroups = (value: unknown): readonly (readonly string[])[] => {
  if (!isDataArray(value)) fail('groups must be an array');
  const seen = new Set<string>();
  return Object.freeze(value.map((group) => {
    const path = clonePath(group, 'group');
    if (path.length === 0 || seen.has(pathKey(path))) fail('group is duplicate or empty');
    seen.add(pathKey(path));
    return path;
  }));
};

/** Validate, own, and freeze only declarative data before an inspector can consume it. */
export function validateThemeManifest(value: unknown): ThemeManifest {
  if (!isRecord(value) || !sameKeys(
    value,
    ['version', 'id', 'kind', 'prefix', 'allocationPrefix', 'root', 'sources', 'outputs', 'groups'],
    ['families'],
  )) return fail('shape is malformed');
  if (value.version !== 2 || typeof value.id !== 'string' || value.id === ''
    || value.id.startsWith('devtools-theme') || (value.kind !== 'direct' && value.kind !== 'family')
    || !prefix(value.prefix) || !prefix(value.allocationPrefix)) return fail('identity is malformed');
  if (!isRecord(value.root) || !sameKeys(value.root, ['sheetId', 'selector'], ['layer'])
    || typeof value.root.sheetId !== 'string' || value.root.sheetId === ''
    || typeof value.root.selector !== 'string' || value.root.selector === ''
    || value.root.selector.includes(':host') || /[,;{}]/.test(value.root.selector)
    || (value.root.layer !== undefined && (typeof value.root.layer !== 'string' || value.root.layer === ''))) {
    return fail('root is malformed');
  }
  const families = value.families === undefined ? undefined : value.families;
  if (families !== undefined && (!isDataArray(families) || !families.every(familyName))) {
    return fail('families are malformed');
  }
  const familyList: readonly string[] | undefined = families === undefined
    ? undefined
    : Object.freeze([...families] as string[]);
  if (familyList && new Set(familyList).size !== familyList.length) fail('families are duplicate');
  if (value.kind === 'direct' && familyList !== undefined) fail('direct manifest cannot have families');
  if (value.kind === 'family' && familyList === undefined) fail('family manifest must declare members');
  if (!isDataArray(value.sources) || !isDataArray(value.outputs)) return fail('allocations are malformed');
  const { kind, allocationPrefix } = value;
  const familySet = new Set(familyList);
  const sources = Object.freeze(value.sources.map(
    (entry) => cloneSource(entry, kind, allocationPrefix, familySet),
  ));
  const outputs = Object.freeze(value.outputs.map((entry) => cloneOutput(entry, allocationPrefix)));
  const sourceNames = new Set<string>();
  const sourcePaths = new Set<string>();
  for (const entry of sources) {
    if (sourceNames.has(entry.name) || sourcePaths.has(pathKey(entry.inputPath))) fail('source is duplicate');
    sourceNames.add(entry.name);
    sourcePaths.add(pathKey(entry.inputPath));
  }
  const variants = new Map<string, ManifestSource[]>();
  for (const entry of sources.filter((allocation) => allocation.variant !== undefined)) {
    const key = `${pathKey(entry.generatorPath)}:${pathKey(entry.inputPath.slice(0, -1))}`;
    const pair = variants.get(key) ?? [];
    pair.push(entry);
    variants.set(key, pair);
  }
  for (const entries of variants.values()) {
    const first = entries[0]!;
    if (entries.length !== 2 || new Set(entries.map((entry) => entry.variant)).size !== 2
      || entries.some((entry) => entry.scope !== first.scope || entry.member !== first.member
        || JSON.stringify(entry.codec) !== JSON.stringify(first.codec))) {
      fail('variant source is incomplete');
    }
  }
  for (let index = 0; index < sources.length; index += 1) {
    for (let other = index + 1; other < sources.length; other += 1) {
      const left = sources[index]!;
      const right = sources[other]!;
      if (hasPrefix(left.inputPath, right.inputPath)
        || hasPrefix(right.inputPath, left.inputPath)) {
        fail('source paths overlap');
      }
      if (pathKey(left.generatorPath) === pathKey(right.generatorPath)) {
        if (left.scope !== right.scope || left.member !== right.member) {
          fail('generator source scopes conflict');
        }
      } else if (hasPrefix(left.generatorPath, right.generatorPath)
        || hasPrefix(right.generatorPath, left.generatorPath)) {
        fail('generator paths overlap');
      }
    }
  }
  const outputNames = new Set<string>();
  const outputPaths = new Set<string>();
  for (const entry of outputs) {
    const key = pathKey(entry.path);
    if (outputPaths.has(key)) fail('output path is duplicate');
    outputPaths.add(key);
    if (entry.role === 'derived') {
      if (outputNames.has(entry.name) || sourceNames.has(entry.name)) fail('output name is duplicate');
      outputNames.add(entry.name);
    }
  }
  for (const entry of outputs) {
    if (entry.role === 'derived' && entry.sources.some((source) => !sourceNames.has(source))) {
      fail('derived output source is not an editable source');
    }
  }
  const groups = cloneGroups(value.groups);
  return Object.freeze({
    version: 2,
    id: value.id,
    kind: value.kind,
    prefix: value.prefix,
    allocationPrefix: value.allocationPrefix,
    root: Object.freeze({
      sheetId: value.root.sheetId,
      selector: value.root.selector,
      ...(value.root.layer === undefined ? {} : { layer: value.root.layer }),
    }),
    sources,
    outputs,
    groups,
    ...(familyList === undefined ? {} : { families: familyList }),
  });
}

const schemaGroups = (schema: ThemeSchema, path: readonly string[], output: string[][]) => {
  for (const [key, node] of Object.entries(schema)) {
    if (node.kind === 'variable') {
      const sourceGroups = (tree: SourceTree, nested: readonly string[]) => {
        if (isSource(tree)) return;
        output.push([...path, key, ...nested]);
        for (const [childKey, child] of Object.entries(tree)) {
          sourceGroups(child, [...nested, childKey]);
        }
      };
      sourceGroups((node as VariableDescriptor).sources, []);
    } else if (node.kind !== 'static') {
      output.push([...path, key]);
      schemaGroups(node as ThemeSchema, [...path, key], output);
    }
  }
};

const staticOutputs = (
  schema: ThemeSchema,
  path: readonly string[],
  output: ManifestStaticOutput[],
) => {
  for (const [key, node] of Object.entries(schema)) {
    const nodePath = [...path, key];
    if (node.kind === 'static') {
      output.push(Object.freeze({
        role: 'static',
        path: Object.freeze(nodePath),
        value: cloneJson(node.output),
      }));
    } else if (node.kind !== 'variable') staticOutputs(node as ThemeSchema, nodePath, output);
  }
};

/** Project declarations only; live CSS values and the DOM are never consulted. */
export function createThemeManifest(
  theme: Pick<Theme, 'prefix' | 'definition' | 'sources' | 'tokens'>,
  options: ManifestOptions,
): ThemeManifest {
  const kind = options.kind ?? 'direct';
  const sourceByName = new Map<string, typeof theme.sources[number]>(
    theme.sources.map((source) => [source.name, source]),
  );
  const tokenByName = new Map<string, typeof theme.tokens[number]>(
    theme.tokens.map((token) => [token.name, token]),
  );
  if (sourceByName.size !== theme.sources.length || tokenByName.size !== theme.tokens.length
    || theme.sources.some((source) => tokenByName.has(source.name))) {
    throw new Error('Cannot manifest duplicate theme allocation');
  }
  const visiting = new Set<string>();
  const resolved = new Map<string, ReadonlySet<string>>();
  const resolveTokenSources = (name: string): ReadonlySet<string> => {
    const cached = resolved.get(name);
    if (cached) return cached;
    const token = tokenByName.get(name);
    if (!token) throw new Error(`Cannot manifest unknown theme dependency: ${name}`);
    if (visiting.has(name)) throw new Error(`Cannot manifest cyclic theme dependency: ${name}`);
    visiting.add(name);
    const dependencies = new Set<string>();
    for (const dependency of token.dependencies) {
      if (sourceByName.has(dependency)) dependencies.add(dependency);
      else for (const source of resolveTokenSources(dependency)) dependencies.add(source);
    }
    visiting.delete(name);
    const frozen = new Set(dependencies);
    resolved.set(name, frozen);
    return frozen;
  };
  for (const token of theme.tokens) resolveTokenSources(token.name);
  const outputSources = (name: string) => {
    const dependencies = resolveTokenSources(name);
    return theme.sources.filter((source) => dependencies.has(source.name))
      .map((source) => source.name);
  };
  const input = {
    version: 2 as const,
    id: options.id ?? options.sheetId,
    kind,
    prefix: options.prefix ?? theme.prefix,
    allocationPrefix: theme.prefix,
    root: {
      sheetId: options.sheetId,
      selector: options.selector ?? ':root',
      ...(options.layer === undefined ? {} : { layer: options.layer }),
    },
    sources: theme.sources.map((entry) => {
      const representation = sourceRepresentation(entry.descriptor.codec as SourceCodec<unknown>);
      if (!representation) throw new Error(`Cannot manifest unsupported source codec: ${entry.name}`);
      return {
        name: entry.name,
        inputPath: entry.variant ? [...entry.path, entry.variant] : [...entry.path],
        generatorPath: [...entry.generatorPath],
        scope: entry.scope,
        codec: representation,
        ...(entry.variant === undefined ? {} : { variant: entry.variant }),
        ...(kind === 'family' && entry.scope === 'contextual' ? { member: entry.path[1] } : {}),
      };
    }),
    outputs: [
      ...theme.tokens.filter((entry) => entry.visibility === 'public').map((entry) => ({
        role: 'derived' as const,
        name: entry.name,
        path: [...entry.path],
        scope: entry.scope,
        sources: outputSources(entry.name),
      })),
      ...(() => {
        const entries: ManifestStaticOutput[] = [];
        staticOutputs(theme.definition.schema, [], entries);
        return entries;
      })(),
    ],
    groups: (() => {
      const groups: string[][] = [];
      schemaGroups(theme.definition.schema, [], groups);
      return groups;
    })(),
    ...(kind === 'family' ? { families: options.families } : {}),
  };
  return validateThemeManifest(input);
}

/** Validated manifest JSON escaped for the body of an inline `<script type="application/json">`. */
export function serializeThemeManifests(manifests: readonly ThemeManifest[]): string {
  return JSON.stringify(manifests.map(validateThemeManifest))
    .replaceAll(/[<>&\u{2028}\u{2029}]/gu, (character) => ({
      '<': '\\u003c',
      '>': '\\u003e',
      '&': '\\u0026',
      '\u{2028}': '\\u2028',
      '\u{2029}': '\\u2029',
    })[character]!);
}

/** Serialize explicit manifests without making discovery or browser APIs mandatory. */
export function embedThemeManifests(
  manifests: readonly ThemeManifest[],
  options: { readonly nonce?: string } = {},
): string {
  const json = serializeThemeManifests(manifests);
  const nonce = options.nonce === undefined
    ? ''
    : ` nonce="${options.nonce.replaceAll(/[&"'<>]/g, (character) => ({
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '<': '&lt;',
      '>': '&gt;',
    })[character]!)}"`;
  return `<script type="application/json" data-theme-manifests${nonce}>${json}</script>`;
}

/** Recreate only editable descriptors, never generators, defaults, formulas, or static outputs. */
export function codecFromRepresentation(
  representation: SourceRepresentation,
): SourceCodec<unknown> {
  switch (representation.kind) {
    case 'number': { return representation.unit === undefined
      ? numberCodec
      : numberUnitCodec(representation.unit);
    }
    case 'string': { return stringCodec;
    }
    case 'color': { return colorCodec;
    }
    case 'json': { return jsonCodec;
    }
    default: { return fail('codec is unsupported');
    }
  }
}

const emptyGroup = () => Object.create(null) as Record<string, unknown>;
const freezeTree = <Value>(value: Value): Value => immutable(value);

/** Internal inspection bridge using the existing input encoder and live source reader. */
export function themeFromManifest(input: ThemeManifest): Theme {
  const manifest = validateThemeManifest(input);
  const sourceByGenerator = new Map<string, ManifestSource[]>();
  for (const entry of manifest.sources) {
    const key = pathKey(entry.generatorPath);
    const entries = sourceByGenerator.get(key) ?? [];
    entries.push(entry);
    sourceByGenerator.set(key, entries);
  }
  const generatorPaths = [...sourceByGenerator.values()]
    .map((entries) => entries[0]!.generatorPath);
  const root = emptyGroup();
  const putGroup = (path: readonly string[]) => {
    let target = root;
    for (const part of path) {
      const current = target[part];
      if (current === undefined) target[part] = emptyGroup();
      else if (!isRecord(current)) fail('group collides with a source descriptor');
      target = target[part] as Record<string, unknown>;
    }
  };
  const groupLeaves = new Set<string>();
  for (const group of manifest.groups) {
    const generator = generatorPaths.some((candidate) => pathKey(candidate) === pathKey(group));
    const nestedGenerator = generatorPaths.some((candidate) => hasPrefix(candidate, group));
    const insideGenerator = generatorPaths.some((candidate) => candidate.length < group.length
      && hasPrefix(group, candidate));
    if (!generator && !insideGenerator) putGroup(group);
    if (!generator && !nestedGenerator && !insideGenerator) groupLeaves.add(pathKey(group));
  }
  const descriptorFor = (generatorPath: readonly string[], entries: readonly ManifestSource[]) => {
    let sourceTree: unknown = emptyGroup();
    const putSourceGroup = (path: readonly string[]) => {
      if (!isRecord(sourceTree)) fail('source group collides with a scalar source');
      let target: Record<string, unknown> = sourceTree;
      for (const part of path) {
        const current = target[part];
        if (current === undefined) target[part] = emptyGroup();
        else if (!isRecord(current)) fail('source group collides with a source');
        target = target[part] as Record<string, unknown>;
      }
    };
    for (const group of manifest.groups) {
      if (group.length >= generatorPath.length && hasPrefix(group, generatorPath)) {
        putSourceGroup(group.slice(generatorPath.length));
      }
    }
    const byInput = new Map<string, ManifestSource[]>();
    for (const entry of entries) {
      const localPath = entry.inputPath.slice(generatorPath.length);
      const base = entry.variant === undefined ? localPath : localPath.slice(0, -1);
      const key = pathKey(base);
      const pair = byInput.get(key) ?? [];
      pair.push(entry);
      byInput.set(key, pair);
    }
    for (const [key, entriesAtPath] of byInput) {
      const path = JSON.parse(key) as string[];
      const first = entriesAtPath[0]!;
      const codec = codecFromRepresentation(first.codec);
      let descriptor: unknown;
      if (first.variant === undefined) {
        if (entriesAtPath.length !== 1) fail('source is duplicated');
        descriptor = sourceDescriptor(codec);
      } else {
        const variants = new Set(entriesAtPath.map((entry) => entry.variant));
        if (entriesAtPath.length !== 2 || !variants.has('light') || !variants.has('dark')
          || entriesAtPath.some(
            (entry) => JSON.stringify(entry.codec) !== JSON.stringify(first.codec),
          )) {
          fail('variant source is incomplete');
        }
        descriptor = variantSource(codec);
      }
      if (path.length === 0) {
        if (!isRecord(sourceTree) || Object.keys(sourceTree).length > 0) {
          fail('source path collides with a group');
        }
        sourceTree = descriptor;
      } else {
        if (!isRecord(sourceTree)) fail('source path collides with a scalar source');
        let target = sourceTree;
        for (const part of path.slice(0, -1)) {
          const current = target[part];
          if (current === undefined) target[part] = emptyGroup();
          else if (!isRecord(current)) fail('source path collides with a group');
          target = target[part] as Record<string, unknown>;
        }
        const leaf = path.at(-1)!;
        if (target[leaf] !== undefined) fail('source path is duplicated');
        target[leaf] = descriptor;
      }
    }
    return Object.freeze({
      kind: 'variable' as const,
      scope: entries[0]!.scope,
      sources: freezeTree(sourceTree) as SourceTree,
      tokens: Object.freeze({}),
      owner: Object.freeze({}),
    });
  };
  const descriptors = new Map<string, ReturnType<typeof descriptorFor>>();
  for (const [key, entries] of sourceByGenerator) {
    const generatorPath = JSON.parse(key) as string[];
    let target = root;
    for (const part of generatorPath.slice(0, -1)) {
      const current = target[part];
      if (current === undefined) target[part] = emptyGroup();
      else if (!isRecord(current)) fail('generator path collides with a descriptor');
      target = target[part] as Record<string, unknown>;
    }
    const leaf = generatorPath.at(-1)!;
    if (target[leaf] !== undefined && !isRecord(target[leaf])) fail('generator path is duplicated');
    const descriptor = descriptorFor(generatorPath, entries);
    target[leaf] = descriptor;
    descriptors.set(key, descriptor);
  }
  for (const key of groupLeaves) {
    const group = JSON.parse(key) as string[];
    let target = root;
    for (const part of group.slice(0, -1)) target = target[part] as Record<string, unknown>;
    const leaf = group.at(-1)!;
    if (isRecord(target[leaf])
      && Object.keys(target[leaf] as Record<string, unknown>).length === 0) {
      target[leaf] = Object.freeze({
        kind: 'variable' as const,
        scope: 'shared' as const,
        sources: Object.freeze({}),
        tokens: Object.freeze({}),
        owner: Object.freeze({}),
      });
    }
  }
  const sources: readonly BoundSource[] = Object.freeze(manifest.sources.map((entry) => {
    const path = entry.variant === undefined ? [...entry.inputPath] : entry.inputPath.slice(0, -1);
    let descriptor = descriptors.get(pathKey(entry.generatorPath))!.sources;
    for (const part of path.slice(entry.generatorPath.length)) {
      if (isSource(descriptor)) fail('source path enters another source');
      descriptor = descriptor[part]!;
    }
    if (!isSource(descriptor)) fail('source binding must address a source descriptor');
    return Object.freeze({
      role: 'source' as const,
      scope: entry.scope,
      generatorPath: entry.generatorPath,
      path: Object.freeze(path),
      name: entry.name as BoundSource['name'],
      descriptor,
      ...(entry.variant === undefined ? {} : { variant: entry.variant }),
    });
  }));
  return Object.freeze({
    prefix: manifest.allocationPrefix,
    definition: Object.freeze({
      schema: freezeTree(root) as ThemeSchema,
      sources,
      tokens: Object.freeze([]),
    }),
    contract: Object.freeze({}),
    variables: Object.freeze({}),
    sources,
    tokens: Object.freeze([]),
  });
}
