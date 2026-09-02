import { theme } from '@sabinmarcu/theme';
import {
  style,
} from '@vanilla-extract/css';

export const rootScrollTimeline = '--root-scroll-timeline';
export const rootViewportContainer = 'viewport';
export const rootPageLayoutStyles = style({
  inlineSize: '100cqw',
  blockSize: '100cqh',
  position: 'relative',
  containerName: rootViewportContainer,
  containerType: 'inline-size',
  overflowInline: 'hidden',
  overflowBlock: 'auto',
  background: theme.colors.background.page,
  scrollTimeline: `${rootScrollTimeline} block`,
  scrollBehavior: 'smooth',
  '@media': {
    '(prefers-reduced-motion)': {
      scrollBehavior: 'auto',
    },
  },
});
