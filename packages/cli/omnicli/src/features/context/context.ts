import { resolveRootSync } from '@sabinmarcu/utils-repo';
import type { BaseContext } from 'clipanion';
import type {
  ContextPartialCompiler,
  ContextWithCwd,
  ContextWithRootDirectory,
  OmniCliContext,
} from './types';

export const compileContextWithCwd = (() => ({
  cwd: process.cwd(),
})) satisfies ContextPartialCompiler<ContextWithCwd>;

export const compileContextWithRootDirectory = (() => ({
  rootDirectory: resolveRootSync(process.cwd()),
})) satisfies ContextPartialCompiler<ContextWithRootDirectory>;

export const compileOmniCliContext = (() => ({
  ...compileContextWithCwd(),
  ...compileContextWithRootDirectory(),
})) satisfies ContextPartialCompiler<OmniCliContext>;

export const compileBaseContext = (() => ({
  env: process.env,
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
  colorDepth: 255,
}) satisfies BaseContext);

export const compileContext = (() => ({
  ...compileOmniCliContext(),
  ...compileBaseContext(),
}) satisfies OmniCliContext);
