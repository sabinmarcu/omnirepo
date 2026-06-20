import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  isPascalCase,
} from './pascal.predicate.js';
import {
  pascalToCamel,
  pascalToKebab,
  pascalToSnake,
  pascalToText,
  toPascal,
} from './pascal.conversion.js';

describe('PascalCase', () => {
  it.each([
    ['A', true],
    ['awesomeStuff', false],
    ['IsPascalCase', true],
    ['definitely Not camel', false],
    ['Is2Camels', true],
    ['is-not-a-camel', false],
    ['is_still_not_camel', false],
  ])('isPascalCase(%s) = %s', (input, expected) => {
    expect(isPascalCase(input)).toBe(expected);
  });
  it.each([
    ['A', 'a'],
    ['IsPascalCase', 'isPascalCase'],
    ['Is2Camels', 'is2Camels'],
  ])('pascalToCamel(%s) = %s', (input, expected) => {
    expect(pascalToCamel(input)).toBe(expected);
  });
  it.each([
    ['A', 'a'],
    ['IsPascalCase', 'is-pascal-case'],
    ['Is2Camels', 'is-2-camels'],
  ])('pascalToKebab(%s) = %s', (input, expected) => {
    expect(pascalToKebab(input)).toBe(expected);
  });
  it.each([
    ['A', 'a'],
    ['IsPascalCase', 'is_pascal_case'],
    ['Is2Camels', 'is_2_camels'],
  ])('pascalToSnake(%s) = %s', (input, expected) => {
    expect(pascalToSnake(input)).toBe(expected);
  });
  it.each([
    ['A', 'a'],
    ['IsPascalCase', 'is pascal case'],
    ['Is2Camels', 'is 2 camels'],
  ])('pascalToText(%s) = %s', (input, expected) => {
    expect(pascalToText(input)).toBe(expected);
  });
  it.each([
    ['a', 'A'],
    ['awesomeStuff', 'AwesomeStuff'],
    ['awesome_stuff', 'AwesomeStuff'],
    ['awesome-stuff', 'AwesomeStuff'],
    ['AwesomeStuff', 'AwesomeStuff'],
    ['awesome stuff', 'AwesomeStuff'],
    ['is 2 camels', 'Is2Camels'],
  ])('toPascal(%s) = %s', (input, expected) => {
    expect(toPascal(input)).toBe(expected);
  });
});
