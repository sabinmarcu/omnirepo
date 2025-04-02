import type {
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';
import { generateDirectionalPropertyError } from './directionalMapping.js';

export const directionalMappingTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  options: inputOptions,
  config: { mappings },
}) => {
  if (!mappings) {
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
  const testName = `${inputTestName}Mapping`;
  for (const functionName of functionNames) {
    for (const [source, target] of Object.entries(mappings)) {
      const testCaseGenerator = generateObjectStringTestCases.bind(undefined, {
        resolvers,
        testName,
        functionName,
      });
      // Valid Cases
      const validInputs = testCaseGenerator({
        input: { [target]: 42 },
      });

      valid.push(
        ...validInputs.map(({ code }) => ({
          code,
          options,
        })),
      );

      // Invalid Cases
      const invalidObjects = [
        {
          input: ({ [source]: 42 }),
          output: ({ [target]: 42 }),
        },
        {
          input: ({ [source]: 'theme.padding' }),
          output: ({ [target]: 'theme.padding' }),
        },
      ] as const;
      const invalidInputs = invalidObjects.flatMap((input) => testCaseGenerator(input));
      invalid.push(
        ...invalidInputs.map(({ code, output }) => ({
          code,
          options,
          errors: [
            {
              message: generateDirectionalPropertyError(source, target),
            },
          ],
          output,
        })),
      );
    }
  }

  return {
    valid,
    invalid,
  } as const;
};
