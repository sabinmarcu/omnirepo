import { compileFixtures } from '@sabinmarcu/utils-test';

export type WorkspacesFixture = {
  setup: Record<string, any>,
  input: {
    path: string,
    withAliases: boolean,
    extraScopes?: string[],
  }
} & (
  | { error: string }
  | { scopes: string[] }
);

export default () => compileFixtures<WorkspacesFixture>(
  new URL('.', import.meta.url),
  ['index.ts'],
);
