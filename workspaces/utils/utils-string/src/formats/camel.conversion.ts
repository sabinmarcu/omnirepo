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

export const camelToKebab = <T extends string>(value: T): KebabCase<T> => (
  fromCamelToDelimited(value, '-') as KebabCase<T>
);

export const camelToSnake = <T extends string>(value: T): SnakeCase<T> => (
  fromCamelToDelimited(value, '_') as SnakeCase<T>
);

export const camelToText = <T extends string>(value: T): DelimiterCase<T, ' '> => (
  fromCamelToDelimited(value, ' ') as DelimiterCase<T, ' '>
);

export const camelToPascal = <T extends string>(value: T): PascalCase<T> => (
  capitalizeFirst(value) as PascalCase<T>
);

export const toCamel = <T extends string>(value: T): CamelCase<T> => {
  if (isCamelCase(value)) {
    return value as CamelCase<T>;
  }
  if (isKebabCase(value)) {
    return fromDelimitedToCamel(value, '-');
  }
  if (isSnakeCase(value)) {
    return fromDelimitedToCamel(value, '_');
  }
  if (isPascalCase(value)) {
    return `${value[0].toLowerCase()}${value.slice(1)}` as CamelCase<T>;
  }
  return fromDelimitedToCamel(value, ' ');
};
