// @ts-check

/** @type {import('jest').Config} */
const config = {
  testRegex: '^(?!.*?type).*(\\.(test|spec))\\.tsx?$',
  transform: {
    '^.+\\.(m|c)?(t|j)sx?$': '@swc/jest',
  },
};

export {
  config,
};
