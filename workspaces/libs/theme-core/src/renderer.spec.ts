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
  variantSource,
} from './index.js';
import { createThemeSetup } from './renderer.js';

const define = () => {
  let builds = 0;
  const theme = defineTheme({
    colors: {
      primary: variableGenerator({
        scope: 'contextual',
        sources: variantSource(stringCodec, {
          light: 'white',
          dark: 'black',
        }),
        build: (value) => {
          builds += 1;
          return { tokens: { base: css`light-dark(${value.light}, ${value.dark})` } };
        },
      }),
    },
    grid: variableGenerator({
      scope: 'shared',
      sources: source(numberCodec, 16),
      build: (value) => ({ tokens: { m: css`calc(${value} * 1px)` } }),
    }),
    query: staticGenerator('(width < 700px)'),
  });
  return {
    theme,
    executions: () => builds,
  };
};

describe('direct theme source rendering', () => {
  it('renders the existing contract and reads current source inputs without rerunning definitions', () => {
    const { theme, executions } = define();
    const setup = createThemeSetup(theme, {
      id: 'request-theme',
      nonce: 'safe-nonce',
    });
    expect(setup({})).toBe(theme.contract);
    expect(setup.read()).toEqual({
      colors: {
        primary: {
          light: 'white',
          dark: 'black',
        },
      },
      grid: 16,
    });
    expect(setup.update({ colors: { primary: { dark: 'navy' } } })).toBe(theme.contract);
    expect(setup.read()).toEqual({
      colors: {
        primary: {
          light: 'white',
          dark: 'navy',
        },
      },
      grid: 16,
    });
    setup.update({ grid: 24 });
    expect(setup.read().grid).toBe(24);
    expect(setup.stylesheet.raw).toContain('24');
    expect(setup.stylesheet.raw).toContain('nonce="safe-nonce"');
    expect(executions()).toBe(1);
    expect(theme.contract.query).toBe('(width < 700px)');
  });

  it('retains omitted values across repeated setup and scalar variant updates', () => {
    const { theme } = define();
    const setup = createThemeSetup(theme, { id: 'patch-theme' });
    setup({
      colors: { primary: { light: 'ivory' } },
      grid: 10,
    });
    setup.update({ colors: { primary: 'rebeccapurple' } });
    setup({ grid: 12 });
    expect(setup.read()).toEqual({
      colors: {
        primary: {
          light: 'rebeccapurple',
          dark: 'rebeccapurple',
        },
      },
      grid: 12,
    });
    setup.update({ colors: { primary: { light: 'snow' } } });
    expect(setup.read().colors.primary.dark).toBe('rebeccapurple');
  });

  it('does not reset source edits made through the authoritative stylesheet', () => {
    const { theme } = define();
    const setup = createThemeSetup(theme, { id: 'external-editor' });
    setup({});
    setup.stylesheet.update([{
      selector: ':root',
      rules: { '--theme-source-grid': '40' },
    }]);
    expect(setup.read().grid).toBe(40);
    setup.update({ colors: { primary: { dark: 'navy' } } });
    expect(setup.read().grid).toBe(40);
    const exported = setup.read();
    const copy = createThemeSetup(theme, { id: 'copied-theme' });
    copy(exported);
    expect(copy.read()).toEqual(exported);
  });

  it('isolates SSR requests and commits source groups together with current notifications', () => {
    const { theme } = define();
    const first = createThemeSetup(theme, { id: 'same-id' });
    const second = createThemeSetup(theme, { id: 'same-id' });
    first({});
    second({ grid: 8 });
    let notifications = 0;
    const observed: unknown[] = [];
    first.stylesheet.subscribe(() => { notifications += 1; observed.push(first.read()); });
    first.update({
      grid: 20,
      colors: { primary: { dark: 'navy' } },
    });
    expect(notifications).toBe(1);
    expect(observed).toEqual([{
      grid: 20,
      colors: {
        primary: {
          light: 'white',
          dark: 'navy',
        },
      },
    }]);
    expect(second.read().grid).toBe(8);
  });

  it('exports declared empty source groups without adding static inputs', () => {
    const theme = defineTheme({
      nested: {
        constant: variableGenerator({
          scope: 'shared',
          sources: {},
          build: () => ({ tokens: { base: css`5px` } }),
        }),
        query: staticGenerator('(width < 500px)'),
      },
    });
    const setup = createThemeSetup(theme, { id: 'source-free' });
    setup({});
    const exported = setup.read();
    expect(exported).toEqual({ nested: { constant: {} } });
    const replay = createThemeSetup(theme, { id: 'replay' });
    replay(exported);
    expect(replay.read()).toEqual(exported);
  });

  it('rejects missing required sources and invalid patches without partially committing', () => {
    const theme = defineTheme({
      required: variableGenerator({
        scope: 'shared',
        sources: source(numberCodec),
        build: (value) => ({ tokens: { base: css`${value}` } }),
      }),
    });
    const setup = createThemeSetup(theme, { id: 'required' });
    expect(() => setup({} as never)).toThrow();
    expect(() => setup.update({ required: 8 })).toThrow();
    setup({ required: 8 });
    const before = setup.stylesheet.css;
    expect(() => setup.update({
      required: 12,
      derived: 15,
    } as never)).toThrow();
    expect(setup.stylesheet.css).toBe(before);
    expect(setup.read()).toEqual({ required: 8 });
  });
});
