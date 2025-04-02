import type {
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';
import { generateDirectionalDisableError } from './directionalDisable.js';

export const directionalDisableTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  options,
  config: { disabled = [] },
}) => {
  const { functions: functionNames = [], resolvers = [] } = options;
  const { valid, invalid } = {
    valid: [],
    invalid: [],
  } as Required<TestInput>;
  const testName = `${inputTestName}Disable`;
  for (const functionName of functionNames) {
    const toBeDisabled = Array.isArray(disabled) ? disabled : [disabled];
    for (const disabledProperty of toBeDisabled) {
      const invalidInputs = generateObjectStringTestCases({
        testName,
        functionName,
        resolvers,
      }, {
        input: {
          [disabledProperty]: 'disableMe',
        },
      });
      invalid.push(
        ...invalidInputs.map(({ code }) => ({
          code,
          options: functionNames,
          errors: [
            {
              message: generateDirectionalDisableError(disabledProperty),
            },
          ],
        })),
      );
    }
  }
  return {
    valid,
    invalid,
  } as const;
};
