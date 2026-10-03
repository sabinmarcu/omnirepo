import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  bindTheme,
  compileTheme,
  encodeThemePatch,
  resolveThemeInputs,
} from '../index.js';
import {
  fibonacciGridGenerator,
  gridGenerator,
} from './grid.js';

describe('grid generators', () => {
  it('creates default shared eight-point sources with a main and three pairs', () => {
    const grid = gridGenerator();
    const theme = bindTheme(compileTheme({ grid }), { prefix: 'space' });

    expect(grid).toMatchObject({
      kind: 'variable',
      scope: 'shared',
    });
    expect(grid.sources).toMatchObject({
      kind: 'source',
      hasDefault: true,
      defaultCSS: '16',
    });
    expect(Object.keys(theme.contract.grid)).toEqual(['m', 's', 'l', 'xs', 'xl', 'xxs', 'xxl']);
  });

  it('keeps zero-pair and four-pair bindings exact without rebuilding descriptors', () => {
    const empty = gridGenerator({
      pairs: 0,
      unit: 'px',
    });
    const fourPairs = gridGenerator({
      pairs: 4,
      default: 8,
      unit: 'em',
      basis: 2,
    });
    const emptyTheme = bindTheme(compileTheme({ grid: empty }), { prefix: 'space' });
    const definition = compileTheme({ grid: fourPairs });
    const first = bindTheme(definition, { prefix: 'first' });
    const second = bindTheme(definition, { prefix: 'second' });

    expect(Object.keys(emptyTheme.contract.grid)).toEqual(['m']);
    expect(Object.keys(first.contract.grid)).toEqual([
      'm', 's', 'l', 'xs', 'xl', 'xxs', 'xxl', 'xxxs', 'xxxl',
    ]);
    expect(first.definition).toBe(second.definition);
    expect(first.contract.grid.m).toBe('var(--first-grid-m)');
    expect(second.contract.grid.m).toBe('var(--second-grid-m)');
  });

  it('keeps defaults isolated and accepts finite numeric source updates', () => {
    const first = bindTheme(compileTheme({ grid: gridGenerator({ default: 8 }) }), { prefix: 'space' });
    const second = bindTheme(compileTheme({ grid: fibonacciGridGenerator({ default: 24 }) }), { prefix: 'space' });

    expect(resolveThemeInputs(first, {})).toEqual({ grid: 8 });
    expect(resolveThemeInputs(second, {})).toEqual({ grid: 24 });
    expect(encodeThemePatch(first, { grid: 12 })).toEqual({
      '--space-source-grid': '12',
    });
  });

  it('rejects invalid structural options and non-numeric source input', () => {
    expect(() => gridGenerator({ pairs: -1 })).toThrow(TypeError);
    expect(() => gridGenerator({ pairs: 1.5 })).toThrow(TypeError);
    expect(() => gridGenerator({ basis: 0 })).toThrow(TypeError);
    expect(() => gridGenerator({ basis: Infinity })).toThrow(TypeError);
    expect(() => gridGenerator({ default: NaN })).toThrow(TypeError);

    const theme = bindTheme(compileTheme({ grid: gridGenerator() }), { prefix: 'space' });
    expect(() => encodeThemePatch(theme, { grid: NaN })).toThrow();
    expect(() => encodeThemePatch(theme, { grid: Infinity })).toThrow();
  });
});
