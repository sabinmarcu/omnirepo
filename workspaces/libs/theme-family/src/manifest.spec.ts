import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  css,
  defineTheme,
  encodeThemePatch,
  numberCodec,
  readThemeSources,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
  variantSource,
} from '@sabinmarcu/theme-core';
import { themeFromManifest } from '@sabinmarcu/theme-core/manifest';
import { createThemeFamily } from './index.js';

const define = () => defineTheme({
  spacing: variableGenerator({
    scope: 'shared',
    sources: source(numberCodec, 16),
    build: (value) => ({ tokens: { m: css`calc(${value} * 1px)` } }),
  }),
  tint: variableGenerator({
    scope: 'contextual',
    sources: variantSource(stringCodec, {
      light: 'white',
      dark: 'black',
    }),
    build: (value) => ({ tokens: { base: css`light-dark(${value.light}, ${value.dark})` } }),
  }),
  query: staticGenerator('(width < 700px)'),
});

describe('family manifest live source semantics', () => {
  it('reconstructs current independent typed family inputs without borrowing defaults or values from metadata', () => {
    const family = createThemeFamily(define(), {
      id: 'inspected',
      families: ['night'],
      layer: 'theme',
    });
    const manifest = family.manifest();
    const serialized = JSON.stringify(manifest);
    const transported: unknown = JSON.parse(serialized);
    const reconstructed = themeFromManifest(transported as typeof manifest);
    family({ families: { night: { tint: { dark: 'navy' } } } });
    const patch = {
      shared: { spacing: 24 },
      families: { base: { tint: { light: 'linen' } } },
    };
    family.stylesheet.update([{
      selector: family.selector,
      layer: 'theme',
      rules: encodeThemePatch(reconstructed, patch),
    }]);
    const exported = readThemeSources(reconstructed, family.stylesheet, family.selector, 'theme');
    expect(exported).toEqual({
      shared: { spacing: 24 },
      families: {
        base: {
          tint: {
            light: 'linen',
            dark: 'black',
          },
        },
        night: {
          tint: {
            light: 'white',
            dark: 'navy',
          },
        },
      },
    });
    const replay = createThemeFamily(define(), {
      id: 'replayed',
      families: ['night'],
    });
    replay(exported as Parameters<typeof replay>[0]);
    expect(replay.read()).toEqual(family.read());
    expect(manifest).toEqual(family.manifest());
    expect(() => encodeThemePatch(reconstructed, {
      families: { night: { spacing: 8 } },
    })).toThrow();
    expect(() => encodeThemePatch(reconstructed, { shared: { tint: 'red' } })).toThrow();
    expect(() => encodeThemePatch(reconstructed, { families: { base: { query: 'bad' } } })).toThrow();
    expect(() => encodeThemePatch(reconstructed, { families: { base: { tint: { base: 'red' } } } })).toThrow();
  });

  it('preserves source-free shared/member containers for complete family exports', () => {
    const theme = defineTheme({
      tint: variableGenerator({
        scope: 'contextual',
        sources: variantSource(stringCodec, 'white'),
        build: (value) => ({ tokens: { base: css`light-dark(${value.light}, ${value.dark})` } }),
      }),
    });
    const family = createThemeFamily(theme, {
      id: 'empty-shared',
      families: ['night'],
    });
    family({});
    const reconstructed = themeFromManifest(family.manifest());
    expect(readThemeSources(reconstructed, family.stylesheet)).toEqual(family.read());
    const staticOnly = createThemeFamily(defineTheme({ query: staticGenerator('(width < 700px)') }), {
      id: 'static-family',
      families: ['night'],
    });
    staticOnly({});
    expect(readThemeSources(themeFromManifest(staticOnly.manifest()), staticOnly.stylesheet))
      .toEqual({
        shared: {},
        families: {
          base: {},
          night: {},
        },
      });
  });

  it('keeps shared and member output dependencies scoped to their bound source allocations', () => {
    const family = createThemeFamily(define(), {
      id: 'dependencies',
      families: ['night'],
    });
    const outputs = family.manifest().outputs.filter((entry) => entry.role === 'derived');
    expect(Object.fromEntries(outputs.map((entry) => [entry.path.join('.'), {
      scope: entry.scope,
      sources: entry.sources,
    }]))).toEqual({
      'shared.spacing.m': {
        scope: 'shared',
        sources: ['--theme-family-dependencies-shared-source-spacing'],
      },
      'families.base.tint.base': {
        scope: 'contextual',
        sources: [
          '--theme-family-dependencies-families-base-source-tint-light',
          '--theme-family-dependencies-families-base-source-tint-dark',
        ],
      },
      'families.night.tint.base': {
        scope: 'contextual',
        sources: [
          '--theme-family-dependencies-families-night-source-tint-light',
          '--theme-family-dependencies-families-night-source-tint-dark',
        ],
      },
    });
  });
});
