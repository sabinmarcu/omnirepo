const packageJson = require('./package.json');

const files = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.spec).{ts,tsx}`,
);

const tests = packageJson.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.type).spec.{ts,tsx}`,
);

module.exports = () => ({
  files,
  tests,
  autoDetect: true,
});
