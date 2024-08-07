import { getSinglePathOf } from './getSinglePathOf.js';

describe('getSinglePathOf', () => {
  it('should be a function', () => {
    expect(typeof getSinglePathOf).toBe('function');
  });
  it('should have one parameter', () => {
    expect(getSinglePathOf.length).toBe(1);
  });
  it.each([
    { input: ['a'], output: 'a' },
    { input: ['a', 'b'], output: 'a:b' },
    { input: [], output: '' },
    { input: ['a', 'b', 'c'], output: 'a:b:c' },
  ])(
    'getSinglePathOf($input) = $output',
    ({ input, output }) => {
      expect(getSinglePathOf(input)).toEqual(output);
    },
  );
});
