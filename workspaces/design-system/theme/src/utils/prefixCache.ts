import type {
  createGlobalTheme,
  createGlobalThemeContract,
} from '@vanilla-extract/css';
import { prefixContract } from './prefixContract.js';
import { prefixContractValues } from './prefixContractValues.js';

export const prefixCache = <
  const Contract extends ReturnType<typeof createGlobalThemeContract>,
>(
    contract: Contract,
  ) => {
  const cache: Record<string, Contract> = {};
  return (prefix?: string) => {
    if (!prefix) {
      return contract;
    }
    if (!cache[prefix]) {
      cache[prefix] = prefixContract(contract, prefix);
    }
    return cache[prefix];
  };
};

export const prefixValueCache = <
  const Values extends Parameters<typeof createGlobalTheme>[2],
>(
    values: Values,
  ) => {
  const cache: Record<string, Values> = {};
  return (prefix?: string) => {
    if (!prefix) {
      return values;
    }
    if (!cache[prefix]) {
      cache[prefix] = prefixContractValues(values, prefix);
    }
    return cache[prefix];
  };
};
