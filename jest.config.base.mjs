// @ts-check

/** @type {import('jest').Config} */
const config = {
  testRegex: '^(?!.*?type).*(\\.(test|spec))\\.tsx?$',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};

export default config;
export {
  config,
};
