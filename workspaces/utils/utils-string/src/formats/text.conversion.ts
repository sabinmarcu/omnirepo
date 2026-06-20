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

export const textToCamel = <T extends string>(value: T): CamelCase<T> => (
  fromDelimitedToCamel(value, ' ')
);

export const textToKebab = <T extends string>(value: T): KebabCase<T> => (
  value.toLowerCase().replaceAll(' ', '-') as KebabCase<T>
);

export const textToSnake = <T extends string>(value: T): SnakeCase<T> => (
  value.toLowerCase().replaceAll(' ', '_') as SnakeCase<T>
);

export const textToPascal = <T extends string>(value: T): PascalCase<T> => (
  capitalizeFirst(fromDelimitedToCamel(value, ' ')) as PascalCase<T>
);

export const toText = <T extends string>(value: T): DelimiterCase<T, ' '> => {
  if (isCamelCase(value)) {
    return value.replaceAll(/([A-Z0-9])/g, ' $1').toLowerCase() as DelimiterCase<T, ' '>;
  }
  if (isSnakeCase(value)) {
    return value.replaceAll('_', ' ') as DelimiterCase<T, ' '>;
  }
  if (isKebabCase(value)) {
    return value.replaceAll('-', ' ') as DelimiterCase<T, ' '>;
  }
  if (isPascalCase(value)) {
    return value.replaceAll(/([A-Z0-9])/g, ' $1').trim().toLowerCase() as DelimiterCase<T, ' '>;
  }
  return value as DelimiterCase<T, ' '>;
};
