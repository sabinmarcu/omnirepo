import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

const tooltipSpacing = createVar();
const center = createVar();
export const tooltipStyle = recipe({
  variants: {
    position: {
      top: {
        insetBlockEnd: 'anchor(self-start)',
        insetInlineStart: 'anchor(start)',
        positionTryFallbacks: 'flip-inline, flip-block, flip-inline flip-block',
        // insetInlineStart: 'anchor(center)',
        // transform: `translateX(${center})`,
        // positionTryFallbacks: 'flip-block',
      },
      bottom: {
        insetBlockStart: 'anchor(self-end)',
        insetInlineStart: 'anchor(start)',
        positionTryFallbacks: 'flip-inline, flip-block, flip-inline flip-block',
        // insetInlineStart: 'anchor(center)',
        // transform: `translateX(${center})`,
        // positionTryFallbacks: 'flip-block',
      },
      left: {
        insetBlockEnd: 'anchor(start)',
        insetInlineStart: 'anchor(self-start)',
        positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
        // insetInlineEnd: 'anchor(left)',
        // transform: `translateY(${center})`,
        // positionTryFallbacks: 'flip-inline',
      },
      right: {
        insetBlockEnd: 'anchor(end)',
        insetInlineStart: 'anchor(self-start)',
        positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
        // insetInlineStart: 'anchor(right)',
        // transform: `translateY(${center})`,
        // positionTryFallbacks: 'flip-inline',
      },
    },
  },
  base: {
    position: 'absolute',

    inlineSize: 'auto',
    blockSize: 'auto',

    marginBlock: tooltipSpacing,
    marginInline: tooltipSpacing,
    paddingInline: theme.grid.m,

    background: theme.colors.background.surface,

    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.colors.background.elevated,

    borderStartStartRadius: '2px',
    borderStartEndRadius: '2px',
    borderEndEndRadius: '2px',
    borderEndStartRadius: '2px',

    fontSize: theme.grid.l,

    vars: {
      [tooltipSpacing]: '0px',
      [center]: `calc(-50% - ${tooltipSpacing})`,
    },
  },
});

const { classNames: { base: tooltipSelector } } = tooltipStyle;
globalStyle(tooltipSelector, {
  opacity: 0,
  // Shown by hovering the anchor, never itself, so it must not intercept clicks.
  pointerEvents: 'none',
  transition: 'opacity 0.2s ease-out',
});

globalStyle(`:has(+ ${tooltipSelector}):hover + ${tooltipSelector}`, {
  opacity: 0.8,
});

export type TooltipStyleProps = RecipeVariants<typeof tooltipStyle>;
