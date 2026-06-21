import type {
  DirectionalTransformerFactory,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';
import { generateDirectionalShorthandError } from './directionalShorthand.js';

export const generateShorthandMappings = (
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

