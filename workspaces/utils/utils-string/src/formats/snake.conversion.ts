import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from '@sabinmarcu/types';
import {
  isCamelCase,
} from './camel.predicate.js';
import {
  isKebabCase,
} from './kebab.predicate.js';
import {
  isPascalCase,
} from './pascal.predicate.js';
import {
  isSnakeCase,
} from './snake.predicate.js';

const capitalizeFirst = (value: string) => [
  value[0].toUpperCase(),
  value.slice(1),
].join('');

const fromDelimitedToCamel = <T extends string>(value: T, delimiter: string): CamelCase<T> => {
  const [first = '', ...rest] = value.toLowerCase().split(delimiter);
  return [
    first,
    ...rest.map(capitalizeFirst),
  ].join('') as CamelCase<T>;
};

const fromCamelToDelimited = <T extends string>(value: T, delimiter: string): string => (
  value.replaceAll(/([A-Z0-9])/g, `${delimiter}$1`).toLowerCase()
);

export const snakeToCamel = <T extends string>(value: T): CamelCase<T> => (
  fromDelimitedToCamel(value, '_')
);

export const snakeToKebab = <T extends string>(value: T): KebabCase<T> => (
  value.replaceAll('_', '-') as KebabCase<T>
);

export const snakeToText = <T extends string>(value: T): DelimiterCase<T, ' '> => (
  value.replaceAll('_', ' ') as DelimiterCase<T, ' '>
);

export const snakeToPascal = <T extends string>(value: T): PascalCase<T> => (
  capitalizeFirst(fromDelimitedToCamel(value, '_')) as PascalCase<T>
);

export const toSnake = <T extends string>(value: T): SnakeCase<T> => {
  if (isSnakeCase(value)) {
    return value as SnakeCase<T>;
  }
  if (isCamelCase(value)) {
    return fromCamelToDelimited(value, '_') as SnakeCase<T>;
  }
  if (isKebabCase(value)) {
    return value.replaceAll('-', '_') as SnakeCase<T>;
  }
  if (isPascalCase(value)) {
    return fromCamelToDelimited(`${value[0].toLowerCase()}${value.slice(1)}`, '_') as SnakeCase<T>;
  }
  return value.toLowerCase().replaceAll(' ', '_') as SnakeCase<T>;
};
