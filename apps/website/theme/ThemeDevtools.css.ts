import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';

export const themeDevtoolsLauncherStyle = style({
  position: 'fixed',
  insetInlineEnd: theme.grid.m,
  insetBlockEnd: theme.grid.m,
  zIndex: zIndexLayers.experiments,
  paddingInline: theme.grid.m,
  paddingBlock: theme.grid.s,
  borderInlineStart: 0,
  borderInlineEnd: 0,
  borderBlockStart: 0,
  borderBlockEnd: 0,
  borderRadius: '2px',
  background: theme.colors.background.surface,
  color: theme.colors.background.text,
  cursor: 'pointer',

  selectors: {
    '&:hover': {
      background: theme.colors.background.elevated,
    },
  },
});

