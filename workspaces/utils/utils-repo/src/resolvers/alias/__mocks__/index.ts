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

const fixtures = () => compileFixtures<WorkspaceResolverFixture>(
  new URL('.', import.meta.url),
  ['index.ts'],
);

export default fixtures;
