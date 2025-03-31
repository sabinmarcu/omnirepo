import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';

export const generateDirectionalDisableError = (source: string) => (
  `${source} is disallowed as it does not adapt to writing direction changes`
);

export const directionalDisableTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
}) => (
  property,
) => {
  const propertyName = getValidPropertyName(property)!;
  context.report({
    node: node as any,
    message: generateDirectionalDisableError(propertyName),
  });
};

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
