import {
  themes,
  theme,
} from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';
import { merge as deepMerge } from 'ts-deepmerge';
import { mobileMedia } from '@/utils/responsive';

export const codeStyles = style(deepMerge(
  {
    background: themes.neutral.colors.background.surface,

    fontSize: '1rem',

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
