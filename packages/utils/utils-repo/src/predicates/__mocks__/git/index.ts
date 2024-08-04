import { compileFixtures } from '@sabinmarcu/utils-test';

export interface GitPredicateFixtures {
  setup: Record<string, string>,
  input: string,
  output: boolean,
}

const config = () => compileFixtures<GitPredicateFixtures>(
  new URL('.', import.meta.url),
  ['index.ts'],
);

export default config;
