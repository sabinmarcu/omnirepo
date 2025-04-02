import type {
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';
import { generateDirectionalShorthandError } from './directionalShorthand.js';
import { generateShorthandMappings } from './directionalShorthandMapping.js';

export const directionalShorthandMappingTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  options: inputOptions,
  config: { shorthandMappings },
}) => {
  if (!shorthandMappings) {
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
  const testName = `${inputTestName}ShorthandMapping`;

  for (const functionName of functionNames) {
    const testCaseGenerator = generateObjectStringTestCases.bind(undefined, {
      testName,
      functionName,
      resolvers,
    });
    const inputs = [
      'awesome',
      'awesome sauce',
      'awesome sauce text',
    ];
    for (const input of inputs) {
      for (const [property, propertyMappings] of Object.entries(shorthandMappings)) {
        const quotesSet = [
          '"',
          '\'',
          '`',
        ];
        for (const quote of quotesSet) {
          const value = `${quote}${input} => ${functionName}${quote}`;
          const source = `"${property}":${value}`;
          const results = generateShorthandMappings(value, propertyMappings);
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
  return {
    valid,
    invalid,
  } as const;
};
