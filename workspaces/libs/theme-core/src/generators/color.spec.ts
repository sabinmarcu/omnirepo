import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  defineTheme,
  encodeThemePatch,
  resolveThemeInputs,
} from '../index.js';
import {
  backgroundGenerator,
  paletteGenerator,
} from './color.js';

const createTheme = () => defineTheme({
  palette: paletteGenerator(),
  background: backgroundGenerator(),
}, { prefix: 'colors' });

describe('native color generators', () => {
  it('provides complete editable light/dark defaults without making generated colors inputs', () => {
    const theme = createTheme();

    expect(resolveThemeInputs(theme, {})).toEqual({
      palette: {
        light: '#00ccff',
        dark: '#00ccff',
      },
      background: {
        light: '#e0e0e0',
        dark: '#202020',
      },
    });
    expect(theme.contract).toEqual({
      palette: {
        base: 'var(--colors-palette-base)',
        contrast: 'var(--colors-palette-contrast)',
        muted: 'var(--colors-palette-muted)',
        emphasis: 'var(--colors-palette-emphasis)',
      },
      background: {
        page: 'var(--colors-background-page)',
        text: 'var(--colors-background-text)',
        surface: 'var(--colors-background-surface)',
        elevated: 'var(--colors-background-elevated)',
        raised: 'var(--colors-background-raised)',
        depressed: 'var(--colors-background-depressed)',
        recessed: 'var(--colors-background-recessed)',
      },
    });
    expect(() => encodeThemePatch(theme, {
      palette: { base: 'red' },
    } as never)).toThrow();
  });

  it('preserves supplied scalar and per-variant defaults as complete color inputs', () => {
    const theme = defineTheme({
      palette: paletteGenerator({ default: 'rebeccapurple' }),
      background: backgroundGenerator({
        default: {
          light: 'canvas',
          dark: 'canvastext',
        },
      }),
    });

    expect(resolveThemeInputs(theme, {})).toEqual({
      palette: {
        light: 'rebeccapurple',
        dark: 'rebeccapurple',
      },
      background: {
        light: 'canvas',
        dark: 'canvastext',
      },
    });
    expect(resolveThemeInputs(theme, {
      palette: { dark: 'midnightblue' },
      background: { light: 'ivory' },
    })).toEqual({
      palette: {
        light: 'rebeccapurple',
        dark: 'midnightblue',
      },
      background: {
        light: 'ivory',
        dark: 'canvastext',
      },
    });
  });

  it('writes scalar variant edits to both sources and leaves omitted variants untouched', () => {
    const theme = createTheme();

    expect(encodeThemePatch(theme, {
      palette: 'tomato',
      background: { dark: 'midnightblue' },
    })).toEqual({
      '--colors-source-palette-light': 'tomato',
      '--colors-source-palette-dark': 'tomato',
      '--colors-source-background-dark': 'midnightblue',
    });
  });

  it('keeps native foreground markers private and typed for each editable background variant', () => {
    const theme = createTheme();
    const foreground = theme.tokens.filter((token) => token.visibility === 'private');

    expect(foreground).toEqual([
      expect.objectContaining({
        name: '--colors-private-background-foreground-light',
        registration: {
          syntax: '<color>',
          inherits: true,
          initialValue: 'black',
        },
      }),
      expect.objectContaining({
        name: '--colors-private-background-foreground-dark',
        registration: {
          syntax: '<color>',
          inherits: true,
          initialValue: 'black',
        },
      }),
    ]);
  });
});
