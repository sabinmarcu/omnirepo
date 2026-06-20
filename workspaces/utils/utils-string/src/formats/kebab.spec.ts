import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  isKebabCase,
} from './kebab.predicate.js';
import {
  kebabToCamel,
  kebabToPascal,
  kebabToSnake,
  kebabToText,
  toKebab,
} from './kebab.conversion.js';

describe('kebab-case', () => {
  it.each([
    ['a', true],
    ['awesomeStuff', false],
    ['kebab-case', true],
    ['definitely Not kebab', false],
    ['is-2-kebabs', true],
    ['is_still_not_kebab', false],
  ])('isKebabCase(%s) = %s', (input, expected) => {
    expect(isKebabCase(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['kebab-case', 'kebabCase'],
    ['is-2-kebabs', 'is2Kebabs'],
  ])('kebabToCamel(%s) = %s', (input, expected) => {
    expect(kebabToCamel(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['kebab-case', 'kebab_case'],
    ['is-2-kebabs', 'is_2_kebabs'],
  ])('kebabToSnake(%s) = %s', (input, expected) => {
    expect(kebabToSnake(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['kebab-case', 'kebab case'],
    ['is-2-kebabs', 'is 2 kebabs'],
  ])('kebabToText(%s) = %s', (input, expected) => {
    expect(kebabToText(input)).toBe(expected);
  });
  it.each([
    ['a', 'A'],
    ['kebab-case', 'KebabCase'],
    ['is-2-kebabs', 'Is2Kebabs'],
  ])('kebabToPascal(%s) = %s', (input, expected) => {
    expect(kebabToPascal(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesome-stuff'],
    ['awesome_stuff', 'awesome-stuff'],
    ['awesome-stuff', 'awesome-stuff'],
    ['AwesomeStuff', 'awesome-stuff'],
    ['awesome stuff', 'awesome-stuff'],
    ['is 2 camels', 'is-2-camels'],
  ])('toKebab(%s) = %s', (input, expected) => {
    expect(toKebab(input)).toBe(expected);
  });
});
