const fix = (returnValue) => returnValue;

export const mock = (moize) => {
  const memo = fix;

  const functionKeys = Object.keys(moize)
    .filter((key) => typeof moize[key] === 'function');

  for (const key of functionKeys) {
    memo[key] = fix;
  }

  return memo;
};
