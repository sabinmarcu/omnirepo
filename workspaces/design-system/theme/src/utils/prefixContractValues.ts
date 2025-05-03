import type { createGlobalTheme } from '@vanilla-extract/css';
import { prefixVariable } from './prefixVariable.js';

const cssVariableRegex = /var\(--([a-zA-Z0-9-]+)\)/g;
export const prefixContractValues = <
  const Values extends Parameters<typeof createGlobalTheme>[2],
  const Prefix extends string = string,
>(
    values: Values,
    prefix?: Prefix,

  ): Values => {
  if (!prefix) {
    return values;
  }
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => {
        let newValue = value;
        if (typeof newValue === 'string') {
          for (const [match] of value.matchAll(cssVariableRegex)) {
            newValue = newValue.replace(match, prefixVariable(match as any, prefix));
          }
        } else {
          newValue = prefixContractValues(newValue, prefix);
        }
        return [key, newValue];
      }),
  ) as any;
};
