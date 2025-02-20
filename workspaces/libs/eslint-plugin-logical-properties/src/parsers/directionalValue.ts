import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';
import {
  generateObjectStringTestCases,
} from '../utils/propertyTraverse.utils.js';
import { generateDirectionalPropertyError } from './directionalMapping.js';

export const generateDirectionalValueError = (
  property: string,
  source: string,
  target: string,
) => generateDirectionalPropertyError(
  `${property}: ${source}`,
  `${property}: ${target}`,
);

export const directionalValueTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    values = {},
  },
}) => (
  property,
) => {
  const propertyName = getValidPropertyName(property)!;
  const [source, target] = [
    context.sourceCode.getText(property.value)
      .replace(/^["'`]/, '')
      .replace(/["'`]$/, ''),
    values[propertyName],
  ];
  if (Object.keys(target).includes(source)) {
    const replacement = target[source];
    context.report({
      node,
      message: generateDirectionalValueError(propertyName, source, replacement),
      fix(fixer) {
        return fixer.replaceText(property.value, `"${replacement}"`);
      },
    });
  }
};

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
