export const rulePrefix = 'logical-properties';
export const defaultFunctions = [
  'style',
  'globalStyle',
  'recipe',
  'sprinkles',
  'defineProperties',
] as const;
export const defaultKeyframes = ['keyframes'] as const;
export const defaultResolvers = [
  'selectors.*',
  '@media.*',
  '@supports.*',
  'base',
  'variants.*.*',
  'compoundVariants.*.style',
] as const;
export const defaultJsxAttributes = ['style'] as const;

