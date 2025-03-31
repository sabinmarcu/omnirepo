// @ts-check

import path from 'node:path';
import fs from 'node:fs';
import { promisify } from 'node:util';
import glob from 'glob';
import url from 'node:url';
import { config } from './jest.config.base.mjs';

const rootDirectory = url.fileURLToPath(
  new URL('../../', import.meta.url),
);

const configDirectory = url.fileURLToPath(
  new URL('.', import.meta.url),
);

const configRelativePath = path.relative(
  rootDirectory,
  configDirectory,
);

const globPromised = promisify(glob);

/**
 * Generate a list of setup files with given glob
 * @param {string} inputGlob Glob to be checked against
 * @returns Promise<string[]>
 */
const globSetupFiles = async (inputGlob) => {
  const rawFiles = await globPromised(
    inputGlob,
    { cwd: configDirectory },
  );
  return rawFiles.map((file) => path.join(
    '<rootDir>',
    configRelativePath,
    file,
  ));
};

const setupFiles = await globSetupFiles('setupFiles/**/*');
const setupFilesAfterEnv = await globSetupFiles('setupFilesAfterEnv/**/*');

const generateFromPath = (
  /** @type {string} */
  configPath,
  // eslint-disable-next-line max-len
  /** @type {(options: { relativePath: string, rootRelativePath: string }) => import('jest').Config} */
  extra,
) => {
  const relativePath = path.relative(
    rootDirectory,
    configPath,
  );

  const rootRelativePath = path.relative(
    configPath,
    rootDirectory,
  );

  const { name } = JSON.parse(
    fs.readFileSync(
      path.resolve(configPath, 'package.json'),
      'utf8',
    ),
  );

  /** @type {import('jest').Config} */
  const packageConfig = {
    ...config,
    setupFiles,
    setupFilesAfterEnv,
    roots: [
      `<rootDir>/${relativePath}`,
    ],
    modulePaths: [
      `<rootDir>/${relativePath}/src`,
    ],
    displayName: name,
    rootDir: rootRelativePath,
    ...(extra?.({
      rootRelativePath,
      relativePath,
    })),
  };

  return packageConfig;
};

export {
  generateFromPath,

};

export { config } from './jest.config.base.mjs';