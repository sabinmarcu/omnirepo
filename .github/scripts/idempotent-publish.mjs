#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const publishCwd = process.env.INIT_CWD ?? process.cwd();

const result = spawnSync('yarn', ['npm', 'publish', '--tolerate-republish'], {
  cwd: publishCwd,
  env: process.env,
  encoding: 'utf8',
  stdio: 'pipe',
});

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.error) {
  throw result.error;
}

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
const duplicateRepublish = /previously published versions/i.test(output)
  || /cannot publish over/i.test(output)
  || /cannot modify pre-existing version/i.test(output);

if ((result.status ?? 1) !== 0 && duplicateRepublish) {
  process.stderr.write('Duplicate publish detected, continuing as success.\n');
  process.exit(0);
}

process.exit(result.status ?? 1);
