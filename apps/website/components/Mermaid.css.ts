import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const mermaidStyle = style({
  inlineSize: '100%',
  textAlign: 'center',
  overflowInline: 'auto',
  overscrollBehaviorInline: 'contain',
  // Mermaid lays out by measuring live nodes here, which the global
  // `transition: all` in `app/globals.css.ts` corrupts.
  transition: 'none',
});

globalStyle(`${mermaidStyle} *`, {
  transition: 'none',
});

globalStyle(`${mermaidStyle} > svg`, {
  maxInlineSize: '100%',
  blockSize: 'auto',
});

export const mermaidFallbackStyle = style({
  margin: 0,
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  overflowInline: 'auto',
  fontSize: '0.9em',
  color: theme.colors.error.base,
});
