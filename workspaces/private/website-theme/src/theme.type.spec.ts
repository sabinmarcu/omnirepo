import type { FamilyInput } from '@sabinmarcu/theme-family';
import type {
  families,
  themeDefinition,
} from './index.js';
import {
  createWebsiteTheme,
  theme,
  themeValues,
  themes,
} from './index.js';

const { mobile } = theme.breakpoint.lt;
const inclusive: '(max-width: 700px)' = theme.breakpoint.lte.mobile;
const range: '(700px < width < 1600px)' = theme.breakpoint.between['mobile-screen'];
const originalPrimary: 'var(--theme-colors-primary-base)' = theme.colors.primary.base;
const privatePersonal: 'var(--theme-family-website-families-personal-colors-background-page)' = themes.personal.colors.background.page;
const setup = createWebsiteTheme();
const returned: typeof theme = setup(themeValues);
const values = setup.read();
const sharedGrid: number = values.shared.grid;
const contextualColor: string = values.families.personal.colors.secondary.light;
const names: typeof families[number] = 'personal';
type Input = FamilyInput<typeof themeDefinition.definition.schema, typeof families[number]>;
const invalid: Input = {
  shared: {
    // @ts-expect-error Static website queries do not become shared source inputs.
    breakpoint: { mobile: 500 },
  },
};
// @ts-expect-error Ordered ranges only include forward pairs.
const reversedRange = theme.breakpoint.between['screen-mobile'];
// @ts-expect-error Family values exclude shared grid inputs.
setup.update({ families: { personal: { grid: 24 } } });
// @ts-expect-error Shared fields exclude contextual palette source paths.
setup.update({ shared: { colors: { primary: 'red' } } });

export const websiteAssertions = {
  mobile,
  inclusive,
  range,
  originalPrimary,
  privatePersonal,
  returned,
  sharedGrid,
  contextualColor,
  names,
  invalid,
  reversedRange,
};
