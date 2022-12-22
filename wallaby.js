const pkg = require('./package.json');

const files = pkg.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.spec).{ts,tsx}`,
);

const tests = pkg.workspaces.map(
  (workspace) => `${workspace}/src/**/!(*.type).spec.{ts,tsx}`,
);

module.exports = () => ({
  files,
  tests,
  autoDetect: true,
});
