import {
  theme,
  families,
  selectors,
  themes,
} from '@sabinmarcu/website-theme';
import {
  assignVars,
  createVar,
  fallbackVar,
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

// `--dpr` is set on <html> by an inline script. Snapping the tile to whole device
// pixels keeps every repeat identical; a raw CSS-px period lands on fractional
// device pixels at non-integer DPRs and beats into a visible moiré band.
const devicePixelRatio = 'var(--dpr, 1)';
const snapToDevicePixels = (cssPixels: string) => [
  `calc(round(${cssPixels} * ${devicePixelRatio}, 1)`,
  `* 1px / ${devicePixelRatio})`,
].join(' ');

// Unitless CSS pixels, snapped to the device grid above.
export const scanLineBaseSizeVar = createVar('scan-line-base-size');
const scanLinePeriod = snapToDevicePixels(fallbackVar(scanLineBaseSizeVar, '4'));

export const scanLinesStyle = style({
  ...commonBackgroundStyles,
  // Fixed so the pattern is not re-rasterized at subpixel offsets while scrolling.
  position: 'fixed',
  background: `repeating-linear-gradient(0deg, black, white ${scanLinePeriod})`,
  mixBlendMode: 'overlay',
  vars: {
    [scanLineBaseSizeVar]: '4',
  },
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
