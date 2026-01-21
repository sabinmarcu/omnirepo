import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { media as mediaRaw } from '@/utils/responsive';
import { zIndexLayers } from '@/constants/layers';
import { iconSize } from '@/components/Icon.css';
import { tooltipStyle } from '@/components/Tooltip.component.css';
import {
  breakpoint,
  pageTOCLayoutTOCStyles,
} from './PageTOCLayout.toc.css';
import {
  emptyNavigationSelector,
  navigationSelector,
  navigationSpacing,
} from './Navigation.css';

const media = mediaRaw.bind(undefined, breakpoint);

export const mobileTOCTriggerStyles = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '&&': {
      paddingBlockStart: 0,
      paddingBlockEnd: 0,
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
    },
  },
});

globalStyle([
  `${navigationSelector}.${emptyNavigationSelector} ${mobileTOCTriggerStyles}`,
  `body:not(:has(${pageTOCLayoutTOCStyles})) ${mobileTOCTriggerStyles}`,
  `${navigationSelector}.${emptyNavigationSelector} ${mobileTOCTriggerStyles} + ${tooltipStyle.classNames.base}`,
  `body:not(:has(${pageTOCLayoutTOCStyles})) ${mobileTOCTriggerStyles} + ${tooltipStyle.classNames.base}`,
].join(', '), {
  display: 'none',
});

globalStyle([
  mobileTOCTriggerStyles,
  `${mobileTOCTriggerStyles} + ${tooltipStyle.classNames.base}`,
].join(', '), {
  '@media': {
    [media('gte')]: {
      display: 'none',
    },
  },
});

const mobileTOCTriggerSelector = `${mobileTOCTriggerStyles} > input`;
const mobileTOCActiveSelector = `:has(${mobileTOCTriggerSelector}:checked)`;

globalStyle(mobileTOCTriggerSelector, {
  inlineSize: 0,
  blockSize: 0,
  opacity: 0,
  position: 'fixed',
  insetInline: '-999px',
  insetBlock: '-999px',
});

globalStyle(`${mobileTOCTriggerStyles} > [role=button]`, {
  inlineSize: '100%',
  blockSize: '100%',
  paddingInline: navigationSpacing,
  boxSizing: 'border-box',
});

globalStyle(pageTOCLayoutTOCStyles, {
  '@media': {
    [media('lt')]: {
      position: 'fixed',
      zIndex: -1,
      inset: 0,
      opacity: 0,
    },
  },
});

globalStyle(`${pageTOCLayoutTOCStyles} h2 label`, {
  '@media': {
    [media('gte')]: {
      display: 'none',
    },
  },

  paddingBlock: 0,
  paddingInline: 0,

  marginBlock: 0,
  marginInline: 0,

  background: 'transparent',

  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',

  vars: {
    [iconSize]: '0.85em',
  },
});

globalStyle(`${mobileTOCActiveSelector} ${pageTOCLayoutTOCStyles}`, {
  opacity: 1,
  zIndex: zIndexLayers.toc,
});

globalStyle([
  `${pageTOCLayoutTOCStyles} section`,
  `${pageTOCLayoutTOCStyles} nav`,
].join(', '), {
  '@media': {
    [media('lt')]: {
      blockSize: '100%',
    },
  },
});
