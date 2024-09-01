export { createProxyString } from './createProxyString.js';

export type { StringCases } from './types.js';

export { stringCases as supportedStringCases } from './constants.js';

export { stringCase } from './converter.js';

export {
  kebabToCamel,
  kebabToPascal,
  kebabToScreamingSnake,
  kebabToSnake,
} from './cases/kebab.js';
export {
  camelToKebab,
  camelToPascal,
  camelToScreamingSnake,
  camelToSnake,
} from './cases/camel.js';
export {
  pascalToCamel,
  pascalToKebab,
  pascalToScreamingSnake,
  pascalToSnake,
} from './cases/pascal.js';
export {
  snakeToCamel,
  snakeToPascal,
  snakeToScreamingSnake,
  snakeToKebab,
} from './cases/snake.js';
export {
  screamingSnakeToCamel,
  screamingSnakeToPascal,
  screamingSnakeToKebab,
  screamingSnakeToSnake,
} from './cases/screamingSnake.js';
