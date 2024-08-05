import { deriveAlias } from './deriveAlias';

describe('deriveAlias', () => {
  it('should be a function', () => {
    expect(deriveAlias).toBeInstanceOf(Function);
  });
  it('should have one parameter', () => {
    expect(deriveAlias.length).toBe(1);
  });
  describe.each([
    {
      input: '@scope/name',
      output: [
        'name',
        '@scope/name',
      ],
    },
    {
      input: 'name',
      output: ['name'],
    },
    {
      input: '',
      output: [''],
    },
  ])('$input', ({
    input, output,
  }) => {
    it('should return the expected value', () => {
      expect(deriveAlias(input)).toEqual(output);
    });
  });
});
