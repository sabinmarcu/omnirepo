import { coverageExcludes } from './jest.options.mjs';
import packageJson from './package.json' assert { type: 'json' };

const files = packageJson.workspaces.flatMap(
  (workspace) => [
    `${workspace}/src/**/!(*.spec).{ts,tsx,yml,yaml,js,json,cjs,mjs,jsx,mts,cts}`,
    `${workspace}/package.json`,
    `${workspace}/tsconfig.json`,
  ],
);

const tests = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.type).spec.{ts,tsx}`,
);

const filesWithNoCoverageCalculated = coverageExcludes.map(
  (it) => it.replace('!<rootDir>/', ''),
);

export default () => ({
  name: 'omniRepo',
  files,
  tests,
  autoDetect: ['jest'],
  filesWithNoCoverageCalculated,
  runAllTestsWhenNoAffectedTests: true,
  runAllTestsInAffectedTestFile: true,
  testFramework: {
    config: './jest.config.mjs',
  },
});
