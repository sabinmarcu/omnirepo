import type { createGlobalThemeContract } from '@vanilla-extract/css';
import { prefixVariable } from './prefixVariable.js';

export const prefixContract = <
  const Contract extends ReturnType<typeof createGlobalThemeContract>,
  const Prefix extends string = string,
>(
    contract: Contract,
    prefix?: Prefix,
  ): Contract => {
  if (!prefix) {
    return contract;
  }
  return Object.fromEntries(
    Object.entries(contract)
      .map(([key, value]) => {
        const newValue = typeof value === 'string'
          ? prefixVariable(value, prefix)
          : prefixContract(value, prefix);
        return [key, newValue];
      }),
  ) as any;
};
