import type {
  CamelCase,
  KebabCase,
  PascalCase,
  ScreamingSnakeCase,
  SnakeCase,
} from '@sabinmarcu/types';
import type { stringCases } from './constants.js';

export type StringCases = typeof stringCases[number];

export type StringToKebabConversionFunction = <T extends string>(input: T) => KebabCase<T>;
export type StringToPascalConversionFunction = <T extends string>(input: T) => PascalCase<T>;
export type StringToCamelConversionFunction = <T extends string>(input: T) => CamelCase<T>;
export type StringToSnakeConversionFunction = <T extends string>(input: T) => SnakeCase<T>;
export type StringToScreamingSnakeConversionFunction = <T extends string>(
  input: T
) => ScreamingSnakeCase<T>;

export type StringConversionMap = {
  kebab: StringToKebabConversionFunction;
  pascal: StringToPascalConversionFunction;
  camel: StringToCamelConversionFunction;
  snake: StringToSnakeConversionFunction;
  'screamingSnake': StringToScreamingSnakeConversionFunction;
};

export type StringCaseConversionSet<T extends StringCases> = {
  [Key in Exclude<StringCases, T>]: (value: string) => string;
};

export type StringCaseConversion = {
  [Key in StringCases]: StringCaseConversionSet<Key>;
};
