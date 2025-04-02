import {
  describe,
  it,
  expect,
} from 'vitest';
import { getValidPropertyName } from './getValidPropertyName.js';

describe('getValidPropertyName', () => {
  it('should be a function', () => {
    expect(getValidPropertyName).toBeInstanceOf(Function);
  });
  it('should have one parameter', () => {
    expect(getValidPropertyName.length).toBe(1);
  });
  it.each([
    {
      input: {
        key: {
          type: 'Identifier',
          name: 'clear',
        },
      },
      output: 'clear',
    },
    {
      input: {
        key: {
          type: 'Literal',
          value: 'clear',
        },
      },
      output: 'clear',
    },
    {
      input: {
        key: {
          type: 'Literal',
          name: 'clear',
        },
      },
      output: undefined,
    },
  ])('getValidPropertyName($input) = $output', ({ input, output }) => {
    expect(getValidPropertyName(input as any)).toEqual(output);
  });
});
