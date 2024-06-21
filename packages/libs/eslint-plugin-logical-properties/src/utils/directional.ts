import type { ObjectExpression } from 'estree';
import type { Rule } from 'eslint';
import { RuleTester } from 'eslint';

export const generateDirectionalPropertyError = (
  source: string,
  target: string,
) => `${source} should be replaced with ${target}`;

export const generateDirectionalDisableError = (source: string) => (
  `${source} is disallowed as it does not adapt to writing direction changes`
);

export const transformDirectionalProperty = (
  node: ObjectExpression,
  context: Rule.RuleContext,
  mappings: Record<string, string>,
  disable: string | string[],
) => {
  const toDisable = Array.isArray(disable) ? disable : [disable];
  const sources = Object.keys(mappings);
  for (const property of node.properties) {
    if (
      property.type === 'Property'
      && property.key.type === 'Identifier'
    ) {
      if (sources.includes(property.key.name)) {
        const [source, target] = [
          property.key.name,
          mappings[property.key.name],
        ];
        const value = context.getSourceCode().getText(property.value);

        context.report({
          node,
          message: generateDirectionalPropertyError(source, target),
          fix(fixer) {
            return fixer.replaceText(property, `${target}: ${value}`);
          },
        });
      } else if (toDisable.includes(property.key.name)) {
        context.report({
          node,
          message: generateDirectionalDisableError(property.key.name),
        });
      }
    }
  }
};

export const generateDirectionalRules = (
  mappings: Record<string, string>,
  disable: string | string[],
): Rule.RuleModule => ({
  meta: {
    type: 'problem',
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier'
          && node.callee.name === 'style'
        ) {
          const [rules] = node.arguments;
          if (rules.type === 'ArrayExpression') {
            for (const ruleSet of rules.elements) {
              if (ruleSet?.type === 'ObjectExpression') {
                transformDirectionalProperty(
                  ruleSet,
                  context,
                  mappings,
                  disable,
                );
              }
            }
          } else if (rules.type === 'ObjectExpression') {
            transformDirectionalProperty(rules, context, mappings, disable);
          }
        }
      },
    };
  },
});

const trimTestInput = (input: any[]) => input.map(({ code, output, ...rest }) => {
  const result = { ...rest };
  if (code) {
    result.code = code.trim();
  }
  if (output) {
    result.output = output.trim();
  }
  return result;
});

export const runDirectionalRulesTests = (
  testName: string,
  mappings: Record<string, string>,
  rule: Rule.RuleModule,
  disabled: string | string[],
) => {
  const valid: Array<any> = [];
  const invalid: Array<any> = [];

  // For each directional variant
  for (const [source, target] of Object.entries(mappings)) {
    // Valid Cases
    valid.push(
      ...[
        `
export const ${testName} = style({
  ${target}: 5,
});
`,
      ].map((code) => ({ code })),
    );

    // Invalid Cases
    invalid.push(
      {
        code: `
  export const ${testName} = style({
    ${source}: 5,
  });
  `,
        errors: [
          {
            message: generateDirectionalPropertyError(source, target),
          },
        ],
        output: `
  export const ${testName} = style({
    ${target}: 5,
  });
  `,
      },
      {
        code: `
  export const ${testName} = style({
    ${source}: theme.padding,
  });
  `,
        errors: [
          {
            message: generateDirectionalPropertyError(source, target),
          },
        ],
        output: `
  export const ${testName} = style({
    ${target}: theme.padding,
  });
  `,
      },
    );
  }

  // For disabled cases
  const toBeDisabled = Array.isArray(disabled) ? disabled : [disabled];
  for (const disabledProperty of toBeDisabled) {
    invalid.push(
      {
        code: `
  export const ${testName} = style({
    ${disabledProperty}: theme.padding,
  });
  `,
        errors: [
          {
            message: generateDirectionalDisableError(disabledProperty),
          },
        ],
      },
      {
        code: `
  export const ${testName} = style({
    ${disabledProperty}: 5,
  });
  `,
        errors: [
          {
            message: generateDirectionalDisableError(disabledProperty),
          },
        ],
      },
    );
  }

  const ruleTester = new RuleTester({
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });

  ruleTester.run(testName, rule, {
    valid: trimTestInput(valid),
    invalid: trimTestInput(invalid),
  });
};
