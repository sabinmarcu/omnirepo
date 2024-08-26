import rule, { ruleConfig } from './padding.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';
import { RuleTester } from 'eslint';
import { generateDirectionalShorthandError } from '../parsers/directionalShorthand.js';
import { runEslintTests } from '../utils/runEslintTests.js';

describe('Padding Rule', () => {
  runDirectionalRulesTests('paddingRule', rule, ruleConfig);
  const [a, b, c, d] = [
    '${a + 1}', '${b + 2}', '${c + 3}', '${d + 4}'

  ] as const;
  const tests = [
    (() => {
      const source = `\`${a} ${b} ${c} ${d}\``
      const results = [
        `paddingBlockStart: \`${a}\``,
        `paddingInlineEnd: \`${b}\``,
        `paddingBlockEnd: \`${c}\``,
        `paddingInlineStart: \`${d}\``,
      ];
      const test = {
        code: `style({ padding: ${source} })`,
        errors: [{ message: generateDirectionalShorthandError(
          `padding: ${source}`,
          results,
        )}],
        output: `style({ ${results.join(", ")} })`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase
      return test;
    })(),
    (() => {
      const source = `\`${a} ${b}\``
      const results = [
        `paddingBlockStart: \`${a}\``,
        `paddingBlockEnd: \`${a}\``,
        `paddingInlineStart: \`${b}\``,
        `paddingInlineEnd: \`${b}\``,
      ];
      const test = {
        code: `style({ padding: ${source} })`,
        errors: [{ message: generateDirectionalShorthandError(
          `padding: ${source}`,
          results,
        )}],
        output: `style({ ${results.join(", ")} })`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase
      return test;
    })(),
  ]
  runEslintTests(
    'manual padding template strings', 
    rule, 
    { invalid: tests }
  );
});
