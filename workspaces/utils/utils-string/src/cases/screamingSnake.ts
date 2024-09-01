import type {
  StringCaseConversionSet,
  StringToCamelConversionFunction,
  StringToPascalConversionFunction,
  StringToScreamingSnakeConversionFunction,
  StringToSnakeConversionFunction,
} from '../types.js';
import {
  snakeToCamel,
  snakeToKebab,
  snakeToPascal,
} from './snake.js';

export const screamingSnakeToSnake: StringToSnakeConversionFunction = (value) => (
  value.toLowerCase() as any
);

export const screamingSnakeToKebab: StringToCamelConversionFunction = (value) => (
  snakeToKebab(screamingSnakeToSnake(value)) as any
);

export const screamingSnakeToPascal: StringToPascalConversionFunction = (value) => (
  snakeToPascal(screamingSnakeToSnake(value)) as any
);

export const screamingSnakeToCamel: StringToScreamingSnakeConversionFunction = (value) => (
  snakeToCamel(screamingSnakeToSnake(value)) as any
);

export const screamingSnakeCaseConversion = {
  camel: screamingSnakeToCamel,
  pascal: screamingSnakeToPascal,
  snake: screamingSnakeToSnake,
  kebab: screamingSnakeToKebab,
} satisfies StringCaseConversionSet<'screamingSnake'>;
