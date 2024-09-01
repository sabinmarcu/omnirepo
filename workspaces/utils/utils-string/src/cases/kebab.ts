import type {
  StringCaseConversionSet,
  StringToCamelConversionFunction,
  StringToPascalConversionFunction,
  StringToScreamingSnakeConversionFunction,
  StringToSnakeConversionFunction,
} from '../types.js';

export const kebabToCamel: StringToCamelConversionFunction = (value) => (
  value.replaceAll(
    /-([a-z])/g,
    (_, letter) => letter.toUpperCase(),
  ) as any
);

export const kebabToPascal: StringToPascalConversionFunction = (value) => {
  const camel = kebabToCamel(value);
  return camel.charAt(0).toUpperCase() + camel.slice(1) as any;
};

export const kebabToSnake: StringToSnakeConversionFunction = (value) => (
  value.replaceAll('-', '_') as any
);

export const kebabToScreamingSnake: StringToScreamingSnakeConversionFunction = (value) => (
  kebabToSnake(value).toUpperCase() as any
);

export const kebabCaseConversion = {
  camel: kebabToCamel,
  pascal: kebabToPascal,
  snake: kebabToSnake,
  screamingSnake: kebabToScreamingSnake,
} satisfies StringCaseConversionSet<'kebab'>;
