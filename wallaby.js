import fs from 'node:fs/promises';
// eslint-disable-next-line import/extensions
import { coverageExcludes } from './jest.options.mjs';

const packageJson = JSON.parse(
  await fs.readFile(new URL('package.json', import.meta.url), 'utf8'),
);

const files = packageJson.workspaces.flatMap((workspace) => [
  `${workspace}/src/**/!(*.spec).{ts,tsx,yml,yaml,js,json,cjs,mjs,jsx,mts,cts}`,
  `${workspace}/package.json`,
  `${workspace}/tsconfig.json`,
]);

const tests = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.type).spec.{ts,tsx}`,
);

const filesWithNoCoverageCalculated = coverageExcludes.map((it) => it.replace('!<rootDir>/', ''));

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
  env: {
    params: {
      env: 'DEBUG=',
    },
  },
});
