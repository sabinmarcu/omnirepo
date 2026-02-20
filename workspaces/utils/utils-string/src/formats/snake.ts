import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from 'type-fest';
import { camelToSnake, isCamelCase } from './camel.js';
import { isKebabCase, kebabToSnake } from './kebab.js';
import { isPascalCase, pascalToSnake } from './pascal.js';
import { textToSnake } from './text.js';

export const isSnakeCase = (
  input: string,
) => /^[a-z][a-z0-9_]*$/.test(input);

export const snakeToCamel = <T extends string>(str: T): CamelCase<T> => (
  str.replace(/_[a-z0-9]/g, (match) => `${match[1].toUpperCase()}`) as CamelCase<T>
);
export const snakeToKebab = <T extends string>(str: T): KebabCase<T> => (
  str.replace(/_[a-z0-9]/g, (match) => `-${match[1]}`) as KebabCase<T>
);
export const snakeToText = <T extends string>(str: T): DelimiterCase<T, ' '> => (
  str.replace(/_[a-z0-9]/g, (match) => ` ${match[1]}`) as DelimiterCase<T, ' '>
);
export const snakeToPascal = <T extends string>(str: T): PascalCase<T> => {
  const output = snakeToCamel(str);
  return [
    output[0].toUpperCase(),
    output.substring(1),
  ].join('') as PascalCase<T>;
};

export const toSnake = <T extends string>(str: T): SnakeCase<T> => {
  if (isSnakeCase(str)) {
    return str as SnakeCase<T>;
  }
  if (isCamelCase(str)) {
    return camelToSnake(str);
  }
  if (isKebabCase(str)) {
    return kebabToSnake(str);
  }
  if (isPascalCase(str)) {
    return pascalToSnake(str);
  }
  return textToSnake(str);
};

export const snake = toSnake;
