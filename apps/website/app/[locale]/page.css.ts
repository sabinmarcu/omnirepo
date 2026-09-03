import { theme } from '@sabinmarcu/website-theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';

const searchColor = createVar('search-color');
const searchColorIntensity = createVar({
  syntax: '<number>',
  inherits: true,
  initialValue: '0.1',
}, 'search-color-intensity');
const searchBorderSize = createVar('search-border-size');
const searchShadowIntensity = createVar({
  syntax: '<number>',
  inherits: true,
  initialValue: '0.2',
}, 'search-shadow-intensity');
const searchShadow = `0 0 20px oklch(from ${searchColor} l c h / ${searchShadowIntensity})`;

export const landingPageWrapper = style({
  inlineSize: '100cqw',
  blockSize: '100cqh',
  position: 'relative',
  overflowInline: 'hidden',
  overflowBlock: 'auto',
  containerType: 'inline-size',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  paddingBlockStart: '5cqmin',
});

export const landingPageSearch = style({
  inlineSize: '100%',
  maxInlineSize: '1200px',
  position: 'relative',
  zIndex: zIndexLayers.navigationSearch,
  marginBlockStart: theme.grid.l,
  paddingInline: theme.grid.l,
  vars: {
    [searchColor]: `color-mix(in oklch, ${theme.colors.primary.muted} 30%, ${theme.colors.background.page})`,
    [searchColorIntensity]: '0.1',
    [searchBorderSize]: '6px',
    [searchShadowIntensity]: '0.3',
  },
  selectors: {
    '&:hover': {
      vars: {
        [searchColor]: `color-mix(in oklch, ${theme.colors.primary.base} 30%, ${theme.colors.background.page})`,
        [searchColorIntensity]: '0',
        [searchShadowIntensity]: '1',
      },
    },
  },
});

globalStyle(`${landingPageSearch} [data-search-entrypoint] > div`, {
  background: `oklch(from ${searchColor} l c h / ${searchColorIntensity})`,
  backdropFilter: 'blur(10px)',
  borderInlineStart: `solid ${searchBorderSize} ${searchColor}`,
  borderInlineEnd: `solid ${searchBorderSize} ${searchColor}`,
  borderBlockStart: `solid ${searchBorderSize} ${searchColor}`,
  borderBlockEnd: `solid ${searchBorderSize} ${searchColor}`,
  borderRadius: '3px',
  boxShadow: searchShadow,
});
