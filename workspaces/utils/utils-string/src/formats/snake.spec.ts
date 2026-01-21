import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  isSnakeCase,
  snakeToCamel,
  snakeToKebab,
  snakeToPascal,
  snakeToText,
  toSnake,
} from './snake.js';

describe('snake_case', () => {
  it.each([
    ['a', true],
    ['awesomeStuff', false],
    ['snake_case', true],
    ['definitely Not snake', false],
    ['is_2_snakes', true],
    ['is-still-not-snake', false],
  ])('isSnakeCase(%s) = %s', (input, expected) => {
    expect(isSnakeCase(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['snake_case', 'snakeCase'],
    ['is_2_snakes', 'is2Snakes'],
  ])('snakeToCamel(%s) = %s', (input, expected) => {
    expect(snakeToCamel(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['snake_case', 'snake-case'],
    ['is_2_snakes', 'is-2-snakes'],
  ])('snakeToKebab(%s) = %s', (input, expected) => {
    expect(snakeToKebab(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['snake_case', 'snake case'],
    ['is_2_snakes', 'is 2 snakes'],
  ])('snakeToText(%s) = %s', (input, expected) => {
    expect(snakeToText(input)).toBe(expected);
  });
  it.each([
    ['a', 'A'],
    ['snake_case', 'SnakeCase'],
    ['is_2_snakes', 'Is2Snakes'],
  ])('snakeToPascal(%s) = %s', (input, expected) => {
    expect(snakeToPascal(input)).toBe(expected);
  });
  it.each([
    ['a', 'a'],
    ['awesomeStuff', 'awesome_stuff'],
    ['awesome_stuff', 'awesome_stuff'],
    ['awesome-stuff', 'awesome_stuff'],
    ['AwesomeStuff', 'awesome_stuff'],
    ['awesome stuff', 'awesome_stuff'],
    ['is 2 camels', 'is_2_camels'],
  ])('toSnake(%s) = %s', (input, expected) => {
    expect(toSnake(input)).toBe(expected);
  });
});
