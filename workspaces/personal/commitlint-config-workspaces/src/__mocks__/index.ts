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

const config = () => compileFixtures<WorkspacesFixture>(
  new URL('.', import.meta.url),
  ['index.ts'],
);

export default config;
