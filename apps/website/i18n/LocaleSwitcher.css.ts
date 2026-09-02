import { style } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/website-theme';
import {
  navigationBorderColor,
  navigationBorderRadius,
  navigationBorderSize,
  navigationSpacing,
} from '@/layouts/Navigation.css';

export const localeSwitcherStyle = style({
  minBlockSize: '2.5rem',
  paddingInline: navigationSpacing,
  paddingBlock: navigationSpacing,
  borderInlineStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderInlineEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderRadius: navigationBorderRadius,
  background: theme.colors.background.page,
  color: theme.colors.background.text,
  cursor: 'pointer',
  font: 'inherit',
});
