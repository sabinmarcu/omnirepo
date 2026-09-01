import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';
import { iconSize } from '@/components/Icon.css';
import { tooltipStyle } from '@/components/Tooltip.component.css';
import { tocLayoutTOCStyles } from './TOCLayout.toc.css';
import {
  whenTOCDoesNotFit,
  whenTOCFits,
} from './TOCLayout.fit';
import {
  emptyNavigationSelector,
  navigationSelector,
  navigationSpacing,
} from './Navigation.css';

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
  `body:not(:has(${tocLayoutTOCStyles})) ${mobileTOCTriggerStyles}`,
  `${navigationSelector}.${emptyNavigationSelector} ${mobileTOCTriggerStyles} + ${tooltipStyle.classNames.base}`,
  `body:not(:has(${tocLayoutTOCStyles})) ${mobileTOCTriggerStyles} + ${tooltipStyle.classNames.base}`,
].join(', '), {
  display: 'none',
});

whenTOCFits(mobileTOCTriggerStyles, {
  display: 'none',
});

whenTOCFits(`${mobileTOCTriggerStyles} + ${tooltipStyle.classNames.base}`, {
  display: 'none',
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

whenTOCDoesNotFit(tocLayoutTOCStyles, {
  position: 'fixed',
  zIndex: -1,
  inset: 0,
  opacity: 0,
});

globalStyle(`${tocLayoutTOCStyles} h2 label`, {
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

whenTOCFits(`${tocLayoutTOCStyles} h2 label`, {
  display: 'none',
});

globalStyle(`${mobileTOCActiveSelector} ${tocLayoutTOCStyles}`, {
  opacity: 1,
  zIndex: zIndexLayers.toc,
});

whenTOCDoesNotFit(`${tocLayoutTOCStyles} nav`, {
  blockSize: '100%',
});

