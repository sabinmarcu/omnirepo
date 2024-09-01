import type {
  StringCaseConversionSet,
  StringToCamelConversionFunction,
  StringToPascalConversionFunction,
  StringToScreamingSnakeConversionFunction,
  StringToSnakeConversionFunction,
} from '../types.js';

export const camelToKebab: StringToCamelConversionFunction = (value) => (
  value.replaceAll(
    /([A-Z])/g,
    (_, letter) => `-${letter.toLowerCase()}`,
  ) as any
);

export const camelToPascal: StringToPascalConversionFunction = (value) => (
  value.charAt(0).toUpperCase() + value.slice(1) as any
);

export const camelToSnake: StringToSnakeConversionFunction = (value) => (
  camelToKebab(value).replaceAll('-', '_') as any
);

export const camelToScreamingSnake: StringToScreamingSnakeConversionFunction = (value) => (
  camelToSnake(value).toUpperCase() as any
);

export const camelCaseConversion = {
  kebab: camelToKebab,
  pascal: camelToPascal,
  snake: camelToSnake,
  screamingSnake: camelToScreamingSnake,
} satisfies StringCaseConversionSet<'camel'>;
