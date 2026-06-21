import type { ValidProperty } from '../types.js';

export const isValidProperty = (property: unknown): property is ValidProperty => {
  if (typeof property !== 'object' || property === null) {
    return false;
  }

  const candidate = property as {
    type?: unknown,
    key?: {
      type?: unknown,
    },
    value?: unknown,
  };

  return (
    candidate.type === 'Property'
    && !!candidate.key
    && (
      candidate.key.type === 'Identifier'
      || candidate.key.type === 'Literal'
    )
    && candidate.value !== undefined
  );
};
