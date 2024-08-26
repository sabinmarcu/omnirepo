import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
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
  const [source, target] = [
    context.sourceCode.getText(property.value)
      .replace(/^["'`]/, '')
      .replace(/["'`]$/, ''),
    values[property.key.name],
  ];
  if (Object.keys(target).includes(source)) {
    const replacement = target[source];
    context.report({
      node,
      message: generateDirectionalValueError(property.key.name, source, replacement),
      fix(fixer) {
        return fixer.replaceText(property.value, `'${replacement}'`);
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
  const { functions: functionNames } = inputOptions;
  const options = [inputOptions];
  const { valid, invalid } = {
    valid: [],
    invalid: [],
  } as Required<TestInput>;
  const testName = `${inputTestName}Mapping`;
  for (const functionName of functionNames) {
    for (const [property, propertyValues] of Object.entries(values)) {
      for (const [key, value] of Object.entries(propertyValues)) {
        valid.push(
          ...[
            `const ${testName} = ${functionName}({ ${property}: '${value}', });`,
          ].map((code) => ({
            code,
            options,
          })),
        );
        invalid.push(
          {
            code: `const ${testName} = ${functionName}({ ${property}: '${key}', });`,
            errors: [
              {
                message: generateDirectionalValueError(property, key, value),
              },
            ],
            options,
            output: `const ${testName} = ${functionName}({ ${property}: '${value}', });`,
          },
        );
      }
    }
  }
  return {
    valid,
    invalid,
  } as const;
};
