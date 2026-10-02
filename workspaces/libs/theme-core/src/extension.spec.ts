import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  css,
  defineTheme,
  numberCodec,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
} from './index.js';
import { extendTheme } from './extension.js';

const metric = (counter: { value: number }) => variableGenerator({
  scope: 'shared',
  sources: { value: source(numberCodec, 8) },
  build: ({ value }) => {
    Reflect.set(counter, 'value', counter.value + 1);
    return { tokens: { value: css`${value}px` } };
  },
});

describe('extendTheme', () => {
  it('keeps existing compiled declarations and unaffected nested views while adding groups', () => {
    const builds = { value: 0 };
    const baseMetric = metric(builds);
    const base = defineTheme({
      colors: { base: baseMetric },
      queries: staticGenerator({ compact: '(width < 40rem)' }),
    } as const, { prefix: 'extended' });
    const accent = variableGenerator({
      scope: 'contextual',
      sources: { color: source(stringCodec, 'rebeccapurple') },
      build: ({ color }) => ({ tokens: { foreground: css`${color}` } }),
    });

    const extended = extendTheme(base, {
      colors: { accent },
      motion: { duration: staticGenerator('150ms') },
    } as const);

    expect(builds.value).toBe(1);
    expect(extended.prefix).toBe('extended');
    expect(extended.contract.queries).toBe(base.contract.queries);
    expect(extended.contract.colors.base).toBe(base.contract.colors.base);
    expect(extended.variables.colors.base).toBe(base.variables.colors.base);
    expect(extended.contract.motion.duration).toBe('150ms');
    expect(extended.contract.colors.accent.foreground).toBe('var(--extended-colors-accent-foreground)');
    expect(extended.definition.sources[0]).toBe(base.definition.sources[0]);
    expect(extended.sources[0]).toBe(base.sources[0]);
    expect(extended.definition.tokens[0]).toBe(base.definition.tokens[0]);
    expect(extended.tokens[0]).toBe(base.tokens[0]);
  });

  it('rejects descriptor paths and flattened names that conflict with the base allocation graph', () => {
    const builds = { value: 0 };
    const base = defineTheme({ a: { b: metric(builds) } } as const);
    const replacement = metric(builds);
    const collision = metric(builds);

    expect(() => extendTheme(base, { a: { b: replacement } } as never)).toThrow();
    expect(() => extendTheme(base, { 'a-b': collision } as never)).toThrow();
    expect(builds.value).toBe(3);
  });
});
