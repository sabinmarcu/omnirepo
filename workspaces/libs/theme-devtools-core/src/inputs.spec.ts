import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  css,
  createThemeSetup,
  defineTheme,
  jsonCodec,
  numberUnitCodec,
  source,
  variableGenerator,
  variantSource,
  colorCodec,
} from '@sabinmarcu/theme-core';
import {
  parseSourceInput,
  sourcePatch,
} from './inputs.js';

describe('source editor typed commits', () => {
  it('commits numeric units as numbers and preserves omitted color variants and JSON fields', () => {
    const theme = defineTheme({
      length: variableGenerator({
        scope: 'shared',
        sources: source(numberUnitCodec('px'), 12),
        build: (value) => ({ tokens: { width: css`${value}` } }),
      }),
      color: variableGenerator({
        scope: 'contextual',
        sources: variantSource(colorCodec, {
          light: 'white',
          dark: 'black',
        }),
        build: (value) => ({ tokens: { base: css`light-dark(${value.light}, ${value.dark})` } }),
      }),
      data: variableGenerator({
        scope: 'shared',
        sources: source(jsonCodec, {
          left: 1,
          right: 2,
        }),
        build: () => ({ tokens: {} }),
      }),
    });
    const setup = createThemeSetup(theme, { id: 'editor-model' });
    setup({});
    setup.update(sourcePatch(['length'], parseSourceInput('25.5', {
      kind: 'number',
      unit: 'px',
    })));
    setup.update(sourcePatch(['color', 'dark'], parseSourceInput('color(display-p3 1 0 0)', { kind: 'color' })));
    expect(setup.read()).toEqual({
      length: 25.5,
      color: {
        light: 'white',
        dark: 'color(display-p3 1 0 0)',
      },
      data: {
        left: 1,
        right: 2,
      },
    });
    setup.update(sourcePatch(['data'], parseSourceInput('{"left":3}', { kind: 'json' })));
    expect(setup.read().data).toEqual({ left: 3 });
  });

  it('rejects invalid numeric/JSON drafts before a source commit', () => {
    for (const invalid of ['', '12px', 'Infinity', 'NaN']) {
      expect(() => parseSourceInput(invalid, {
        kind: 'number',
        unit: 'px',
      })).toThrow();
    }
    expect(() => parseSourceInput('{broken', { kind: 'json' })).toThrow();
  });
});
