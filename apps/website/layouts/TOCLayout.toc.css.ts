import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';
import {
  navigationBlockOffset,
  navigationMinBlockSize,
  navigationRows,
  navigationSpacing,
} from './Navigation.css';
import { gridLines } from './grid.lines';
import {
  tocMinInlineSize,
  whenTier,
} from './TOCLayout.tiers';

export const tocMargin = createVar();
export const tocPadding = createVar();
export const tocGap = createVar();

/**
 * The `popover` attribute is always present so the drawer tier can use it, which means
 * the UA popover defaults have to be neutralised for the tiers that render an inline rail.
 */
export const tocLayoutTOCStyles = style({
  marginBlock: 0,
  marginInline: 0,
  paddingBlock: 0,
  paddingInline: 0,

  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',

  background: 'transparent',
  color: 'inherit',
  inlineSize: 'auto',
  blockSize: 'auto',
});

/**
 * The animated-navigation experiment derives `navigationBlockOffset` from a var that
 * `@keyframes` only sets on the navbar itself, so outside that subtree it is
 * guaranteed-invalid. Falling back to the navbar's resting height keeps the rail
 * anchored instead of collapsing every calc() to `auto`.
 */
const navigationRestingOffset = `calc(${navigationMinBlockSize} * ${navigationRows} + ${navigationSpacing} * 3)`;
const railOffset = fallbackVar(navigationBlockOffset, navigationRestingOffset);

// Overrides the UA `display: none` for closed popovers, so the rail stays in flow.
whenTier(['centered', 'folded'], tocLayoutTOCStyles, {
  display: 'block',
  gridColumn: `${gridLines.fullStart} / ${gridLines.contentStart}`,
  gridRow: 1,

  position: 'sticky',
  zIndex: zIndexLayers.toc,

  boxSizing: 'border-box',
  insetBlockStart: `calc(${railOffset} + ${tocMargin})`,
  insetBlockEnd: 'auto',
  insetInlineStart: 'auto',
  insetInlineEnd: 'auto',
  blockSize: `calc(100dvb - ${railOffset} - ${tocMargin} * 2)`,

  paddingInlineStart: tocMargin,
  paddingInlineEnd: tocGap,
});

whenTier('centered', tocLayoutTOCStyles, {
  justifySelf: 'end',
  inlineSize: 'fit-content',
  minInlineSize: `${tocMinInlineSize}px`,
  maxInlineSize: 'min(450px, 100%)',
});

// eslint-disable-next-line logical-properties/overflow
globalStyle(`${tocLayoutTOCStyles} nav`, {
  blockSize: '100%',
  boxSizing: 'border-box',

  paddingBlock: tocPadding,
  paddingInline: tocPadding,

  overflowX: 'hidden',
  overflowY: 'auto',

  fontSize: theme.grid.m,
  background: theme.colors.background.depressed,
});

whenTier(['centered', 'folded'], `${tocLayoutTOCStyles} nav`, {
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
  marginBlockStart: theme.grid.s,
});

globalStyle(`${tocLayoutTOCStyles} li`, {
  listStyle: 'none',
});

globalStyle(`${tocLayoutTOCStyles} li > a`, {
  display: 'inline-block',
  lineHeight: 1,
});

globalStyle(`${tocLayoutTOCStyles} nav > ul`, {
  display: 'grid',
  gap: theme.grid.l,
});

