import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  fallbackVar,
  style,
} from '@vanilla-extract/css';

export const markColor = createVar();
const resolvedMarkColor = fallbackVar(markColor, theme.colors.primary.base);

export const markedLineStyle = style({
  boxShadow: `inset 2px 0 ${resolvedMarkColor}`,
  background: `color-mix(in hsl, ${resolvedMarkColor} 12%, transparent)`,
});

export const markedInlineStyle = style({
  outline: `1px solid color-mix(in hsl, ${resolvedMarkColor} 50%, transparent)`,
  background: `color-mix(in hsl, ${resolvedMarkColor} 16%, transparent)`,
  borderRadius: '2px',
});
