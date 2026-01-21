import { globalStyle } from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';
import { experimentsDialogStyle } from './Experiments.css';

globalStyle(experimentsDialogStyle, {
  ...mobileMedia({
    width: '100cqw',
    height: '100cqh',
    borderRadius: '0',
  }),
});
