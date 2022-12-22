// @ts-check

import path from 'node:path';
import fs from 'node:fs';
import util from 'node:util';
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

const globPromised = util.promisify(glob);
const setupFiles = (await globPromised(
  'setupFiles/**/*',
  { cwd: configDirectory },
)).map((file) => path.join(
  '<rootDir>',
  configRelativePath,
  file,
));

const generateFromPath = (
  configPath,
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
    roots: [
      `<rootDir>/${relativePath}`,
    ],
    modulePaths: [
      `<rootDir>/${relativePath}/src`,
    ],
    displayName: name,
    rootDir: rootRelativePath,
  };

  return packageConfig;
};

export {
  generateFromPath,

};

export { config } from './jest.config.base.mjs';
