import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  camelToKebab,
  camelToPascal,
  camelToSnake,
  camelToText,
  isCamelCase,
  toCamel,
} from './camel.js';

describe('camelCase', () => {
  it.each([
    ['a', true],
    ['awesomeStuff', true],
    ['NotCamelCase', false],
    ['definitely Not camel', false],
    ['is2Camels', true],
    ['is-not-a-camel', false],
    ['is_still_not_camel', false],
  ])('isCamelCase(%s) = %s', (input, expected) => {
    expect(isCamelCase(input)).toBe(expected);
  });
  it.each([
    ['a', 'A'],
    ['awesomeStuff', 'AwesomeStuff'],
    ['is2Camels', 'Is2Camels'],
  ])('camelToPascal(%s) = %s', (input, expected) => {
    expect(camelToPascal(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesome_stuff'],
    ['is2Camels', 'is_2_camels'],
  ])('camelToSnake(%s) = %s', (input, expected) => {
    expect(camelToSnake(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesome-stuff'],
    ['is2Camels', 'is-2-camels'],
  ])('camelToKebab(%s) = %s', (input, expected) => {
    expect(camelToKebab(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesome stuff'],
    ['is2Camels', 'is 2 camels'],
  ])('camelToText(%s) = %s', (input, expected) => {
    expect(camelToText(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesomeStuff'],
    ['awesome-stuff', 'awesomeStuff'],
    ['awesome_stuff', 'awesomeStuff'],
    ['AwesomeStuff', 'awesomeStuff'],
    ['awesome stuff', 'awesomeStuff'],
    ['is 2 camels', 'is2Camels'],
  ])('toCamel(%s) = %s', (input, expected) => {
    expect(toCamel(input)).toBe(expected);
  });
});
