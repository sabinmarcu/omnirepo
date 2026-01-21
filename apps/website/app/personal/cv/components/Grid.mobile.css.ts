import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { gridStyles } from './Grid.css';

const columnsReset = {
  columns: 1,
} satisfies Parameters<typeof globalStyle>[1];

const alignmentReset = {
  textAlign: 'left',
} satisfies Parameters<typeof globalStyle>[1];

globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base}`, {
  ...mobileMedia({
    ...columnsReset,
    ...alignmentReset,
  }),
});
globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base} :is(ul, ol)`, {
  ...mobileMedia({
    ...columnsReset,
  }),
});

globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base}:not(:has(> :is(ul, ol))) > *`, {
  ...mobileMedia({
    ...alignmentReset,
    display: 'list-item',
    marginInlineStart: theme.grid.m,
  }),
});
globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base} :is(ul, ol) :is(:first-child, :last-child)`, {
  ...mobileMedia({
    ...alignmentReset,
  }),
});

globalStyle(`${gridStyles.classNames.variants.large.true}${gridStyles.classNames.base}`, {
  ...mobileMedia({
    marginBlock: 0,
  }),
});
