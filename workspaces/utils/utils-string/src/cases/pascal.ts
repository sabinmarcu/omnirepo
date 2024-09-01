import type {
  StringCaseConversionSet,
  StringToCamelConversionFunction,
  StringToPascalConversionFunction,
  StringToScreamingSnakeConversionFunction,
  StringToSnakeConversionFunction,
} from '../types.js';
import {
  camelToKebab,
  camelToSnake,
} from './camel.js';

export const pascalToCamel: StringToPascalConversionFunction = (value) => (
  value.charAt(0).toLowerCase() + value.slice(1) as any
);

export const pascalToKebab: StringToCamelConversionFunction = (value) => (
  camelToKebab(pascalToCamel(value)) as any
);

export const pascalToSnake: StringToSnakeConversionFunction = (value) => (
  camelToSnake(pascalToCamel(value)) as any
);

export const pascalToScreamingSnake: StringToScreamingSnakeConversionFunction = (value) => (
  pascalToSnake(value).toUpperCase() as any
);

export const pascalCaseConversion = {
  kebab: pascalToKebab,
  camel: pascalToCamel,
  snake: pascalToSnake,
  screamingSnake: pascalToScreamingSnake,
} satisfies StringCaseConversionSet<'pascal'>;
