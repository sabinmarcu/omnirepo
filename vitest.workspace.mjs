import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import glob from 'glob';

// eslint-disable-next-line import/extensions
import { defineWorkspace } from 'vitest/config';
import { promisify } from 'node:util';

const manifest = JSON.parse(
  fs.readFileSync(
    new URL('package.json', import.meta.url),
  ),
);

const globPromisified = promisify(glob)
const rootPath = fileURLToPath(new URL('.', import.meta.url));
const workspaces = [];
for (const workspaceGlob of manifest.workspaces) {
  const manifestGlob = `${workspaceGlob}/package.json`;
  const matches = await globPromisified(
    manifestGlob,
    {
      cwd: rootPath,
      ignore: 'node_modules/**',
    },
  );
  const workspaceDirectories = matches.map(
    (match) => path.dirname(match),
  );
  workspaces.push(...workspaceDirectories);
}

export default defineWorkspace(workspaces);

