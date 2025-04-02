import type {
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import {
  generateObjectStringTestCases,
} from '../utils/propertyTraverse.utils.js';
import { generateDirectionalValueError } from './directionalValue.js';

export const directionalValueTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  options: inputOptions,
  config: { values },
}) => {
  if (!values) {
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
    for (const [property, propertyValues] of Object.entries(values)) {
      for (const [key, value] of Object.entries(propertyValues)) {
        const testCaseGenerator = generateObjectStringTestCases.bind(undefined, {
          resolvers,
          testName,
          functionName,
        });

        const validInputs = testCaseGenerator({
          input: {
            [property]: value,
          },
        });
        valid.push(
          ...validInputs.map(({ code }) => ({
            code,
            options,
          })),
        );

        const invalidInputs = testCaseGenerator({
          input: {
            [property]: key,
          },
          output: {
            [property]: value,
          },
        });
        invalid.push(
          ...invalidInputs.map(({ code, output }) => ({
            code,
            errors: [
              {
                message: generateDirectionalValueError(property, key, value),
              },
            ],
            options,
            output,
          })),
        );
      }
    }
  }
  return {
    valid,
    invalid,
  } as const;
};
