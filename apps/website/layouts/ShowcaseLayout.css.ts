import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { zIndexLayers } from '@/constants/layers';
import { mobileMedia } from '@/utils/responsive';
import { navigationBlockOffset } from './Navigation.css';

export const showcaseLayoutStyles = style({
  containerName: 'showcase',
  containerType: 'size',
  inlineSize: '100cqw',
  background: theme.colors.background.depressed,
  position: 'relative',
  blockSize: '100cqh',
  ...mobileMedia({
    blockSize: `calc(100cqh - ${navigationBlockOffset})`,
  }, true),
});

globalStyle(`${showcaseLayoutStyles} > [data-root]`, {
  position: 'absolute',
  inset: 0,
  zIndex: zIndexLayers.showcase,
});