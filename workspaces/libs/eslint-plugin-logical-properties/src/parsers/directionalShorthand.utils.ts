import type {
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';
import {
  expandShorthandOptions,
  generateDirectionalShorthandError,
} from './directionalShorthand.js';

export const directionalShorthandTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  options: inputOptions,
  config: { shorthands },
}) => {
  if (!shorthands) {
    return {
      valid: [],
      invalid: [],
    };
  }
  const { functions: functionNames = [], resolvers = [] } = inputOptions;
  const options = [inputOptions];

  const { valid, invalid } = {
    valid: [],
    invalid: [],
  } as Required<TestInput>;
  const testName = `${inputTestName}Shorthand`;

  for (const functionName of functionNames) {
    const testCaseGenerator = generateObjectStringTestCases.bind(undefined, {
      testName,
      functionName,
      resolvers,
    });
    for (const [property, shorthandOptions] of Object.entries(shorthands)) {
      for (const shorthandOption of shorthandOptions) {
        const ruleValues = Array.from({ length: shorthandOption.length }).fill(0).map((_, index) => `value-${index}`);
        const quotesSet = [
          '"',
          '\'',
          '`',
        ];
        const valuesSet = [ruleValues, ruleValues.map((it) => `\${${it}}`)];
        for (const quote of quotesSet) {
          for (const values of valuesSet) {
            const input = values.join(' ');
            const source = `"${property}":${quote}${input}${quote}`;
            const results = expandShorthandOptions(shorthandOption, values, true);
            const invalidInputs = testCaseGenerator({
              input: `{${source}}`,
              output: `{${results.join(',')}}`,
            });
            invalid.push(
              ...invalidInputs.map(({ code, output }) => ({
                code,
                options,
                errors: [{ message: generateDirectionalShorthandError(source, results) }],
                output,
              })),
            );
          }
        }
      }
    }
  }
  return {
    valid,
    invalid,
  } as const;
};
