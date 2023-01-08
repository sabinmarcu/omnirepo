import { matchPath } from './matchPath';

describe('matchPath', () => {
  it('should be a function', () => {
    expect(typeof matchPath).toBe('function');
  });
  it('should have two parameters', () => {
    expect(matchPath.length).toBe(2);
  });
  it.each([
    { input: ['a'], options: [['a']], output: ['a', []] },
    { input: ['a'], options: [['b']], output: undefined },
    { input: ['a'], options: [['a'], ['b']], output: ['a', []] },
    { input: ['a'], options: [['b'], ['a']], output: ['a', []] },
    { input: ['a', 'b'], options: [['a']], output: ['a', ['b']] },
    { input: ['a', 'b'], options: [['a', 'b']], output: ['a:b', []] },
    { input: ['a', 'b', 'c'], options: [['a', 'b']], output: ['a:b', ['c']] },
  ])(
    'matchPath($options, $input) = $output',
    ({ input, options, output }) => {
      expect(matchPath(options, input)).toEqual(output);
    },
  );
});
