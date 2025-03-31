import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';

export const generateDirectionalPropertyError = (
  source: string,
  target: string,
) => `${source} should be replaced with ${target}`;

export const directionalMappingTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    mappings = {},
  },
}) => (
  property,
) => {
  const propertyName = getValidPropertyName(property)!;
  const [source, target] = [propertyName, mappings[propertyName]];
  const value = context.sourceCode.getText(property.value as any);

  context.report({
    node: node as any,
    message: generateDirectionalPropertyError(source, target),
    fix(fixer) {
      return fixer.replaceText(property, `"${target}":${value}`);
    },
  });
};

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
