import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { zIndexLayers } from '@/constants/layers';
import { mobileMedia } from '@/utils/responsive';
import {
  navigationMinBlockSize,
  navigationSectionsSelectors,
  navigationSelector,
  emptyNavigationSelector,
  navigationSpacing,
  navigationBorderRadius,
  navigationBlockOffset,
} from './Navigation.css';
import { grids } from './Navigation.grid';

export const triggerStyles = style({
  ...mobileMedia({
    display: 'none',
  }, true),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '&&': {
      paddingBlockStart: 0,
      paddingBlockEnd: 0,
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
    },
  },
});

export const backdropStyles = style({
  ...mobileMedia({
    display: 'none',
  }, true),
  position: 'fixed',
  inset: 0,
  zIndex: zIndexLayers.navigationBackdrop,
});

globalStyle([
  `${navigationSelector}.${emptyNavigationSelector} ${triggerStyles}`,
].join(', '), {
  display: 'none',
});

const navigationMobileTriggerSelector = `${triggerStyles} > input`;
const navigationMobileActiveSelector = `:has(${navigationMobileTriggerSelector}:checked)`;

globalStyle(navigationMobileTriggerSelector, {
  inlineSize: 0,
  blockSize: 0,
  opacity: 0,
  position: 'fixed',
  insetInline: '-999px',
  insetBlock: '-999px',
});

globalStyle(`${triggerStyles} > [role=button]`, {
  inlineSize: '100%',
  blockSize: '100%',
  paddingInline: navigationSpacing,
  boxSizing: 'border-box',
});

globalStyle(`${navigationSelector}${navigationSectionsSelectors.settings}`, {
  ...mobileMedia({
    position: 'fixed',
    insetInlineEnd: 0,
    insetBlockStart: 0,
    transform: 'translateX(100cqw)',
  }),
});

globalStyle(`${navigationSelector}${navigationSelector}`, {
  ...mobileMedia({
    position: 'fixed',
    inlineSize: '100cqw',
    blockSize: '100cqh',
    insetInline: 0,
    insetBlock: 0,
    transform: 'translateX(-100cqw)',
    paddingBlockStart: `calc(${navigationMinBlockSize} + ${navigationSpacing})`,
    display: 'flex',
    flexFlow: 'column nowrap',
  }),
});

globalStyle(`${navigationSelector}${navigationSelector}:before`, {
  ...mobileMedia({
    background: 'none',
  }),
});

globalStyle(`${navigationSelector}${navigationSelector} > section:not(${grids.rawSelector('settings')})`, {
  ...mobileMedia({
    display: 'flex',
    flexFlow: 'column nowrap',
    marginInline: navigationSpacing,
    marginBlock: navigationSpacing,
  }),
});

globalStyle(`${navigationSelector}${navigationSelector} > section${grids.rawSelector('major')}`, {
  ...mobileMedia({
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignContent: 'start',
  }),
});

globalStyle(`${navigationSelector}${navigationSelector} > section${grids.rawSelector('major')} > [data-search-entrypoint]`, {
  ...mobileMedia({
    gridColumn: 1,
    gridRow: 1,
  }),
});

globalStyle(`${navigationSelector}${navigationSelector} > section:not(${grids.rawSelector('settings')}) > *`, {
  ...mobileMedia({
    inlineSize: '100%',
    boxSizing: 'border-box',
  }),
});

globalStyle(`${navigationSelector}${navigationSelector} > section${grids.rawSelector('settings')}`, {
  ...mobileMedia({
    borderEndStartRadius: navigationBorderRadius,
  }),
});

globalStyle([
  `${navigationSelector}${navigationMobileActiveSelector}`,
  `${navigationSectionsSelectors.settings}${navigationMobileActiveSelector}`,
].join(', '), {
  ...mobileMedia({
    transform: 'none',
  }),
});

globalStyle([
  'body > *',
].join(', '), {
  ...mobileMedia({
    vars: {
      [navigationBlockOffset]: theme.grid.m,
    },
  }),
});

globalStyle(`${navigationSelector}${navigationSelector}:not(${emptyNavigationSelector}):before`, {
  ...mobileMedia({
    background: `hsla(from ${theme.colors.background.page} h s l / 0.8)`,
  }),
});
