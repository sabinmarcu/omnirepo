import { mobileMedia } from '@/utils/responsive';
import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';
import { merge as deepMerge } from 'ts-deepmerge';

export const codeStyles = style(deepMerge(
  {
    background: theme.colors.background.surface,

    paddingBlock: theme.grid.m,
    paddingInline: theme.grid.m,

    borderStartStartRadius: '2px',
    borderStartEndRadius: '2px',
    borderEndEndRadius: '2px',
    borderEndStartRadius: '2px',

    wordBreak: 'break-word',
  } satisfies Parameters<typeof style>[0],

  mobileMedia({
    textWrap: 'pretty',
  }, true),

  mobileMedia({
    overflowX: 'auto',
    fontSize: '0.8rem',
  }),
));
