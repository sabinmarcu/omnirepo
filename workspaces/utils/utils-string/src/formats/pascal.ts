import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from 'type-fest';
import {
  camelToKebab,
  camelToPascal,
  camelToSnake,
  camelToText,
  isCamelCase,
} from './camel.js';
import { isKebabCase, kebabToPascal } from './kebab.js';
import { isSnakeCase, snakeToPascal } from './snake.js';
import { textToPascal } from './text.js';

export const isPascalCase = (
  input: string,
) => /^[A-Z][a-zA-Z0-9]*$/.test(input);

export const pascalToCamel = <T extends string>(str: T): CamelCase<T> => ([
  str[0].toLowerCase(),
  str.substring(1),
].join('') as CamelCase<T>);

export const pascalToKebab = <T extends string>(str: T): KebabCase<T> => (
  camelToKebab(pascalToCamel(str)) as KebabCase<T>
);

export const pascalToSnake = <T extends string>(str: T): SnakeCase<T> => (
  camelToSnake(pascalToCamel(str)) as SnakeCase<T>
);

export const pascalToText = <T extends string>(str: T): DelimiterCase<T, ' '> => (
  camelToText(pascalToCamel(str)) as DelimiterCase<T, ' '>
);

export const toPascal = <T extends string>(str: T): PascalCase<T> => {
  if (isPascalCase(str)) {
    return str as PascalCase<T>;
  }
  if (isCamelCase(str)) {
    return camelToPascal(str);
  }
  if (isKebabCase(str)) {
    return kebabToPascal(str);
  }
  if (isSnakeCase(str)) {
    return snakeToPascal(str);
  }
  return textToPascal(str);
};

export const pascal = toPascal;
