// @ts-check

/** @type {import('jest').Config} */
const config = {
  testRegex: '^(?!.*?type).*(\\.(test|spec))\\.tsx?$',
  transform: {
    '^.+\\.(m|c)?(t|j)sx?$': '@swc/jest',
  },
  moduleFileExtensions: [
    'js',
    'cjs',
    'mjs',
    'jsx',
    'ts',
    'cts',
    'mts',
    'tsx',
    'json',
    'node',
    'json',
    'yml',
    'yaml',
  ],
};

export {
  config,
};
