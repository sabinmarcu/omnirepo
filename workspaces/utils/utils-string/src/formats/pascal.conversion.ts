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

export const pascalToCamel = <T extends string>(value: T): CamelCase<T> => (
  `${value[0].toLowerCase()}${value.slice(1)}` as CamelCase<T>
);

export const pascalToKebab = <T extends string>(value: T): KebabCase<T> => (
  fromCamelToDelimited(pascalToCamel(value), '-') as KebabCase<T>
);

export const pascalToSnake = <T extends string>(value: T): SnakeCase<T> => (
  fromCamelToDelimited(pascalToCamel(value), '_') as SnakeCase<T>
);

export const pascalToText = <T extends string>(value: T): DelimiterCase<T, ' '> => (
  fromCamelToDelimited(pascalToCamel(value), ' ') as DelimiterCase<T, ' '>
);

export const toPascal = <T extends string>(value: T): PascalCase<T> => {
  if (isPascalCase(value)) {
    return value as PascalCase<T>;
  }
  if (isCamelCase(value)) {
    return `${value[0].toUpperCase()}${value.slice(1)}` as PascalCase<T>;
  }
  if (isKebabCase(value)) {
    return capitalizeFirst(fromDelimitedToCamel(value, '-')) as PascalCase<T>;
  }
  if (isSnakeCase(value)) {
    return capitalizeFirst(fromDelimitedToCamel(value, '_')) as PascalCase<T>;
  }
  return capitalizeFirst(fromDelimitedToCamel(value, ' ')) as PascalCase<T>;
};
