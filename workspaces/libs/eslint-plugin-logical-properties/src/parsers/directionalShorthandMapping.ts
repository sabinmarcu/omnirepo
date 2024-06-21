import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';
import { generateDirectionalShorthandError } from './directionalShorthand.js';

const generateShorthandMappings = (
  value: string,
  mappings: Array<string>,
) => mappings.map((it) => `${it}: ${value}`);

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
  const [source, target] = [
    context.sourceCode.getText(property),
    shorthandMappings[property.key.name],
  ];
  const value = context.sourceCode.getText(property.value);
  const replacements = generateShorthandMappings(value, target);
  context.report({
    node,
    message: generateDirectionalShorthandError(source, replacements),
    fix(fixer) {
      return fixer.replaceText(property, replacements.join(', '));
    },
  });
};

export const directionalShorthandMappingTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  functionNames,
  config: { shorthandMappings },
}) => {
  if (!shorthandMappings) {
    return {
      valid: [],
      invalid: [],
    };
  }

  const { valid, invalid } = {
    valid: [],
    invalid: [],
  } as Required<TestInput>;
  const testName = `${inputTestName}ShorthandMapping`;

  for (const functionName of functionNames) {
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
          const value = `${quote}${input}${quote}`;
          const source = `${property}: ${value}`;
          const results = generateShorthandMappings(value, propertyMappings);
          invalid.push({
            code: `
    export const ${testName} = ${functionName}({
      ${source},
    });
`.trim(),
            options: functionNames,
            errors: [{ message: generateDirectionalShorthandError(source, results) }],
            output: `
    export const ${testName} = ${functionName}({
      ${results.join(', ')},
    });
`,
          });
        }
      }
    }
  }
  return {
    valid,
    invalid,
  } as const;
};
