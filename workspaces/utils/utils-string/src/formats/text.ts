import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from 'type-fest';
import { camelToText, isCamelCase } from './camel.js';
import { isKebabCase, kebabToText } from './kebab.js';
import { isPascalCase, pascalToText } from './pascal.js';
import { isSnakeCase, snakeToText } from './snake.js';

export const textToCamel = <T extends string>(str: T): CamelCase<T> => (
  str.toLowerCase().replace(/ [a-z0-9]/g, (match) => `${match[1].toUpperCase()}`) as CamelCase<T>
);
export const textToKebab = <T extends string>(str: T): KebabCase<T> => (
  str.toLowerCase().replace(/ [a-z0-9]/g, (match) => `-${match[1]}`) as KebabCase<T>
);
export const textToSnake = <T extends string>(str: T): SnakeCase<T> => (
  str.toLowerCase().replace(/ [a-z0-9]/g, (match) => `_${match[1]}`) as SnakeCase<T>
);
export const textToPascal = <T extends string>(str: T): PascalCase<T> => {
  const output = textToCamel(str);
  return [
    output[0].toUpperCase(),
    output.substring(1),
  ].join('') as PascalCase<T>;
};

export const toText = <T extends string>(str: T): DelimiterCase<T, ' '> => {
  if (isCamelCase(str)) {
    return camelToText(str);
  }
  if (isSnakeCase(str)) {
    return snakeToText(str);
  }
  if (isKebabCase(str)) {
    return kebabToText(str);
  }
  if (isPascalCase(str)) {
    return pascalToText(str);
  }
  return str as DelimiterCase<T, ' '>;
};

export const text = toText;
