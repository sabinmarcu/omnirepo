import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
import { sectionStyles } from './Section.css';

globalStyle(sectionStyles, {
  ...mobileMedia({
    float: 'none',
    maxInlineSize: 'max-content',
    marginBlockEnd: 0,
    marginInlineStart: 0,
  }),
});
