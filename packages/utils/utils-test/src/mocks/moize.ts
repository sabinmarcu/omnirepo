import type { Moize } from 'moize';

const fix = (returnValue: any) => returnValue;

export const mockMoize = (moize: Moize) => {
  const memo = fix;

  const functionKeys = Object.keys(moize)
    .filter((key) => typeof (moize as any)[key] === 'function');

  for (const key of functionKeys) {
    (memo as any)[key] = fix;
  }

  return memo;
};
