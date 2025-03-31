// @ts-check

const bypassSwcProjects = [
  'commitlint-config-workspaces',
].join('|');

const swcTransformString = String.raw`^((?!${bypassSwcProjects}).)*\.(m|c)?(j|t)sx?$`;
const tsJestTransformString = String.raw`^.*(${bypassSwcProjects}).*\.(m|c)?(j|t)sx?$`;

/** @type {import('jest').Config} */
const config = {
  testRegex: String.raw`^(?!.*?type).*(\.(test|spec))\.(m|c)?tsx?$`,
  transform: {
    [swcTransformString]: '@swc/jest',
    [tsJestTransformString]: [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        useESM: true,
      }
    ]
  },
  moduleNameMapper: {
    // No idea why this is needed
    [String.raw`^\.\/std__path\/(.*)$`]: "./std__path/$1",

    // Proper maps
    [String.raw`^(\.\.?\/.+)\.js(x)?$`]: "$1",
    [String.raw`^(\.\.?\/.+)\.(m|c)js$`]: "$1.$2ts",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!@sabinmarcu\/*)`
  ],
  extensionsToTreatAsEsm: ['.ts', '.cts', '.mts', '.tsx'],
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
