import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { variantSelector } from '@sabinmarcu/website-theme';
import { themeSelections } from './ThemeSelector.constants';

export const selectionDataAttribute = 'data-selection';

export const themeSelectorStyles = style({});

globalStyle(`${themeSelectorStyles} > [${selectionDataAttribute}]`, {
  display: 'none',
});

for (const selection of themeSelections) {
  globalStyle(`[${variantSelector}=${selection}] ${themeSelectorStyles} > [${selectionDataAttribute}=${selection}]`, {
    display: 'inline-block',
  });
}