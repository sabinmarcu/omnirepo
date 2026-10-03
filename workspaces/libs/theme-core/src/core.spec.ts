import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  bindTheme,
  claimThemeAllocations,
  compileTheme,
  css,
  createThemeManifest,
  createThemeSetup,
  defineTheme,
  embedThemeManifests,
  encodeThemePatch,
  jsonCodec,
  numberCodec,
  numberUnitCodec,
  registered,
  readThemeSources,
  releaseThemeAllocations,
  resolveThemeInputs,
  source,
  staticGenerator,
  stringCodec,
  validateThemeManifest,
  variantSource,
  variableGenerator,
} from './index.js';
import { themeFromManifest } from './manifest.js';
import type { ThemeSchema } from './index.js';

const colorRegistration = {
  syntax: '<color>',
  inherits: false,
  initialValue: 'white',
} as const;

const opaqueCodec = {
  representation: { kind: 'number' as const },
  encode(value: { readonly value: string }) {
    if (!value.value) throw new Error('Opaque values need a value');
    return value.value;
  },
  decode(value: string) {
    return { value };
  },
};

const createDescriptor = () => variableGenerator({
  scope: 'shared',
  sources: {
    colors: variantSource(stringCodec, {
      light: 'white',
      dark: 'black',
    }, colorRegistration),
    metrics: {
      gap: source(numberCodec, 8),
      opaque: source(opaqueCodec),
    },
  },
  build: (sources, { privateToken }) => ({
    tokens: {
      surface: css`linear-gradient(${sources.colors.light}, var(--foreign-surface))`,
      registered: registered(css`${privateToken('contrast')}`, colorRegistration),
    },
    privateTokens: {
      contrast: css`color-mix(in srgb, ${sources.colors.dark}, ${sources.metrics.gap})`,
    },
  }),
});

const schema = () => ({
  paint: createDescriptor(),
  queries: staticGenerator({ compact: '(width < 40rem)' }),
}) as const;

const token = (theme: { readonly tokens: readonly { readonly name: string }[] }, name: string) => {
  const declaration = theme.tokens.find((candidate) => candidate.name === name);
  if (!declaration) throw new Error(`Missing ${name}`);
  return declaration;
};

describe('theme core descriptors and bindings', () => {
  it('executes a generator once and creates independent immutable namespaced bindings', () => {
    let executions = 0;
    const descriptor = variableGenerator({
      scope: 'contextual',
      sources: { value: source(stringCodec, 'initial') },
      build: (sources) => {
        executions += 1;
        return { tokens: { value: css`${sources.value}` } };
      },
    });
    const definition = compileTheme({ value: descriptor });
    const first = bindTheme(definition, { prefix: 'first' });
    const second = bindTheme(definition, { prefix: 'second' });

    expect(executions).toBe(1);
    expect(descriptor).toMatchObject({
      kind: 'variable',
      scope: 'contextual',
    });
    expect(first).toMatchObject({ prefix: 'first' });
    expect(first.contract.value.value).toBe('var(--first-value-value)');
    expect(second.contract.value.value).toBe('var(--second-value-value)');
    expect(first.contract.value.value).not.toBe(second.contract.value.value);
    expect(first.definition).toBe(second.definition);
  });

  it('owns immutable defaults and emits nested public/private declarations with only symbolic references rewritten', () => {
    const callerDefault = {
      light: 'white',
      dark: 'black',
    };
    const descriptor = variableGenerator({
      scope: 'shared',
      sources: { tone: variantSource(stringCodec, callerDefault) },
      build: (sources) => ({ tokens: { tone: css`${sources.tone.light}` } }),
    });
    callerDefault.light = 'hotpink';
    const theme = defineTheme(schema(), { prefix: 'one' });

    expect(descriptor.sources.tone.defaultCSS).toEqual({
      light: 'white',
      dark: 'black',
    });
    expect(theme.contract.paint.surface).toBe('var(--one-paint-surface)');
    expect(theme.variables.paint.registered).toBe('var(--one-paint-registered)');
    expect(theme.contract.queries.compact).toBe('(width < 40rem)');
    expect('queries' in theme.variables).toBe(false);
    expect(theme.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        role: 'source',
        name: '--one-source-paint-colors-light',
        variant: 'light',
      }),
      expect.objectContaining({
        role: 'source',
        name: '--one-source-paint-colors-dark',
        variant: 'dark',
      }),
      expect.objectContaining({
        role: 'source',
        name: '--one-source-paint-metrics-gap',
      }),
      expect.objectContaining({
        role: 'source',
        name: '--one-source-paint-metrics-opaque',
      }),
    ]));
    expect(token(theme, '--one-paint-surface')).toMatchObject({
      value: 'linear-gradient(var(--one-source-paint-colors-light), var(--foreign-surface))',
      dependencies: ['--one-source-paint-colors-light'],
    });
    expect(token(theme, '--one-private-paint-contrast')).toMatchObject({
      value: 'color-mix(in srgb, var(--one-source-paint-colors-dark), var(--one-source-paint-metrics-gap))',
      dependencies: ['--one-source-paint-colors-dark', '--one-source-paint-metrics-gap'],
    });
    expect(token(theme, '--one-paint-registered')).toMatchObject({
      dependencies: ['--one-private-paint-contrast'],
      registration: colorRegistration,
    });
  });

  it('rejects unresolved, cyclic, and flattening-colliding declarations', () => {
    const missing = variableGenerator({
      scope: 'shared',
      sources: {},
      build: (_sources, { token: reference }) => ({ tokens: { value: css`${reference('missing')}` } }),
    });
    const cycle = variableGenerator({
      scope: 'shared',
      sources: {},
      build: (_sources, { token: reference }) => ({
        tokens: {
          first: css`${reference('second')}`,
          second: css`${reference('first')}`,
        },
      }),
    });
    const leaf = variableGenerator({
      scope: 'shared',
      sources: {},
      build: () => ({ tokens: { value: css`none` } }),
    });

    expect(() => compileTheme({ missing })).toThrow();
    expect(() => compileTheme({ cycle })).toThrow();
    expect(() => compileTheme({
      a: { b: leaf },
      'a-b': leaf,
    } as ThemeSchema)).toThrow();
    expect(() => defineTheme({ value: leaf }, { prefix: 'not valid' as never })).toThrow();
  });

  it('resolves complete source inputs and encodes only explicit source patches', () => {
    const theme = defineTheme(schema(), { prefix: 'inputs' });

    const resolved = resolveThemeInputs(theme, {
      paint: {
        colors: { light: 'ivory' },
        metrics: { opaque: { value: '1rem' } },
      },
    });
    expect(resolved).toEqual({
      paint: {
        colors: {
          light: 'ivory',
          dark: 'black',
        },
        metrics: {
          gap: 8,
          opaque: { value: '1rem' },
        },
      },
    });
    expect(encodeThemePatch(theme, { paint: { colors: { dark: 'midnightblue' } } })).toEqual({
      '--inputs-source-paint-colors-dark': 'midnightblue',
    });
    expect(encodeThemePatch(theme, { paint: { colors: 'canvas' } })).toEqual({
      '--inputs-source-paint-colors-light': 'canvas',
      '--inputs-source-paint-colors-dark': 'canvas',
    });
    expect(encodeThemePatch(theme, { paint: { metrics: { opaque: { value: '2rem' } } } })).toEqual({
      '--inputs-source-paint-metrics-opaque': '2rem',
    });
    expect(() => resolveThemeInputs(theme, { paint: { colors: 'canvas' } } as never)).toThrow();
    expect(() => resolveThemeInputs(theme, {
      paint: {
        colors: 'canvas',
        metrics: { opaque: { value: 'x' } },
        surface: 'nope',
      },
    } as never)).toThrow();
    expect(() => encodeThemePatch(theme, { queries: { compact: 'nope' } } as never)).toThrow();
    expect(() => encodeThemePatch(theme, {
      paint: { metrics: { opaque: {} } },
    } as never)).toThrow();
  });

  it('retains codec prototype methods and their configured receiver', () => {
    class LengthCodec {
      readonly unit = 'px';

      encode(value: number) { return `${value}${this.unit}`; }

      decode(value: string) { return Number(value.slice(0, -this.unit.length)); }
    }
    const theme = defineTheme({
      grid: variableGenerator({
        scope: 'shared',
        sources: source(new LengthCodec(), 16),
        build: (base) => ({ tokens: { m: css`${base}` } }),
      }),
    });
    expect(resolveThemeInputs(theme, {})).toEqual({ grid: 16 });
    expect(encodeThemePatch(theme, { grid: 24 })).toEqual({ '--theme-source-grid': '24px' });
  });

  it('isolates allocation roots, rejects other owners, and never leaves partial failed claims', () => {
    const leaf = variableGenerator({
      scope: 'shared',
      sources: {},
      build: () => ({ tokens: { value: css`none` } }),
    });
    const first = defineTheme({ token: leaf }, { prefix: 'owned' });
    const mixed = defineTheme({
      other: leaf,
      token: leaf,
    }, { prefix: 'owned' });
    const other = defineTheme({ other: leaf }, { prefix: 'owned' });
    const firstRoot = {};
    const secondRoot = {};
    const firstOwner = {};
    const secondOwner = {};

    claimThemeAllocations(first, firstRoot, firstOwner);
    expect(() => claimThemeAllocations(first, firstRoot, secondOwner)).toThrow();
    claimThemeAllocations(first, secondRoot, secondOwner);
    expect(() => claimThemeAllocations(first, secondRoot, firstOwner)).toThrow();
    expect(() => claimThemeAllocations(mixed, firstRoot, secondOwner)).toThrow();
    claimThemeAllocations(other, firstRoot, firstOwner);
    expect(() => claimThemeAllocations(other, firstRoot, secondOwner)).toThrow();
    releaseThemeAllocations(firstRoot, firstOwner);
    claimThemeAllocations(mixed, firstRoot, secondOwner);
    expect(() => claimThemeAllocations(first, firstRoot, firstOwner)).toThrow();
    expect(() => claimThemeAllocations(other, firstRoot, firstOwner)).toThrow();
    releaseThemeAllocations(firstRoot, secondOwner);
    claimThemeAllocations(mixed, firstRoot, firstOwner);
    releaseThemeAllocations(secondRoot, secondOwner);
    releaseThemeAllocations(firstRoot, firstOwner);
  });
});

describe('theme manifests', () => {
  it('projects declarations without source defaults and reconstructs editable source paths', () => {
    const theme = defineTheme({
      paint: variableGenerator({
        scope: 'shared',
        sources: {
          colors: variantSource(stringCodec),
          metrics: { gap: source(numberCodec) },
        },
        build: (sources, { privateToken }) => ({
          tokens: { surface: css`${privateToken('contrast')}` },
          privateTokens: { contrast: css`${sources.colors.light}` },
        }),
      }),
      queries: staticGenerator({ compact: '(width < 40rem)' }),
    }, { prefix: 'catalog' });
    const manifest = createThemeManifest(theme, {
      id: 'catalog',
      sheetId: 'catalog-sheet',
    });
    const reconstructed = themeFromManifest(manifest);
    expect(encodeThemePatch(reconstructed, {
      paint: {
        colors: { dark: 'navy' },
        metrics: { gap: 12 },
      },
    })).toEqual({
      '--catalog-source-paint-colors-dark': 'navy',
      '--catalog-source-paint-metrics-gap': '12',
    });
    expect(() => encodeThemePatch(reconstructed, { paint: { surface: 'red' } })).toThrow();
    expect(() => encodeThemePatch(reconstructed, { queries: { compact: '(width < 20rem)' } })).toThrow();
  });

  it('projects transitive editable dependencies without evaluating generators', () => {
    const theme = defineTheme({
      channel: variableGenerator({
        scope: 'shared',
        sources: {
          primary: source(stringCodec),
          mode: variantSource(stringCodec),
        },
        build: (sources, { privateToken }) => ({
          tokens: {
            direct: css`${sources.primary}`,
            light: css`${sources.mode.light}`,
            dark: css`${privateToken('dark-marker')}`,
            constant: css`var(--external-color)`,
          },
          privateTokens: {
            'dark-marker': css`${sources.mode.dark}`,
          },
        }),
      }),
    }, { prefix: 'dependency' });
    const manifest = createThemeManifest(theme, { sheetId: 'dependency-sheet' });
    const derived = manifest.outputs.filter((entry) => entry.role === 'derived');
    expect(derived).toEqual([
      {
        role: 'derived',
        name: '--dependency-channel-direct',
        path: ['channel', 'direct'],
        scope: 'shared',
        sources: ['--dependency-source-channel-primary'],
      },
      {
        role: 'derived',
        name: '--dependency-channel-light',
        path: ['channel', 'light'],
        scope: 'shared',
        sources: ['--dependency-source-channel-mode-light'],
      },
      {
        role: 'derived',
        name: '--dependency-channel-dark',
        path: ['channel', 'dark'],
        scope: 'shared',
        sources: ['--dependency-source-channel-mode-dark'],
      },
      {
        role: 'derived',
        name: '--dependency-channel-constant',
        path: ['channel', 'constant'],
        scope: 'shared',
        sources: [],
      },
    ]);
    const first = derived[0]!;
    expect(() => validateThemeManifest({
      ...manifest,
      version: 1,
    })).toThrow('identity');
    expect(() => validateThemeManifest({
      ...manifest,
      outputs: [{
        ...first,
        sources: [first.sources[0]!, first.sources[0]!],
      }],
    })).toThrow('sources are duplicate');
    expect(() => validateThemeManifest({
      ...manifest,
      outputs: [{
        ...first,
        sources: ['--dependency-source-missing'],
      }],
    })).toThrow('not an editable source');
    expect(() => validateThemeManifest({
      ...manifest,
      outputs: [{
        ...first,
        sources: [first.name],
      }],
    })).toThrow('not an editable source');
    const firstToken = theme.tokens[0]!;
    const malformed = {
      ...theme,
      tokens: [{
        ...firstToken,
        dependencies: ['--dependency-missing'],
      }],
    } as typeof theme;
    expect(() => createThemeManifest(malformed, { sheetId: 'dependency-sheet' }))
      .toThrow('unknown theme dependency');
    const cyclic = {
      ...theme,
      tokens: [{
        ...firstToken,
        dependencies: [firstToken.name],
      }],
    } as typeof theme;
    expect(() => createThemeManifest(cyclic, { sheetId: 'dependency-sheet' }))
      .toThrow('cyclic theme dependency');
  });

  it('supports explicit unit and JSON replacement codecs without trusting arbitrary codecs', () => {
    expect(numberUnitCodec('rem').decode('1.25rem')).toBe(1.25);
    const value = {
      quote: '"',
      slash: '\\',
      nul: '\u{0}',
    } as const;
    expect(jsonCodec.decode(jsonCodec.encode(value))).toEqual(value);
    const unsupported = defineTheme({
      value: variableGenerator({
        scope: 'shared',
        sources: source(opaqueCodec),
        build: (sources) => ({ tokens: { value: css`${sources}` } }),
      }),
    });
    expect(() => createThemeManifest(unsupported, { sheetId: 'unsupported' })).toThrow(
      'Cannot manifest unsupported source codec',
    );
  });

  it('round-trips shared acyclic JSON objects and rejects actual cycles', () => {
    const shared = { offsets: [1, 2] };
    const value = {
      left: shared,
      right: shared,
    };
    expect(jsonCodec.decode(jsonCodec.encode(value))).toEqual(value);
    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;
    expect(() => jsonCodec.encode(cyclic as never)).toThrow('Expected a JSON value');
  });

  it('retains empty source groups named kind in complete live exports', () => {
    const theme = defineTheme({
      metric: variableGenerator({
        scope: 'shared',
        sources: {
          value: source(numberCodec, 1),
          kind: {},
        },
        build: ({ value }) => ({ tokens: { m: css`${value}` } }),
      }),
    });
    const setup = createThemeSetup(theme, { id: 'kind-group' });
    setup({});
    const projected = themeFromManifest(setup.manifest());
    setup.stylesheet.update([{
      selector: ':root',
      rules: encodeThemePatch(projected, { metric: { value: 2 } }),
    }]);
    expect(readThemeSources(projected, setup.stylesheet)).toEqual({
      metric: {
        value: 2,
        kind: {},
      },
    });
  });

  it('owns strict JSON-safe metadata and escapes explicit embedding', () => {
    const theme = defineTheme({
      value: variableGenerator({
        scope: 'shared',
        sources: source(numberCodec),
        build: (input) => ({ tokens: { value: css`${input}` } }),
      }),
    });
    const manifest = createThemeManifest(theme, { sheetId: 'safe' });
    expect(() => validateThemeManifest({
      ...manifest,
      sources: [{
        ...manifest.sources[0],
        name: '--theme-private-value',
      }],
    })).toThrow('source name');
    const embedded = embedThemeManifests([{
      ...manifest,
      id: '</script><x>',
    } as typeof manifest]);
    expect(embedded).not.toContain('</script><x>');
  });
});
