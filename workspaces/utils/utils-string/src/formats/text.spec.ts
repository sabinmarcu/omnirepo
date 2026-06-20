import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  isTextCase,
} from './text.predicate.js';
import {
  textToCamel,
  textToKebab,
  textToPascal,
  textToSnake,
  toText,
} from './text.conversion.js';

describe('text case', () => {
  it.each([
    ['a', true],
    ['text case', true],
    ['is 2 texts', true],
    ['is_2 texts', false],
    ['awesome-stuff', false],
    ['AwesomeStuff', false],
  ])('isTextCase(%s) = %s', (input, expected) => {
    expect(isTextCase(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['text case', 'textCase'],
    ['is 2 texts', 'is2Texts'],
    ['is_2 texts', 'is_2Texts'],
  ])('textToCamel(%s) = %s', (input, expected) => {
    expect(textToCamel(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['text case', 'text-case'],
    ['is 2 texts', 'is-2-texts'],
    ['is_2 texts', 'is_2-texts'],
  ])('textToKebab(%s) = %s', (input, expected) => {
    expect(textToKebab(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['text case', 'text_case'],
    ['is 2 texts', 'is_2_texts'],
    ['is_2 texts', 'is_2_texts'],
  ])('textToSnake(%s) = %s', (input, expected) => {
    expect(textToSnake(input)).toBe(expected);
  });
  it.each([
    ['a', 'A'],
    ['text case', 'TextCase'],
    ['is 2 texts', 'Is2Texts'],
    ['is_2 texts', 'Is_2Texts'],
  ])('textToPascal(%s) = %s', (input, expected) => {
    expect(textToPascal(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesome stuff'],
    ['awesome-stuff', 'awesome stuff'],
    ['awesome_stuff', 'awesome stuff'],
    ['AwesomeStuff', 'awesome stuff'],
    ['awesome stuff', 'awesome stuff'],
    ['is 2 camels', 'is 2 camels'],
  ])('toText(%s) = %s', (input, expected) => {
    expect(toText(input)).toBe(expected);
  });
});
