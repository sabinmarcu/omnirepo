import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import yaml from 'yaml';
import { createRequire } from 'node:module';

export type FixtureBase = { name: string };
export type Fixture<T> = FixtureBase & T;

const jsParser = <T extends unknown>(
  rootPath: string,
  filePath: string,
): T => {
  const parser = createRequire(rootPath)(filePath);
  if (parser.default) {
    return parser.default;
  }
  return parser;
};
const jsonParser = <T extends unknown>(
  rootPath: string,
  filePath: string,
): T => yaml.parse(fs.readFileSync(filePath, 'utf8'));

const getParsers = <T extends unknown>() => ({
  '.js': jsParser<T>,
  '.mjs': jsParser<T>,
  '.cjs': jsParser<T>,
  '.ts': jsParser<T>,
  '.mts': jsParser<T>,
  '.cts': jsParser<T>,
  '.jsx': jsParser<T>,
  '.tsx': jsParser<T>,
  '.yml': jsonParser<T>,
  '.yaml': jsonParser<T>,
  '.json': jsonParser<T>,
});

/**
 * Generate an array of fixtures with a given time.
 * Fixtures are extracted from .m?[j|t]sx? files (.js, .ts, .jsx, .tsx)
 * @param {string} cwd The path from which to load files and generate fixtures
 * @param {string[]} excludes Optional array of file names to exclude
 * @returns {T[]} Array of fixtures
 */
export const compileFixtures = <T extends unknown>(
  inputCwd: string | URL,
  excludes: (string | RegExp)[] = [],
): Fixture<T>[] => {
  const cwd = (inputCwd instanceof URL)
    ? url.fileURLToPath(inputCwd)
    : inputCwd;
  if (!fs.existsSync(cwd)) {
    throw new Error(`cwd ${cwd} does not exist`);
  }
  if (!fs.statSync(cwd).isDirectory()) {
    throw new Error(`cwd ${cwd} is not a directory`);
  }
  const parse = getParsers<T>();
  const supportedExtensions = Object.keys(parse);
  const files = fs.readdirSync(cwd)
    .filter((it) => supportedExtensions.some((extension) => it.endsWith(extension)))
    .filter(((it) => !excludes.some((excl) => it.match(excl))));
  if (!files) {
    throw new Error(`cwd ${cwd} is empty`);
  }
  const fixtures = files.map(
    (it) => {
      const parser = parse[
        supportedExtensions.find((extension) => it.endsWith(extension)) as keyof typeof parse
      ];
      const fixture = parser(cwd, path.resolve(cwd, it));
      const name = ((fixture as any)?.name as string | undefined)
        ? ((fixture as any).name as string | undefined)
        : it.replace(/\.[^.]+$/, '').replaceAll(/[.-]/g, ' ');
      return {
        ...(fixture as any),
        name,
      };
    },
  );
  return fixtures;
};
