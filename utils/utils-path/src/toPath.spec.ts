import { toPath } from './toPath';

describe('toPath', () => {
  it('should be a function', () => {
    expect(typeof toPath).toBe('function');
  });
  it('should have one parameter', () => {
    expect(toPath.length).toBe(1);
  });
  it.each([
    { input: 'foo', expected: 'foo' },
    { input: new URL('.', 'file:///'), expected: '/' },
    { input: new URL('some/url', 'file:///'), expected: '/some/url' },
  ] as const)('toPath($input) = $output', ({ input, expected }) => {
    expect(toPath(input)).toBe(expected);
  });
});
