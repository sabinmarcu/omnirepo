import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from 'type-fest';
import { camelToKebab, isCamelCase } from './camel.js';
import { isPascalCase, pascalToKebab } from './pascal.js';
import { isSnakeCase, snakeToKebab } from './snake.js';
import { textToKebab } from './text.js';

export const isKebabCase = <T extends string>(
  input: T,
) => /^[a-z][a-z0-9-]*$/.test(input);

export const kebabToCamel = <T extends string>(str: T): CamelCase<T> => (
  str.replace(/-[a-z0-9]/g, (match) => `${match[1].toUpperCase()}`) as CamelCase<T>
);
export const kebabToSnake = <T extends string>(str: T): SnakeCase<T> => (
  str.replace(/-[a-z0-9]/g, (match) => `_${match[1]}`) as SnakeCase<T>
);
export const kebabToText = <T extends string>(str: T): DelimiterCase<T, ' '> => (
  str.replace(/-[a-z0-9]/g, (match) => ` ${match[1]}`) as DelimiterCase<T, ' '>
);
export const kebabToPascal = <T extends string>(str: T): PascalCase<T> => {
  const output = kebabToCamel(str);
  return [
    output[0].toUpperCase(),
    output.substring(1),
  ].join('') as PascalCase<T>;
};

export const toKebab = <T extends string>(str: T): KebabCase<T> => {
  if (isKebabCase(str)) {
    return str as KebabCase<T>;
  }
  if (isCamelCase(str)) {
    return camelToKebab(str);
  }
  if (isSnakeCase(str)) {
    return snakeToKebab(str);
  }
  if (isPascalCase(str)) {
    return pascalToKebab(str);
  }
  return textToKebab(str);
};

export const kebab = toKebab;
