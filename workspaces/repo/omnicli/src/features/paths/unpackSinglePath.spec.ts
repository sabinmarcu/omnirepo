import {
  describe,
  it,
  expect,
} from 'vitest';
import { unpackSinglePath } from './unpackSinglePath.js';

describe('unpackSinglePath', () => {
  it('should be a function', () => {
    expect(typeof unpackSinglePath).toBe('function');
  });
  it('should have one parameter', () => {
    expect(unpackSinglePath.length).toBe(1);
  });
  it.each([
    {
      input: 'test1',
      output: ['test1'],
    },
    {
      input: 'test1:test2',
      output: ['test1', 'test2'],
    },
    {
      input: 'test1:test2:test3',
      output: ['test1', 'test2', 'test3'],
    },
    {
      input: '',
      output: [''],
    },
    {
      input: ':',
      output: ['', ''],
    },
    {
      input: 'test1:',
      output: ['test1', ''],
    },
  ])(
    'unpackSinglePath($input) = $output',
    ({ input, output }) => {
      expect(unpackSinglePath(input)).toEqual(output);
    },
  );
});
