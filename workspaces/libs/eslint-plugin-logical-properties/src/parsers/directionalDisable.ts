import type {
  DirectionalTransformerFactory,
} from '../types.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';

export const generateDirectionalDisableError = (source: string) => (
  `${source} is disallowed as it does not adapt to writing direction changes`
);

export const directionalDisableTransformerFactory: DirectionalTransformerFactory = ({
  node,
  context,
}) => (
  property,
) => {
  const propertyName = getValidPropertyName(property)!;
  context.report({
    node: node as any,
    message: generateDirectionalDisableError(propertyName),
  });
};
