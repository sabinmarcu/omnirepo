import type {
  DirectionalTransformerFactory,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';

export const generateDirectionalPropertyError = (
  source: string,
  target: string,
) => `${source} should be replaced with ${target}`;

export const directionalMappingTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
  config: {
    mappings = {},
  },
}) => (
  property,
) => {
  const propertyName = getValidPropertyName(property)!;
  const [source, target] = [propertyName, mappings[propertyName]];
  const value = context.sourceCode.getText(property.value);

  context.report({
    node,
    message: generateDirectionalPropertyError(source, target),
    fix(fixer) {
      return fixer.replaceText(property, `"${target}":${value}`);
    },
  });
};

