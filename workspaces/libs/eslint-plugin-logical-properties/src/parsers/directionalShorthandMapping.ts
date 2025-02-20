import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';
import { generateObjectStringTestCases } from '../utils/propertyTraverse.utils.js';
import { generateDirectionalShorthandError } from './directionalShorthand.js';

const generateShorthandMappings = (
  value: string,
  mappings: Array<string>,
) => mappings.map((it) => `"${it}":${value}`);

export const directionalShorthandMappingTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    shorthandMappings,
  },
}) => (
  property,
) => {
  if (!shorthandMappings) {
    return;
  }
  const propertyName = getValidPropertyName(property)!;
  const [source, target] = [
    context.sourceCode.getText(property),
    shorthandMappings[propertyName],
  ];
  const value = context.sourceCode.getText(property.value);
  const replacements = generateShorthandMappings(value, target);
  context.report({
    node,
    message: generateDirectionalShorthandError(source, replacements),
    fix(fixer) {
      return fixer.replaceText(property, replacements.join(','));
    },
  });
};

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
