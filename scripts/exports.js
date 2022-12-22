// @ts-check

import path from 'node:path';
import fs from 'node:fs/promises';
import minimist from 'minimist';

const {
  dev,
  'dry-run': dryRun,
} = minimist(
  process.argv.slice(2),
  {
    boolean: true,
    alias: {
      dev: 'd',
    },
  },
);

const workDir = process.cwd();

const packageJsonPath = path.join(workDir, 'package.json');
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
const extensionsMapping = dev
  ? {
    cjs: '.ts',
    esm: '.ts',
  } : {
    cjs: '.cjs',
    esm: '.mjs',
  };

const pathWithExtension = (
  /** @type string */
  inputPath,
  /** @type keyof typeof extensionsMapping */
  type,
) => (
  `${inputPath}${extensionsMapping[type]}`
);

const fixedPackageJson = {
  ...packageJson,
  main: pathWithExtension('./cjs/index', 'cjs'),
  module: pathWithExtension('./esm/index', 'esm'),
  exports: {
    '.': {
      require: pathWithExtension('./cjs/index', 'cjs'),
      import: pathWithExtension('./esm/index', 'esm'),
    },
    './*': {
      require: pathWithExtension('./cjs/*', 'cjs'),
      import: pathWithExtension('./esm/*', 'esm'),
    },
  },
};

if (dryRun) {
  // eslint-disable-next-line no-console
  console.dir(fixedPackageJson, { depth: null });
} else {
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(fixedPackageJson, undefined, 2),
    'utf-8',
  );
}
