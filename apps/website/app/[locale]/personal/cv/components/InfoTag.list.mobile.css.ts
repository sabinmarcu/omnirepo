import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { infoTagListStyles } from './InfoTag.list.css';

globalStyle(`${infoTagListStyles}`, {
  ...mobileMedia({
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    gap: theme.grid.xxs,
    marginBlockStart: theme.grid.s,
  }),
});
