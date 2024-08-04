import { compileFixtures } from '@sabinmarcu/utils-test';

export interface WorkspacesRootResolverFixtures {
  setup: Record<string, string>,
  input: string,
  output: boolean,
}

const fixtures = () => compileFixtures<WorkspacesRootResolverFixtures>(
  new URL('.', import.meta.url),
  ['index.ts'],
);

export default fixtures;
