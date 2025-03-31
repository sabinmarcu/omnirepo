import { Cli } from 'clipanion';
import path from 'node:path';
import { compileContext } from './features/index.js';
import { commands } from './commands/index.js';

// @ts-ignore
import manifest from '../package.json';

const {
  name,
  version,
} = manifest;

const [node, app, ...rest] = process.argv;

const cli = new Cli({
  binaryLabel: name,
  binaryName: `${path.basename(node)} ${path.basename(app)}`,
  binaryVersion: version,
});

for (const command of commands) {
  cli.register(command);
}

cli.runExit(rest, compileContext());
