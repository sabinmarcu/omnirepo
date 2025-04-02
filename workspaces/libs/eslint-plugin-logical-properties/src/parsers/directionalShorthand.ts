import type { Rule } from 'eslint';
import type {
  DirectionalTransformerFactory,
  ValidProperty,
} from '../types.js';
import { MustDisablePropertyError } from '../utils/MustDisablePropertyError.js';
import {
  stringToTemplate,
  tokenizeString,
} from '../utils/tokenizeString.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';

export const generateDirectionalShorthandError = (
  source: string,
  targets: string[],
) => (
  `${source} should be replaced with the following properties: \n${targets.map((it) => `- ${it}`).join('\n')}`
);

export const expandShorthandOptions = (
  options: Array<Array<string>>,
  values: Array<string>,
  isTemplateString = false,
) => {
  const results: string[] = [];
  for (const [index, value] of Object.entries(values)) {
    const localMappings = options[+index];
    const localResult = localMappings.map((mapping) => {
      const localValue = isTemplateString
        ? `\`${value}\``
        : `${value}`;
      return `"${mapping}":${localValue}`;
    });
    results.push(...localResult);
  }
  return results;
};

const getPropertyValues = (
  context: Rule.RuleContext,
  property: ValidProperty,
) => {
  const sourceCode = context.sourceCode.getText(property.value as any);
  if (!/^["'`].*["'`]$/.test(sourceCode)) {
    return {
      isTemplateString: false,
      values: [sourceCode] as unknown as string[],
      replacements: [] as unknown as [string, string][],
    } as const;
  }

  const stringToTokenize = stringToTemplate(
    sourceCode
      .replace(/^["'`]/, '')
      .replace(/["'`]$/, ''),
  );
  const { output, tokens } = tokenizeString(stringToTokenize);

  const values = output.split(' ');
  return {
    isTemplateString: true,
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
  const propertyName = getValidPropertyName(property)!;
  const {
    values,
    replacements,
    isTemplateString,
  } = getPropertyValues(context, property);
  const options = shorthands[propertyName][values.length - 1];
  if (!options) {
    throw new MustDisablePropertyError();
  }
  const sourceText = context.sourceCode.getText(property as any);
  const results = expandShorthandOptions(options, values, isTemplateString)
    .map((it) => {
      let final = it;
      for (const [target, value] of replacements) {
        final = final.replace(target, value);
      }
      return final;
    });

  context.report({
    node: node as any,
    message: generateDirectionalShorthandError(sourceText, results),
    fix(fixer) {
      return fixer.replaceText(property, results.join(','));
    },
  });
};

