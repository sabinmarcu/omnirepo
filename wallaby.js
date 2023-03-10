import { coverageExcludes } from './jest.options.mjs';
import packageJson from './package.json' assert { type: 'json' };

const files = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.spec).{ts,tsx,yml,yaml,js,json,cjs,mjs,jsx,mts,cts}`,
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
  autoDetect: true,
  filesWithNoCoverageCalculated,
});
