import type { ValidProperty } from '../types.js';

export const isValidProperty = (property: any): property is ValidProperty => (
  property.type === 'Property'
  && (
    (property.key.type === 'Identifier')
    || (property.key.type === 'Literal')
  )
  && property.value
);
