import {
  setupThemeFamily,
} from '@sabinmarcu/theme/family.runtime';
import {
  setupTheme as websiteThemes,
  themeColors as websiteThemeValues,
} from '@sabinmarcu/website-theme';
import { themes } from './themes.js';
import { themeValues } from './themes.values.js';

setupThemeFamily(
  themes as any,
  themeValues as any,
);

setupThemeFamily(
  websiteThemes as any,
  websiteThemeValues as any,
);
