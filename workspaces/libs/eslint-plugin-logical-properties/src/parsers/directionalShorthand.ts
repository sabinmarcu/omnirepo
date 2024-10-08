import type { Rule } from 'eslint';
import type {
  DirectionalTransformerFactory,
  DirectionalTransformerTestsFactory,
  TestInput,
  ValidProperty,
} from '../types.js';
import { MustDisablePropertyError } from '../utils/MustDisablePropertyError.js';
import {
  stringToTemplate,
  tokenizeString,
} from '../utils/tokenizeString.js';

export const generateDirectionalShorthandError = (
  source: string,
  targets: string[],
) => (
  `${source} should be replaced with the following properties: \n${targets.map((it) => `- ${it}`).join('\n')}`
);

const expandShorthandOptions = (
  options: Array<Array<string>>,
  values: Array<string>,
) => {
  const results: string[] = [];
  for (const [index, value] of Object.entries(values)) {
    const localMappings = options[+index];
    const localResult = localMappings.map((mapping) => `${mapping}: \`${value}\``);
    results.push(...localResult);
  }
  return results;
};

const getPropertyValues = (
  context: Rule.RuleContext,
  property: ValidProperty,
) => {
  const stringToTokenize = stringToTemplate(
    context.sourceCode.getText(property.value)
      .replace(/^["'`]/, '')
      .replace(/["'`]$/, ''),
  );
  const { output, tokens } = tokenizeString(stringToTokenize);

  const values = output.split(' ');
  return {
    values,
    replacements: tokens,
  } as const;
};

export const directionalShorthandTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    shorthands = {},
  },
}) => (
  property,
) => {
  const {
    values,
    replacements,
  } = getPropertyValues(context, property);
  const options = shorthands[property.key.name][values.length - 1];
  if (!options) {
    throw new MustDisablePropertyError();
  }
  const sourceText = context.sourceCode.getText(property);
  const results = expandShorthandOptions(options, values)
    .map((it) => {
      let final = it;
      for (const [target, value] of replacements) {
        final = final.replace(target, value);
      }
      return final;
    });

  context.report({
    node,
    message: generateDirectionalShorthandError(sourceText, results),
    fix(fixer) {
      return fixer.replaceText(property, results.join(', '));
    },
  });
};

export const directionalShorthandTestGenerator: DirectionalTransformerTestsFactory = ({
  testName: inputTestName,
  options: inputOptions,
  config: { shorthands },
}) => {
  if (!shorthands) {
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
  const testName = `${inputTestName}Shorthand`;

  for (const functionName of functionNames) {
    for (const [property, shorthandOptions] of Object.entries(shorthands)) {
      for (const shorthandOption of shorthandOptions) {
        const ruleValues = Array.from({ length: shorthandOption.length }).fill(0).map((_, index) => `value-${index}`);
        const quotesSet = [
          '"',
          '\'',
          '`',
        ];
        const valuesSet = [ruleValues, ruleValues.map((it) => `\${${it}}`)];
        for (const quote of quotesSet) {
          for (const values of valuesSet) {
            const input = values.join(' ');
            const source = `${property}: ${quote}${input}${quote}`;
            const results = expandShorthandOptions(shorthandOption, values);
            invalid.push({
              code: `
    export const ${testName} = ${functionName}({
      ${source},
    });
`.trim(),
              options,
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
  }
  return {
    valid,
    invalid,
  } as const;
};
