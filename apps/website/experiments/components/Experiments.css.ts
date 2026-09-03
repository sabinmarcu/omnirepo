import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';

export const experimentsDialogStyle = style({
  selectors: {
    '&[open]': {
      zIndex: zIndexLayers.experiments + 1,
      opacity: 1,
    },
  },

  zIndex: -999,
  opacity: 0,

  position: 'absolute',
  insetInlineStart: '50%',
  insetBlockStart: '50%',
  transform: 'translateX(-50%) translateY(-50%)',

  background: theme.colors.background.surface,

  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  paddingInline: theme.grid.m,

  display: 'flex',
  flexFlow: 'column nowrap',

  '::backdrop': {
    content: '',
    zIndex: zIndexLayers.experiments,
    background: theme.colors.background.page,
    opacity: 0.8,
  },
});

globalStyle(`${experimentsDialogStyle} header`, {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  alignItems: 'center',
});

globalStyle(`${experimentsDialogStyle} header p`, {
  fontSize: theme.grid.l,
});

globalStyle(`${experimentsDialogStyle} button`, {
  paddingBlockStart: theme.grid.s,
  paddingBlockEnd: theme.grid.s,
  paddingInlineStart: theme.grid.s,
  paddingInlineEnd: theme.grid.s,

  marginBlockStart: theme.grid.s,
  marginBlockEnd: theme.grid.s,
  marginInlineStart: theme.grid.s,
  marginInlineEnd: theme.grid.s,

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  background: 'transparent',

  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',

  cursor: 'pointer',
});

globalStyle(`${experimentsDialogStyle} button:hover`, {
  background: theme.colors.background.elevated,
});
