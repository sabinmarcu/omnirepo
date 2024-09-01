import type {
  StringCaseConversionSet,
  StringCases,
} from '../types.js';

import fixtures from '../__fixtures__/index.js';

describe('sanity', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});

export const generateTestsForCase = <T extends StringCases>(
  caseName: T,
  conversionSet: StringCaseConversionSet<T>,
) => {
  describe(`stringConversion: ${caseName}`, () => {
    const conversions = Object.keys(conversionSet);
    describe.each(conversions as unknown as string[])('conversion: %s', (conversionName) => {
      const current = conversionName as unknown as keyof typeof conversionSet;
      const conversionFunction = conversionSet[current];
      it('should be a function', () => {
        expect(typeof conversionFunction).toBe('function');
      });
      it('should have one argument', () => {
        expect(conversionFunction.length).toBe(1);
      });
      it.each(fixtures)(`${caseName}.${current}($name)`, (values) => {
        const { [caseName]: input, [current]: output } = values;
        expect(conversionFunction(input)).toBe(output);
      });
    });
  });
};
