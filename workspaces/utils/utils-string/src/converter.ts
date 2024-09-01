import { stringCases } from './constants.js';
import type { StringConversions } from './converter.types.js';
import { createProxyString } from './createProxyString.js';
import { kebabCaseConversion } from './cases/kebab.js';
import type {
  StringCaseConversion,
  StringCases,
} from './types.js';
import { snakeCaseConversion } from './cases/snake.js';
import { pascalCaseConversion } from './cases/pascal.js';
import { camelCaseConversion } from './cases/camel.js';
import { screamingSnakeCaseConversion } from './cases/screamingSnake.js';

export const caseConversions = {
  kebab: kebabCaseConversion,
  snake: snakeCaseConversion,
  pascal: pascalCaseConversion,
  camel: camelCaseConversion,
  screamingSnake: screamingSnakeCaseConversion,
} as any satisfies StringCaseConversion;

export const stringCase = <
  Input extends string,
  Case extends StringCases,
>(
    input: Input,
    caseInput: Case,
  ) => {
  const conversion = caseConversions[caseInput];
  const stringExtras = {} as StringConversions<Input>;

  // Cases
  for (const targetCase of stringCases) {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (targetCase === caseInput) {
      stringExtras[targetCase] = (() => stringCase(input, caseInput) as any) as any;
    } else {
      stringExtras[targetCase] = () => {
        const conversionFunction = conversion[targetCase];
        const converted = conversionFunction(input);
        const next = stringCase(
          converted,
          targetCase,
        ) as any;
        return next;
      };
    }
  }

  // Done
  return createProxyString(stringExtras, input);
};

