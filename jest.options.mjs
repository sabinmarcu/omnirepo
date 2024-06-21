import glob from 'glob';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const packageJson = JSON.parse(
  await fs.readFile(new URL('package.json', import.meta.url), 'utf8'),
);

export const projects = packageJson.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/jest.config.{js,cjs,mjs}`,
);

export const coverageCollection = packageJson.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/src/**/!(index|*type*).{ts,tsx}`,
);

const rootPath = path.dirname(fileURLToPath(import.meta.url));
const projectConfigs = await Promise.all(
  packageJson.workspaces.flatMap(
    (workspace) => {
      const inputGlob = `${workspace}/jest.config.mjs`;
      return glob.sync(
        inputGlob,
        { cwd: rootPath },
      ).map(async (jestConfig) => [path.dirname(jestConfig).replace(/^(\.\/)?/, ''), await import(jestConfig)]);
    },
  ),
);

const coverageExcludesFromPackages = projectConfigs
  .flatMap(
    ([packagePath, projectConfig]) => projectConfig.coverageExcludes
      ?.map((exclude) => `!<rootDir>/${packagePath}/${exclude}`),
  )
  .filter(Boolean);

export const coverageExcludes = [
  ...coverageExcludesFromPackages,
  '!<rootDir>/**/index.ts',
  '!<rootDir>/**/types.ts',
  '!<rootDir>/**/constants.ts',
  '!<rootDir>/**/*.d.ts',
  '!<rootDir>/**/__mocks__/**/*',
  '!<rootDir>/**/*.spec.partial.*',
  '!<rootDir>/**/mock.*',
];
