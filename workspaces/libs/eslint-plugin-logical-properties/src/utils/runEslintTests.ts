import type { Rule } from 'eslint';
import {
  RuleTester,
} from 'eslint';
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
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });

  ruleTester.run(testName, rule, {
    valid: trimTestInput(valid),
    invalid: trimTestInput(invalid),
  });
};
