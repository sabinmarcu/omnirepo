import type {
  StringCaseConversionSet,
  StringToCamelConversionFunction,
  StringToPascalConversionFunction,
  StringToScreamingSnakeConversionFunction,
  StringToSnakeConversionFunction,
} from '../types.js';

export const snakeToCamel: StringToCamelConversionFunction = (value) => (
  value.replaceAll(
    /_([a-z])/g,
    (_, letter) => letter.toUpperCase(),
  ) as any
);

export const snakeToPascal: StringToPascalConversionFunction = (value) => {
  const camel = snakeToCamel(value);
  return camel.charAt(0).toUpperCase() + camel.slice(1) as any;
};

export const snakeToKebab: StringToSnakeConversionFunction = (value) => (
  value.replaceAll('_', '-') as any
);

export const snakeToScreamingSnake: StringToScreamingSnakeConversionFunction = (value) => (
  value.toUpperCase() as any
);

export const snakeCaseConversion = {
  camel: snakeToCamel,
  pascal: snakeToPascal,
  kebab: snakeToKebab,
  screamingSnake: snakeToScreamingSnake,
} satisfies StringCaseConversionSet<'snake'>;
