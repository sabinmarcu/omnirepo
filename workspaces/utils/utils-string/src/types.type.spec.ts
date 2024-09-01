import type { StringCaseConversionSet } from './types.js';

type StringCaseConversionSetTest1 = StringCaseConversionSet<'kebab'>;
//    ^? type StringCaseConversionSetTest1 = {
//           camel: (value: string) => string;
//           pascal: (value: string) => string;
//           snake: (value: string) => string;
//           screamingSnake: (value: string) => string;
//       }
