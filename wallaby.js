import packageJson from './package.json' assert { type: 'json' };

const files = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.spec).{ts,tsx,yml,yaml,js,json,cjs,mjs,jsx,mts,cts}`,
);

const tests = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.type).spec.{ts,tsx}`,
);

export default () => ({
  name: 'omniRepo',
  files,
  tests,
  autoDetect: true,
  filesWithNoCoverageCalculated: [
    'config/eslint-config/src/configs/**/*',
    'utils/utils-test/src/**/*',
    '**/index.ts',
    '**/types.ts',
    '**/constants.ts',
    '**/*.d.ts',
  ],
});
