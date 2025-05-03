import {
  pickThemeFamily,
  setupThemeFamily,
} from '@sabinmarcu/theme/family.runtime';
import { themes } from './themes.js';
import { themeValues } from './themes.values.js';

setupThemeFamily(
  themes,
  themeValues,
);

pickThemeFamily(themes as any, 'base');
