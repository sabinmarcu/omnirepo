import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';
import {
  navigationAnchorName,
  navigationMobileElements,
} from './Navigation.css';
import {
  pageLayoutAnchorName,
  pageLayoutSize,
} from './PageLayout.css';
import { whenTOCFits } from './TOCLayout.fit';

const tocMargin = createVar();
const tocPadding = createVar();
const tocGap = createVar();

export const tocLayoutTOCStyles = style({
  vars: {
    [tocMargin]: theme.grid.xl,
    [tocPadding]: theme.grid.m,
    [tocGap]: theme.grid.l,
  },
});

// Block axis anchors to the navbar's rendered box, inline axis to the content column.
whenTOCFits(tocLayoutTOCStyles, {
  position: 'fixed',
  zIndex: zIndexLayers.toc,

  insetBlockStart: `calc(anchor(${navigationAnchorName} end) + ${tocMargin})`,
  insetBlockEnd: tocMargin,
  insetInlineStart: tocMargin,
  insetInlineEnd: `calc(anchor(${pageLayoutAnchorName} start) + ${tocGap})`,

  maxInlineSize: `calc(${pageLayoutSize} / 3)`,
  justifySelf: 'end',
});

// eslint-disable-next-line logical-properties/overflow
globalStyle(`${tocLayoutTOCStyles} nav`, {
  blockSize: '100%',
  boxSizing: 'border-box',

  paddingBlock: tocPadding,
  paddingInline: tocPadding,

  overflowX: 'hidden',
  overflowY: 'auto',

  fontSize: theme.grid.l,
  background: theme.colors.background.depressed,
});

whenTOCFits(`${tocLayoutTOCStyles} nav`, {
  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  borderInlineStart: `solid 1px ${theme.colors.primary.muted}`,
  borderInlineEnd: `solid 1px ${theme.colors.primary.muted}`,
  borderBlockStart: `solid 1px ${theme.colors.primary.muted}`,
  borderBlockEnd: `solid 1px ${theme.colors.primary.muted}`,
});

globalStyle(`${tocLayoutTOCStyles} h2`, {
  fontSize: theme.grid.xl,

  background: theme.colors.background.depressed,
  borderBlockEnd: `solid 1px ${theme.colors.primary.muted}`,

  position: 'sticky',

  insetInline: `calc(0px - ${tocPadding})`,
  insetBlockStart: `calc(0px - ${tocPadding})`,

  marginBlockStart: `calc(0px - ${tocPadding})`,
  marginBlockEnd: theme.grid.m,

  paddingBlockStart: tocPadding,
  paddingBlockEnd: theme.grid.xxs,

  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
});

globalStyle(`${tocLayoutTOCStyles} ul ul`, {
  paddingInlineStart: tocPadding,
});

globalStyle(`${tocLayoutTOCStyles} li`, {
  listStyle: 'none',
});

globalStyle(`body:has(${tocLayoutTOCStyles})`, {
  vars: {
    [navigationMobileElements]: '4',
  },
});

