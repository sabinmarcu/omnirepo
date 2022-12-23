import { compileFixtures } from '@sabinmarcu/utils-test';

export interface PackageJsonPredicateFixtures {
  setup: Record<string, string>,
  input: string,
  output: boolean,
}

export default () => compileFixtures<PackageJsonPredicateFixtures>(
  new URL('.', import.meta.url),
  ['index.ts'],
);
