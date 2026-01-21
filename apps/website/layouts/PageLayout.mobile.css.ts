import { globalStyle } from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';
import { pageLayoutStyles } from './PageLayout.css';
import {
  navigationMobileElements,
  navigationMinInlineSize,
} from './Navigation.css';

globalStyle(`${pageLayoutStyles.classNames.base} > :first-child:is(h1,h2)`, {
  ...mobileMedia({
    maxInlineSize: `calc(100cqw - ${navigationMobileElements} * ${navigationMinInlineSize})`,
  }),
});
