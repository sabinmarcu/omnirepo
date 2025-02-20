import type {
  ArrayExpression,
  ObjectExpression,
} from 'estree';
import { isValidProperty } from './isValidProperty.js';
import {
  isWildcard,
  pathToSegments,
  segmentsToPath,
} from './propertyTraverse.utils.js';
import { getValidPropertyName } from './getValidPropertyName.js';

export const propertyTraverse = (
  node: ObjectExpression | ArrayExpression,
  path: string,
): ObjectExpression[] => {
  const [current, ...nextSegments] = pathToSegments(path);

  let currentSelector = current;

  // Account for no further segments
  if (!current && node.type === 'ObjectExpression') {
    return [node];
  }

  // Account for square brackets (string or number selector)
  const squareBracketsMatch = current.match(/\[([^\]]+)]/);
  if (squareBracketsMatch) {
    const [,currentMatch] = squareBracketsMatch;

    if (node.type === 'ArrayExpression') {
      if (/^\d+$/.test(currentMatch)) {
        const index = Number.parseInt(currentMatch, 10);
        const nextProperty = node.elements[index];
        if (nextProperty && nextProperty.type === 'ObjectExpression') {
          return propertyTraverse(nextProperty, segmentsToPath(nextSegments));
        }
      }

      // Wildcard selector on array elements
      if (isWildcard(currentMatch)) {
        const elements: ObjectExpression[] = [];
        for (const element of node.elements) {
          if (element?.type === 'ObjectExpression') {
            elements.push(element);
          }
        }
        return elements.flatMap(
          (element) => propertyTraverse(element, segmentsToPath(nextSegments)),
        );
      }
    }

    currentSelector = currentMatch;
  }

  // Wildcard selector
  if (isWildcard(currentSelector)) {
    if (node.type === 'ObjectExpression') {
      const elements: ObjectExpression[] = [];
      for (const property of node.properties) {
        if (isValidProperty(property) && property.value.type === 'ObjectExpression') {
          elements.push(property.value);
        }
      }
      return elements.flatMap(
        (element) => propertyTraverse(element, segmentsToPath(nextSegments)),
      );
    }
    if (node.type === 'ArrayExpression') {
      const elements: ObjectExpression[] = [];
      for (const element of node.elements) {
        if (element?.type === 'ObjectExpression') {
          elements.push(element);
        }
      }
      return elements.flatMap(
        (element) => propertyTraverse(element, segmentsToPath(nextSegments)),
      );
    }
  }

  if (node.type !== 'ObjectExpression') {
    return [];
  }

  // Direct selector
  const nextProperty = node.properties.find(
    (property) => {
      if (isValidProperty(property)) {
        const propertyName = getValidPropertyName(property);
        return propertyName === currentSelector;
      }
      return false;
    },
  );
  if (
    nextProperty
      && isValidProperty(nextProperty)
      && nextProperty.value.type === 'ObjectExpression'
  ) {
    return propertyTraverse(nextProperty.value, segmentsToPath(nextSegments));
  }

  return [];
};

export const propertyTraverseSet = (
  node: ObjectExpression,
  paths: string[] | readonly string[],
) => {
  const properties = paths
    .flatMap((path) => propertyTraverse(node, path)!)
    .filter(Boolean);

  return properties;
};
