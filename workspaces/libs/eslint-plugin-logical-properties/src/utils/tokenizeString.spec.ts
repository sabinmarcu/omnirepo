import {
  describe,
  it,
  expect,
} from 'vitest';
import type {
  TemplateString,
  TokenizedString,
} from './tokenizeString.js';
import {
  getToken,
  stringToTemplate,
  tokenizeString,
} from './tokenizeString.js';

describe('stringToTemplate', () => {
  it('should be a function', () => {
    expect(stringToTemplate).toBeInstanceOf(Function);
  });
  it('should have one parameter', () => {
    expect(stringToTemplate.length).toBe(1);
  });
  const testCases = [
    {
      input: 'this is awesome',
      output: {
        quasis: ['this is awesome'],
        expressions: [],
      },
    },
    {
      input: 'this is calc(stuff)',
      output: {
        quasis: ['this is', ''],
        expressions: ['calc(stuff)'],
      },
    },
    {
      input: 'this calc(stuff) more',
      output: {
        quasis: ['this', 'more'],
        expressions: ['calc(stuff)'],
      },
    },
    {
      input: 'this calc(stuff + 2) more',
      output: {
        quasis: ['this', 'more'],
        expressions: ['calc(stuff + 2)'],
      },
    },
    {
      input: 'this calc(stuff + var(stuff) + 3) more',
      output: {
        quasis: ['this', 'more'],
        expressions: ['calc(stuff + var(stuff) + 3)'],
      },
    },
    {
      input: 'calc(stuff + var(stuff) + 3) more',
      output: {
        quasis: ['', 'more'],
        expressions: ['calc(stuff + var(stuff) + 3)'],
      },
    },
    {
      input: 'calc(stuff + var(stuff) + 3)',
      output: {
        quasis: ['', ''],
        expressions: ['calc(stuff + var(stuff) + 3)'],
      },
    },
    {
      input: 'calc(a + 1) calc(b + 2)',
      output: {
        quasis: ['', '', ''],
        expressions: ['calc(a + 1)', 'calc(b + 2)'],
      },
    },
  ] as const satisfies { input: string, output: TemplateString }[];
  it.each(testCases)('stringToTemplate($input) = q: $output.quasis, e: $output.expressions', ({ input, output }) => {
    expect(stringToTemplate(input)).toEqual(output);
  });
});

describe('tokenizeString', () => {
  it('should be a function', () => {
    expect(tokenizeString).toBeInstanceOf(Function);
  });
  it('should have one parameter', () => {
    expect(tokenizeString.length).toBe(1);
  });
  const testCases = [
    {
      input: {
        quasis: ['this'],
        expressions: [],
      },
      output: {
        output: 'this',
        tokens: [],
      },
    },
    {
      input: {
        quasis: ['this', 'awesome'],
        expressions: ['calc(is)'],
      },
      output: {
        output: `this ${getToken(0)} awesome`,
        tokens: [
          [getToken(0), 'calc(is)'],
        ],
      },
    },
    {
      input: {
        quasis: ['', '', ''],
        expressions: ['calc(a)', 'calc(b)'],
      },
      output: {
        output: `${getToken(0)} ${getToken(1)}`,
        tokens: [
          [getToken(0), 'calc(a)'],
          [getToken(1), 'calc(b)'],
        ],
      },
    },
  ] as const satisfies { input: TemplateString, output: TokenizedString }[];
  it.each(testCases)('tokenizeString(q: $input.quasis e: $input.expressions) = <$output.output> + $output.tokens', ({ input, output }) => {
    expect(tokenizeString(input)).toEqual(output);
  });
});
