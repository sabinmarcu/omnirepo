import { toUrl } from './toUrl.js';

describe('toUrl', () => {
  it('should be a function', () => {
    expect(typeof toUrl).toBe('function');
  });
  it('should have one parameter', () => {
    expect(toUrl.length).toBe(1);
  });
  it.each([
    {
      input: new URL('.', 'file:///'),
      expected: new URL('.', 'file:///'),
    },
    {
      input: '/',
      expected: new URL('.', 'file:///'),
    },
    {
      input: '/some/url',
      expected: new URL('some/url', 'file:///'),
    },
  ] as const)('toUrl($input) = $output', ({
    input, expected,
  }) => {
    expect(toUrl(input)).toEqual(expected);
  });
});
