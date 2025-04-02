import type { Rule } from 'eslint';
import {
  run,
} from 'eslint-vitest-rule-tester';
import type { TestInput } from '../types.js';

const trimTestInput = (input: any[]) => input.map(({
  code, output, ...rest
}) => {
  const result = { ...rest };
  if (code) {
    result.code = code.trim();
  }
  if (output) {
    result.output = output.trim();
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
  run({
    name: testName,
    rule,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    valid: trimTestInput(valid),
    invalid: trimTestInput(invalid),
  });
};
