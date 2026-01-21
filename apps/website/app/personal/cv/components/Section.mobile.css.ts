import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
import { sectionStyles } from './Section.css';

globalStyle(`${sectionStyles}:has(> article ~ article)`, {
  ...mobileMedia({
    display: 'flex',
    flexFlow: 'column nowrap',
  }),
});
