import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
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
globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base} :where(ul, ol)`, {
  ...mobileMedia({
    ...columnsReset,
  }),
});

globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base}:not(:has(> :where(ul, ol))) > *`, {
  ...mobileMedia({
    ...alignmentReset,
  }),
});

globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base}:not(:has(> :where(ul, ol))):not(${gridStyles.classNames.variants.grid.true}) > *`, {
  ...mobileMedia({
    display: 'list-item',
  }),
});

globalStyle(`${gridStyles.classNames.base}${gridStyles.classNames.base} :where(ul, ol) :where(:first-child, :last-child)`, {
  ...mobileMedia({
    ...alignmentReset,
  }),
});

globalStyle(`${gridStyles.classNames.variants.large.true}${gridStyles.classNames.base}`, {
  ...mobileMedia({
    marginBlock: 0,
  }),
});

globalStyle(`${gridStyles.classNames.variants.grid.true}`, {
  ...mobileMedia({
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: 0,
  }),
});
