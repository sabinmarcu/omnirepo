import { compileFixtures } from '@sabinmarcu/utils-test';

export type WorkspaceResolverFixture = {
  setup: Record<string, any>,
  input: string,
} & (
  | {
    paths: string[],
    names: string[],
    map: Record<string, string>,
  }
  | { error: string }
);
export default () => compileFixtures<WorkspaceResolverFixture>(
  new URL('.', import.meta.url),
  ['index.ts'],
);
