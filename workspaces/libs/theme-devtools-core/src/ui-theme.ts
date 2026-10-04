import {
  backgroundGenerator,
  createThemeSetup,
  css,
  defineTheme,
  gridGenerator,
  numberCodec,
  paletteGenerator,
  releaseThemeAllocations,
  source,
  stringCodec,
  variableGenerator,
} from '@sabinmarcu/theme-core';
import type {
  ThemeInputs,
  ThemePatches,
} from '@sabinmarcu/theme-core';

export const uiThemeDefinition = defineTheme({
  colors: {
    background: backgroundGenerator({
      default: {
        light: '#f5f5f5',
        dark: '#181818',
      },
    }),
    primary: paletteGenerator({
      default: {
        light: '#005fcc',
        dark: '#80bfff',
      },
    }),
    /** Positive action feedback (e.g. a completed copy). */
    success: paletteGenerator({
      default: {
        light: '#1a7f37',
        dark: '#3fb950',
      },
    }),
    /** Failed action feedback (e.g. a rejected copy). */
    danger: paletteGenerator({
      default: {
        light: '#cf222e',
        dark: '#f85149',
      },
    }),
  },
  spacing: gridGenerator({
    default: 8,
    unit: 'px',
    pairs: 1,
  }),
  typography: variableGenerator({
    scope: 'shared',
    sources: {
      family: source(stringCodec, 'system-ui, sans-serif'),
      size: source(numberCodec, 14),
      lineHeight: source(numberCodec, 1.4),
    },
    build: ({
      family, size, lineHeight,
    }) => ({
      tokens: {
        family: css`${family}`,
        size: css`calc(${size} * 1px)`,
        lineHeight: css`${lineHeight}`,
      },
    }),
  }),
} as const, { prefix: 'devtools-theme' });

export const uiTheme = uiThemeDefinition.contract;
export type UIThemeInput = ThemeInputs<typeof uiThemeDefinition>;
export type UIThemePatch = ThemePatches<typeof uiThemeDefinition>;

type MountUIThemeOptions = {
  readonly nonce?: string;
  readonly input?: UIThemeInput;
};

export function mountUITheme(
  host: HTMLElement,
  root: ShadowRoot,
  options: MountUIThemeOptions = {},
): { update(input: UIThemePatch): void; dispose(): void } {
  const hasExistingValuesSheet = [...root.querySelectorAll<HTMLStyleElement>('style[data-stylesheet-id]')]
    .some((element) => element.dataset.stylesheetId === 'devtools-theme-values');
  const setup = createThemeSetup(uiThemeDefinition, {
    id: 'devtools-theme-values',
    nonce: options.nonce,
    rules: () => [{
      selector: ':host',
      rules: {
        'font-family': {
          value: uiTheme.typography.family,
          priority: 'important',
        },
        'font-size': {
          value: uiTheme.typography.size,
          priority: 'important',
        },
        'line-height': {
          value: uiTheme.typography.lineHeight,
          priority: 'important',
        },
        'font-weight': {
          value: '400',
          priority: 'important',
        },
        'font-style': {
          value: 'normal',
          priority: 'important',
        },
        'letter-spacing': {
          value: 'normal',
          priority: 'important',
        },
        'text-transform': {
          value: 'none',
          priority: 'important',
        },
        color: {
          value: uiTheme.colors.background.text,
          priority: 'important',
        },
        'color-scheme': {
          value: 'light',
          priority: 'important',
        },
      },
    }],
  });
  const mounted = setup.mount(root);
  const element = root.querySelector<HTMLStyleElement>('style[data-stylesheet-id="devtools-theme-values"]')!;
  const ownsValuesSheet = !hasExistingValuesSheet;
  let disposed = false;

  try {
    mounted(options.input ?? {});
    const ownedHost = host;
    ownedHost.dataset.themeVariant = 'light';
  } catch (error) {
    releaseThemeAllocations(host, element);
    if (ownsValuesSheet) element.remove();
    throw error;
  }

  return {
    update(input) {
      if (disposed) throw new Error('The devtools UI theme has been disposed');
      mounted.update(input);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      releaseThemeAllocations(host, element);
      if (ownsValuesSheet) element.remove();
    },
  };
}
