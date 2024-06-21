import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
} from '../types.js';

export const generateDirectionalDisableError = (source: string) => (
  `${source} is disallowed as it does not adapt to writing direction changes`
);

export const directionalDisableTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
}) => (
  property,
) => {
  context.report({
    node,
    message: generateDirectionalDisableError(property.key.name),
  });
};

export const directionalDisableTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  functionNames,
  config: { disabled = [] },
}) => {
  const { valid, invalid } = {
    valid: [],
    invalid: [],
  } as Required<TestInput>;
  const testName = `${inputTestName}Disable`;
  for (const functionName of functionNames) {
    const toBeDisabled = Array.isArray(disabled) ? disabled : [disabled];
    for (const disabledProperty of toBeDisabled) {
      invalid.push(
        {
          code: `
  export const ${testName} = ${functionName}({
    ${disabledProperty}: disableMe,
  });
  `,
          options: functionNames,
          errors: [
            {
              message: generateDirectionalDisableError(disabledProperty),
            },
          ],
        },
      );
    }
  }
  return {
    valid,
    invalid,
  } as const;
};
