import type {
  CamelCase,
  KebabCase,
  PascalCase,
  ScreamingSnakeCase,
  Simplify,
  SnakeCase,
} from '@sabinmarcu/types';
import type { StringCases } from './types.js';
import type { ProxyStringOf } from './createProxyString.types.js';

export type StringToKebabConverter<T extends string> = () => (
  StringWithConversion<KebabCase<T>>
);
export type StringToPascalConverter<T extends string> = () => (
  StringWithConversion<PascalCase<T>>
);
export type StringToCamelConverter<T extends string> = () => (
  StringWithConversion<CamelCase<T>>
);
export type StringToSnakeConverter<T extends string> = () => (
  StringWithConversion<SnakeCase<T>>
);
export type StringToScreamingSnakeConverter<T extends string> = () => (
  StringWithConversion<ScreamingSnakeCase<T>>
);

export type StringConvertersMap<T extends string> = Simplify<{
  kebab: StringToKebabConverter<T>;
  pascal: StringToPascalConverter<T>;
  camel: StringToCamelConverter<T>;
  snake: StringToSnakeConverter<T>;
  'screamingSnake': StringToScreamingSnakeConverter<T>;
}>;

export type StringConversions<T extends string> = {
  [Key in StringCases]: StringConvertersMap<T>[Key];
};

export type StringWithConversion<T extends string> = ProxyStringOf<
  T,
  StringConversions<T>
>;
