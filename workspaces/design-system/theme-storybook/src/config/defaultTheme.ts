import {
  pickThemeFamily,
  setupThemeFamily,
} from '@sabinmarcu/theme/family.runtime';
import { themes } from './themes.js';
import { themeValues } from './themes.values.js';

setupThemeFamily(
  themes as any,
  themeValues as any,
);

pickThemeFamily(themes as any, 'base');
