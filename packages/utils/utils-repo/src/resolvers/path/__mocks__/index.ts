import { compileFixtures } from '@sabinmarcu/utils-test';

export interface WorkspacesRootResolverFixtures {
  setup: Record<string, string>,
  input: string,
  output: boolean,
}

export default () => compileFixtures<WorkspacesRootResolverFixtures>(
  new URL('.', import.meta.url),
  ['index.ts'],
);
