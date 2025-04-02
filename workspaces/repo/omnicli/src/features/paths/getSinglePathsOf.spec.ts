import {
  describe,
  it,
  expect,
} from 'vitest';
import { getSinglePathsOf } from './getSinglePathsOf.js';

describe('getSinglePathsOf', () => {
  it('should be a function', () => {
    expect(typeof getSinglePathsOf).toBe('function');
  });
  it('should have one parameter', () => {
    expect(getSinglePathsOf.length).toBe(1);
  });
  it.each([
    {
      input: [['a']],
      output: ['a'],
    },
    {
      input: [['a', 'b']],
      output: ['a:b'],
    },
    {
      input: [],
      output: [],
    },
    {
      input: [['a', 'b'], ['c']],
      output: ['a:b', 'c'],
    },
    {
      input: [['a'], ['b'], ['c']],
      output: ['a', 'b', 'c'],
    },
  ])(
    'getSinglePathsOf($input) = $output',
    ({ input, output }) => {
      expect(getSinglePathsOf(input)).toEqual(output);
    },
  );
});
