import moize from 'moize';

const fix = (returnValue) => returnValue;

const memo = fix;

const functionKeys = Object.keys(moize)
  .filter((key) => typeof moize[key] === 'function');

for (const key of functionKeys) {
  memo[key] = fix;
}

export default () => memo;
