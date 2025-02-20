import type { ValidProperty } from '../types.js';

export const getValidPropertyName = (property: ValidProperty): string | undefined => (
  (property.key.type === 'Identifier' && property.key.name)
  || (property.key.type === 'Literal' && property.key.value)
  || undefined
);
