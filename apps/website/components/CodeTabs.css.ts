import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const outlineColor = `color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`;

export const codeTabsStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.grid.s,
});

export const codeTabsListStyle = style({
  display: 'inline-flex',
  alignSelf: 'flex-start',
  maxInlineSize: '100%',
  flexWrap: 'wrap',

  borderInlineStart: `2px solid ${outlineColor}`,
  borderInlineEnd: `2px solid ${outlineColor}`,
  borderBlockStart: `2px solid ${outlineColor}`,
  borderBlockEnd: `2px solid ${outlineColor}`,

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  overflow: 'hidden',
});

export const codeTabsTriggerStyle = recipe({
  base: {
    appearance: 'none',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '0.8rem',
    color: 'inherit',
    borderInlineStart: 'none',
    borderInlineEnd: `2px solid ${outlineColor}`,
    borderBlockStart: 'none',
    borderBlockEnd: 'none',

    paddingBlock: theme.grid.xs,
    paddingInline: theme.grid.s,

    transition: 'background 0.2s ease, opacity 0.2s ease',

    selectors: {
      '&:last-child': {
        borderInlineEnd: 'none',
      },
    },
  },

  variants: {
    active: {
      true: {
        opacity: 1,
        background: theme.colors.background.surface,
      },
      false: {
        opacity: 0.6,
        background: 'transparent',
        selectors: {
          '&:hover': {
            opacity: 1,
            background: `color-mix(in hsl, ${theme.colors.background.surface} 50%, transparent)`,
          },
        },
      },
    },
  },

  defaultVariants: {
    active: false,
  },
});

export const codeTabsPanelStyle = style({
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});
