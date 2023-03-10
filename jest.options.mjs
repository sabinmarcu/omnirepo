import packageJson from './package.json' assert { type: "json" };

export const projects = packageJson.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/jest.config.{js,cjs,mjs}`,
);

export const coverageCollection = packageJson.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/src/**/!(index|*type*).{ts,tsx}`,
);

export const coverageExcludes = [
  '!<rootDir>/packages/utils/utils-test/**/*',
  '!<rootDir>/packages/config/eslint-config/src/configs/**/*',
  '!<rootDir>/packages/cli/omnicli/src/commands/**/*',
  '!<rootDir>/packages/cli/omnicli/src/cli.ts',
  '!<rootDir>/packages/cli/omnicli/src/features/context/context.ts',
  '!<rootDir>/packages/cli/omnicli/src/features/command/OmnicliCommand.ts',
  '!<rootDir>/**/index.ts',
  '!<rootDir>/**/types.ts',
  '!<rootDir>/**/constants.ts',
  '!<rootDir>/**/*.d.ts',
  '!<rootDir>/**/__mocks__/**/*',
];
