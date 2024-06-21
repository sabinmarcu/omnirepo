import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';

export const generateDirectionalPropertyError = (
  source: string,
  target: string,
) => `${source} should be replaced with ${target}`;

export const directionalMappingTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    mappings,
  },
}) => (
  property,
) => {
  const [source, target] = [property.key.name, mappings[property.key.name]];
  const value = context.sourceCode.getText(property.value);

  context.report({
    node,
    message: generateDirectionalPropertyError(source, target),
    fix(fixer) {
      return fixer.replaceText(property, `${target}: ${value}`);
    },
  });
};

export const directionalMappingTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  functionNames,
  config: { mappings },
}) => {
  const { valid, invalid } = {
    valid: [],
    invalid: [],
  } as Required<TestInput>;
  const testName = `${inputTestName}Mapping`;
  for (const functionName of functionNames) {
    for (const [source, target] of Object.entries(mappings)) {
      // Valid Cases
      valid.push(
        ...[
          `
export const ${testName} = ${functionName}({
  ${target}: 5,
});
`,
        ]
          .map((code) => ({
            code,
            options: functionNames,
          })),
      );

      // Invalid Cases
      invalid.push(
        {
          code: `
  export const ${testName} = ${functionName}({
    ${source}: 5,
  });
  `,
          options: functionNames,
          errors: [
            {
              message: generateDirectionalPropertyError(source, target),
            },
          ],
          output: `
  export const ${testName} = ${functionName}({
    ${target}: 5,
  });
  `,
        },
        {
          code: `
  export const ${testName} = ${functionName}({
    ${source}: theme.padding,
  });
  `,
          options: functionNames,
          errors: [
            {
              message: generateDirectionalPropertyError(source, target),
            },
          ],
          output: `
  export const ${testName} = ${functionName}({
    ${target}: theme.padding,
  });
  `,
        },
      );
    }
  }

  return {
    valid,
    invalid,
  } as const;
};
