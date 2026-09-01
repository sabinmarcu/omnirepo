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
const gutter = `calc(${tocTriggerMargin} + ${withBorder(tocTriggerInline)})`;

// A trailing rail-sized track mirrors the real rail, so the content stays viewport-centred.
// `safe` keeps the rail from clipping when the scrollbar makes the wrapper narrower
// than the container the tier was matched against.
whenTier('centered', tocLayoutStyles, {
  gridTemplateColumns: `${rail} ${pageLayoutSize} ${rail}`,
  justifyContent: 'safe center',
});

// The rail holds its size and the content column absorbs the loss instead.
whenTier('folded', tocLayoutStyles, {
  gridTemplateColumns: `${rail} minmax(${pageLayoutMinSize}px, ${pageLayoutSize})`,
  justifyContent: 'start',
});

// The rail collapses to a trigger strip in the content's logical-start gutter.
whenTier('drawer', tocLayoutStyles, {
  gridTemplateColumns: `${gutter} minmax(0, ${pageLayoutSize})`,
  justifyContent: 'safe center',
});

// Content precedes the rail in the DOM, so every tier places it explicitly.
globalStyle(`${tocLayoutStyles} > ${pageLayoutSelector}`, {
  gridColumn: 2,
  gridRow: 1,
});

// PageLayout is an inline-size container, so its intrinsic width is 0; without
// neutralising its auto margins it would shrink to padding instead of filling the track.
globalStyle(`${tocLayoutStyles} > ${pageLayoutSelector}`, {
  boxSizing: 'border-box',
  inlineSize: '100%',
  minInlineSize: 0,
  marginInlineStart: 0,
  marginInlineEnd: 0,
});
