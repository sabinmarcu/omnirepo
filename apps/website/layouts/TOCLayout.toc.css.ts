import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import type { MediaType } from '@/utils/responsive';
import { media as mediaRaw } from '@/utils/responsive';
import {
  navigationBlockOffset,
  navigationMobileElements,
} from './Navigation.css';
import { pageLayoutSize } from './PageLayout.css';

export const breakpoint = 'large' satisfies MediaType;
const media = mediaRaw(breakpoint, 'gte');

export const tocLayoutTOCStyles = style({
  '@media': {
    [media]: {
      position: 'sticky',
      insetInline: 0,
      insetBlockStart: navigationBlockOffset,
    },
  },
});

const tocSize = createVar();
const availableTocSpace = createVar();
const preferredTocSize = createVar();
globalStyle(`${tocLayoutTOCStyles} section`, {
  '@media': {
    [media]: {
      maxInlineSize: tocSize,
      inlineSize: tocSize,

      position: 'sticky',

      insetInlineStart: `calc(100cqw / 2 - ${pageLayoutSize} / 2 - ${tocSize})`,

      vars: {
        [availableTocSpace]: `calc(100cqw / 2 - ${pageLayoutSize} / 2)`,
        [preferredTocSize]: `calc(${pageLayoutSize} / 3)`,
        [tocSize]: `min(${preferredTocSize}, ${availableTocSpace})`,
      },
    },
  },

});

const tocMargin = createVar();
const tocPadding = createVar();
// eslint-disable-next-line logical-properties/overflow
globalStyle(`${tocLayoutTOCStyles} nav`, {
  '@media': {
    [media]: {
      marginInline: tocMargin,

      position: 'absolute',

      insetBlockStart: tocMargin,
      insetInline: 0,

      borderStartStartRadius: '2px',
      borderStartEndRadius: '2px',
      borderEndEndRadius: '2px',
      borderEndStartRadius: '2px',

      borderInlineStart: `solid 1px ${theme.colors.primary.muted}`,
      borderInlineEnd: `solid 1px ${theme.colors.primary.muted}`,
      borderBlockStart: `solid 1px ${theme.colors.primary.muted}`,
      borderBlockEnd: `solid 1px ${theme.colors.primary.muted}`,

      maxBlockSize: `calc(100cqh - ${navigationBlockOffset} - ${tocMargin} * 2)`,

    },
  },
  maxBlockSize: '100cqh',

  paddingBlock: tocPadding,
  paddingInline: tocPadding,

  overflowX: 'hidden',
  overflowY: 'auto',

  fontSize: theme.grid.l,
  background: theme.colors.background.depressed,

  vars: {
    [tocMargin]: theme.grid.xl,
    [tocPadding]: theme.grid.m,
  },
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

