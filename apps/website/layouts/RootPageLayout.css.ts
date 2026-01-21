import { theme } from '@sabinmarcu/theme';
import {
  style,
} from '@vanilla-extract/css';

export const rootScrollTimeline = '--root-scroll-timeline';
export const rootPageLayoutStyles = style({
  inlineSize: '100cqw',
  blockSize: '100cqh',
  position: 'relative',
  containerType: 'inline-size',
  overflowInline: 'hidden',
  overflowBlock: 'auto',
  background: theme.colors.background.page,
  scrollTimeline: `${rootScrollTimeline} block`,
});
