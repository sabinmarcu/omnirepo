import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';
import {
  navigationMinBlockSize,
  navigationMinInlineSize,
} from './Navigation.css';
import {
  pageLayoutInlinePadding,
  pageLayoutMinSize,
  pageLayoutSelector,
  pageLayoutSize,
} from './PageLayout.css';
import { gridLines } from './grid.lines';
import {
  tocGap,
  tocMargin,
  tocPadding,
} from './TOCLayout.toc.css';
import { tocTriggerInlineSize } from './TOCLayout.toc.constants';
import {
  tocMinInlineSize,
  whenTier,
} from './TOCLayout.tiers';

export const tocTriggerInline = createVar();
export const tocTriggerBlock = createVar();

/** Matches the navbar's own section border. */
export const tocTriggerBorderSize = '2px';

/** The trigger sizes its content box, so the gutter track has to allow for the border too. */
const withBorder = (size: string) => `calc(${size} + ${tocTriggerBorderSize} * 2)`;

/**
 * Owns the rail/content geometry so neither PageLayout nor RootPageLayout has to
 * know a TOC exists. Track sizes come from `pageLayoutSize`, which the page
 * variant already resolves to the right maximum.
 *
 * The spacing vars live here rather than on the rail, because the gutter trigger is
 * a sibling of the rail and has to resolve the same block offset.
 */
export const tocLayoutStyles = style({
  display: 'grid',
  inlineSize: '100%',
  alignItems: 'start',

  vars: {
    [tocMargin]: theme.grid.xl,
    [tocPadding]: theme.grid.m,
    [tocGap]: theme.grid.l,
    [tocTriggerInline]: `${tocTriggerInlineSize}px`,
    [tocTriggerBlock]: `${tocTriggerInlineSize}px`,
  },

  // Mobile matches the navbar button's box, so the two read as one control row.
  ...mobileMedia({
    vars: {
      [tocTriggerInline]: fallbackVar(navigationMinInlineSize, `${tocTriggerInlineSize}px`),
      [tocTriggerBlock]: fallbackVar(navigationMinBlockSize, `${tocTriggerInlineSize}px`),
    },
  }),
});

const rail = `${tocMinInlineSize}px`;

/** Matches the content column's inline padding, so the trigger shares its inset. */
export const tocTriggerMargin = pageLayoutInlinePadding;

// The content column's own inline padding supplies the separation on the trailing side.
const gutter = `calc(${tocTriggerMargin} * 2 + ${withBorder(tocTriggerInline)})`;

// A trailing rail-sized track mirrors the real rail, so the content stays viewport-centred.
// `safe` keeps the rail from clipping when the scrollbar makes the wrapper narrower
// than the container the tier was matched against.
whenTier('centered', tocLayoutStyles, {
  gridTemplateColumns: [
    `[${gridLines.fullStart}]`,
    `minmax(${rail}, 1fr)`,
    `[${gridLines.wideStart}]`,
    'minmax(0, 2fr)',
    `[${gridLines.contentStart}]`,
    pageLayoutSize,
    `[${gridLines.contentEnd}]`,
    'minmax(0, 2fr)',
    `[${gridLines.wideEnd}]`,
    `minmax(${rail}, 1fr)`,
    `[${gridLines.fullEnd}]`,
  ].join(' '),
});

// The rail holds its size and the content column absorbs the loss instead.
whenTier('folded', tocLayoutStyles, {
  gridTemplateColumns: [
    `[${gridLines.fullStart}]`,
    rail,
    `[${gridLines.wideStart}]`,
    'minmax(0, 2fr)',
    `[${gridLines.contentStart}]`,
    `minmax(${pageLayoutMinSize}px, ${pageLayoutSize})`,
    `[${gridLines.contentEnd}]`,
    'minmax(0, 2fr)',
    `[${gridLines.wideEnd}]`,
    pageLayoutInlinePadding,
    `[${gridLines.fullEnd}]`,
  ].join(' '),
});

// The rail collapses to a trigger strip in the content's logical-start gutter.
whenTier('drawer', tocLayoutStyles, {
  gridTemplateColumns: [
    `[${gridLines.fullStart}]`,
    gutter,
    `[${gridLines.wideStart}]`,
    'minmax(0, 2fr)',
    `[${gridLines.contentStart}]`,
    `minmax(0, ${pageLayoutSize})`,
    `[${gridLines.contentEnd}]`,
    'minmax(0, 2fr)',
    `[${gridLines.wideEnd}]`,
    pageLayoutInlinePadding,
    `[${gridLines.fullEnd}]`,
  ].join(' '),
});

// Content precedes the rail in the DOM, so every tier places it explicitly.
globalStyle(`${tocLayoutStyles} > ${pageLayoutSelector}`, {
  gridColumn: gridLines.full,
  gridRow: 1,
  gridTemplateColumns: 'subgrid',
  containerType: 'normal',
});
