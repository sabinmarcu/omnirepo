import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from 'type-fest';
import {
  isKebabCase,
  kebabToCamel,
} from './kebab.js';
import { isPascalCase, pascalToCamel } from './pascal.js';
import { isSnakeCase, snakeToCamel } from './snake.js';
import { textToCamel } from './text.js';

export const isCamelCase = (
  input: string,
) => /^[a-z][a-zA-Z0-9]*$/.test(input);

export const camelToKebab = <T extends string>(str: T): KebabCase<T> => (
  str.replace(/[A-Z0-9]/g, (match) => `-${match.toLowerCase()}`) as KebabCase<T>
);

export const camelToSnake = <T extends string>(str: T): SnakeCase<T> => (
  str.replace(/[A-Z0-9]/g, (match) => `_${match.toLowerCase()}`) as SnakeCase<T>
);

export const camelToText = <T extends string>(str: T): DelimiterCase<T, ' '> => (
  str.replace(/[A-Z0-9]/g, (match) => ` ${match.toLowerCase()}`) as DelimiterCase<T, ' '>
);

export const camelToPascal = <T extends string>(str: T): PascalCase<T> => ([
  str[0].toUpperCase(),
  str.substring(1),
].join('') as PascalCase<T>);

export const toCamel = <T extends string>(str: T): CamelCase<T> => {
  if (isCamelCase(str)) {
    return str as CamelCase<T>;
  }
  if (isKebabCase(str)) {
    return kebabToCamel(str);
  }
  if (isSnakeCase(str)) {
    return snakeToCamel(str);
  }
  if (isPascalCase(str)) {
    return pascalToCamel(str);
  }
  return textToCamel(str);
};

export const camel = toCamel;
