import { compileFixtures } from '@sabinmarcu/utils-test';
import type { PathWalkerFunction } from '../../types';

export type WalkFsFixture = {
  setup: Record<string, any>,
  input: Parameters<PathWalkerFunction>,
} & (
  | { output: ReturnType<PathWalkerFunction> }
  | { error: string }
);

export default () => compileFixtures<WalkFsFixture>(
  new URL('.', import.meta.url),
  ['index.ts'],
);
