// @ts-check

import path from 'node:path';
import fs from 'node:fs';
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

const workDirectory = process.cwd();

const packageJsonPath = path.join(workDirectory, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
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
  // eslint-disable-next-line no-console, unicorn/no-null
  console.dir(fixedPackageJson, { depth: null });
} else {
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(fixedPackageJson, undefined, 2),
    'utf8',
  );
}
