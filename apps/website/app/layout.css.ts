import {
  theme,
  families,
  selectors,
  themes,
} from '@sabinmarcu/website-theme';
import {
  assignVars,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';

const commonBackgroundStyles = {
  content: '',
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: zIndexLayers.crtOverlay,
} as const;

export const rootBackgroundTrigger = style({});
export const rootThemeTrigger = style({});
export const rootBackgroundStyle = style({
  background: theme.colors.background.page,
  position: 'relative',
  selectors: {
    '&::after': {
      ...commonBackgroundStyles,
      background: 'radial-gradient(circle, white 0%, white 65%, hsla(from black h s l / 0.2) 100%)',
      mixBlendMode: 'multiply',
    },
  },
});

export const scanLinesStyle = style({
  ...commonBackgroundStyles,
  background: 'repeating-linear-gradient(0deg, black, white 4px)',
  mixBlendMode: 'overlay',
});

for (const family of families) {
  const triggers = [
    `${rootBackgroundTrigger}${selectors[family]}:hover`,
    `${rootThemeTrigger}${selectors[family]}`,
  ] as const;
  globalStyle(
    triggers.map(
      (trigger) => `${rootBackgroundStyle}:has(${trigger})`,
    ).join(', '),
    {
      vars: assignVars(
        theme.colors.background,
        themes[family].colors.background as any,
      ),
    },
  );
}
