import { globalStyle } from '@vanilla-extract/css';
import { frameworkSetupLayer } from './layers.js';

globalStyle(':root', {
  '@layer': {
    [frameworkSetupLayer]: {
      colorScheme: 'light dark',
    },
  },
});
