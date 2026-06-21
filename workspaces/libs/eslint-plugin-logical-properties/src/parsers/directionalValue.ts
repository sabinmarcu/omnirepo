import type {
  DirectionalTransformerFactory,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';
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
  const propertyName = getValidPropertyName(property)!;
  const [source, target] = [
    context.sourceCode.getText(property.value)
      .replace(/^["'`]/, '')
      .replace(/["'`]$/, ''),
    values[propertyName],
  ];
  if (Object.keys(target).includes(source)) {
    const replacement = target[source];
    context.report({
      node,
      message: generateDirectionalValueError(propertyName, source, replacement),
      fix(fixer) {
        return fixer.replaceText(property.value, `"${replacement}"`);
      },
    });
  }
};

