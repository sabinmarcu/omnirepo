import type {
  Rule,
  RuleTester,
} from 'eslint';
import {
  run,
} from 'eslint-vitest-rule-tester';
import type { TestInput } from '../types.js';

const trimTestInput = <
  T extends RuleTester.ValidTestCase | RuleTester.InvalidTestCase,
>(input: T[]): T[] => input.map((entry) => {
  const result = { ...entry } as T;

  if ('code' in result && typeof result.code === 'string') {
    result.code = result.code.trim();
  }
  if ('output' in result && typeof result.output === 'string') {
    result.output = result.output.trim();
  }

  return result;
});

export const runEslintTests = (
  testName: string,
  rule: Rule.RuleModule,
  {
    valid = [],
    invalid = [],
  }: TestInput,
) => {
  const validTestCases = trimTestInput(valid) as unknown as Array<string | { code: string }>;
  const invalidTestCases = trimTestInput(invalid) as unknown as Array<string | { code: string }>;

  run({
    name: testName,
    rule,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    valid: validTestCases,
    invalid: invalidTestCases,
  });
};
