import type { Rule } from 'eslint';
import type {
  DirectionalRuleShorthandPairMappings,
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
  options: ReadonlyArray<ReadonlyArray<string>>,
  values: ReadonlyArray<string>,
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
  const sourceCode = context.sourceCode.getText(property.value);
  if (!/^["'`].*["'`]$/.test(sourceCode)) {
    return {
      isTemplateString: false,
      values: [sourceCode],
      replacements: [] as [string, string][],
    } as const;
  }

  const stringToTokenize = stringToTemplate(
    sourceCode
      .replace(/^["'`]/, '')
      .replace(/["'`]$/, ''),
  );
  const { output, tokens } = tokenizeString(stringToTokenize);

  const values = output.trim().split(/\s+/).filter(Boolean);
  return {
    isTemplateString: true,
    values,
    replacements: tokens,
  } as const;
};

const applyTokenReplacements = (
  input: string,
  replacements: [string, string][],
) => {
  let output = input;
  for (const [target, value] of replacements) {
    output = output.replace(target, value);
  }
  return output;
};

const expandPairMappingOptions = (
  pairMappings: DirectionalRuleShorthandPairMappings,
  values: string[],
  isTemplateString: boolean,
) => {
  const [first, second] = values;
  return expandShorthandOptions(
    [
      [...pairMappings[0]],
      [...pairMappings[1]],
    ],
    [first, second],
    isTemplateString,
  );
};

export const directionalShorthandTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    shorthands = {},
    shorthandPairMappings = {},
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
  if (values.length <= 1) {
    return;
  }

  let results: string[];
  if (values.length === 2 && shorthandPairMappings[propertyName]) {
    results = expandPairMappingOptions(
      shorthandPairMappings[propertyName],
      values,
      isTemplateString,
    );
  } else {
    const options = shorthands[propertyName]?.[values.length - 1];
    if (!options) {
      throw new MustDisablePropertyError();
    }
    results = expandShorthandOptions(options, values, isTemplateString);
  }

  const sourceText = context.sourceCode.getText(property);
  const replacedResults = results.map((it) => applyTokenReplacements(it, replacements));

  context.report({
    node,
    message: generateDirectionalShorthandError(sourceText, replacedResults),
    fix(fixer) {
      return fixer.replaceText(property, replacedResults.join(','));
    },
  });
};

