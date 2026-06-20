import {
  type CamelCase,
  type KebabCase,
  type SnakeCase,
  type DelimiterCase,
  type PascalCase,
} from 'type-fest';
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

export const kebabToCamel = <T extends string>(value: T): CamelCase<T> => (
  fromDelimitedToCamel(value, '-')
);

export const kebabToSnake = <T extends string>(value: T): SnakeCase<T> => (
  value.replaceAll('-', '_') as SnakeCase<T>
);

export const kebabToText = <T extends string>(value: T): DelimiterCase<T, ' '> => (
  value.replaceAll('-', ' ') as DelimiterCase<T, ' '>
);

export const kebabToPascal = <T extends string>(value: T): PascalCase<T> => (
  capitalizeFirst(fromDelimitedToCamel(value, '-')) as PascalCase<T>
);

export const toKebab = <T extends string>(value: T): KebabCase<T> => {
  if (isKebabCase(value)) {
    return value as KebabCase<T>;
  }
  if (isCamelCase(value)) {
    return fromCamelToDelimited(value, '-') as KebabCase<T>;
  }
  if (isSnakeCase(value)) {
    return value.replaceAll('_', '-') as KebabCase<T>;
  }
  if (isPascalCase(value)) {
    return fromCamelToDelimited(`${value[0].toLowerCase()}${value.slice(1)}`, '-') as KebabCase<T>;
  }
  return value.toLowerCase().replaceAll(' ', '-') as KebabCase<T>;
};
