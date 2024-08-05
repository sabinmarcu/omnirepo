import { compileFixtures } from '@sabinmarcu/utils-test';

export interface WorkspacesRootPredicateFixtures {
  setup: Record<string, string>,
  input: string,
  output: boolean,
}

const fixtures = () => compileFixtures<WorkspacesRootPredicateFixtures>(
  new URL('.', import.meta.url),
  ['index.ts'],
);

export default fixtures;
