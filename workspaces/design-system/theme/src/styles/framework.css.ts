import { globalStyle } from '@vanilla-extract/css';
import { themeVariants } from '../constants.js';
import { selectorOfVariant } from '../utils/variantContract.js';
import { frameworkSetupLayer } from './layers.js';

globalStyle(':root', {
  '@layer': {
    [frameworkSetupLayer]: {
      colorScheme: 'light dark',
    },
  },
});

for (const variant of themeVariants) {
  globalStyle(`:root${selectorOfVariant(variant)}`, {
    '@layer': {
      [frameworkSetupLayer]: {
        colorScheme: variant,
      },
    },
  });
}
