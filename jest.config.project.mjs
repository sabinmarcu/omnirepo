// @ts-check

import path from 'path';
import fs from 'fs';
import { config } from './jest.config.base.mjs';

const rootDir = (await import('url')).fileURLToPath(
  new URL('.', import.meta.url),
);

const generateFromPath = (
  configPath,
) => {
  const relativePath = path.relative(
    rootDir,
    configPath,
  );

  const rootRelativePath = path.relative(
    configPath,
    rootDir,
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
  config,
};
