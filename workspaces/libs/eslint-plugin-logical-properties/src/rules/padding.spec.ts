import type { RuleTester } from 'eslint';
import rule, { ruleConfig } from './padding.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';
import { generateDirectionalShorthandError } from '../parsers/directionalShorthand.js';
import { runEslintTests } from '../utils/runEslintTests.js';

describe('Padding Rule', () => {
  runDirectionalRulesTests('paddingRule', rule, ruleConfig);
  const tests = [
    (() => {
      const [a, b, c, d] = [
        // eslint-disable-next-line no-template-curly-in-string
        '${a + 1}', '${b + 2}', '${c + 3}', '${d + 4}',

      ] as const;
      const source = `\`${a} ${b} ${c} ${d}\``;
      const results = [
        `"paddingBlockStart":\`${a}\``,
        `"paddingInlineEnd":\`${b}\``,
        `"paddingBlockEnd":\`${c}\``,
        `"paddingInlineStart":\`${d}\``,
      ];
      const test = {
        code: `style({padding: ${source}})`,
        errors: [{
          message: generateDirectionalShorthandError(
            `padding: ${source}`,
            results,
          ),
        }],
        output: `style({${results.join(',')}})`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase;
      return test;
    })(),
    (() => {
      const [a, b] = [
        // eslint-disable-next-line no-template-curly-in-string
        '${a + 1}', '${b + 2}',

      ] as const;
      const source = `\`${a} ${b}\``;
      const results = [
        `"paddingBlockStart":\`${a}\``,
        `"paddingBlockEnd":\`${a}\``,
        `"paddingInlineStart":\`${b}\``,
        `"paddingInlineEnd":\`${b}\``,
      ];
      const test = {
        code: `style({padding: ${source}})`,
        errors: [{
          message: generateDirectionalShorthandError(
            `padding: ${source}`,
            results,
          ),
        }],
        output: `style({${results.join(',')}})`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase;
      return test;
    })(),
    (() => {
      const [a, b, c] = [
        // eslint-disable-next-line no-template-curly-in-string
        '${a + 1}', '${b + 2}', '${c + 3}',

      ] as const;
      const source = `\`${a} ${c} ${b}\``;
      const results = [
        `"paddingBlockStart":\`${a}\``,
        `"paddingInlineStart":\`${c}\``,
        `"paddingInlineEnd":\`${c}\``,
        `"paddingBlockEnd":\`${b}\``,
      ];
      const test = {
        code: `style({padding: ${source}})`,
        errors: [{
          message: generateDirectionalShorthandError(
            `padding: ${source}`,
            results,
          ),
        }],
        output: `style({${results.join(',')}})`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase;
      return test;
    })(),
    (() => {
      const [a, b] = [
        'calc(a + 1)', 'calc(b + 2)',
      ] as const;
      const source = `\`${a} ${b}\``;
      const results = [
        `"paddingBlockStart":\`${a}\``,
        `"paddingBlockEnd":\`${a}\``,
        `"paddingInlineStart":\`${b}\``,
        `"paddingInlineEnd":\`${b}\``,
      ];
      const test = {
        code: `style({padding: ${source}})`,
        errors: [{
          message: generateDirectionalShorthandError(
            `padding: ${source}`,
            results,
          ),
        }],
        output: `style({${results.join(',')}})`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase;
      return test;
    })(),
    (() => {
      const [a, b] = [
        'calc(a + 1)', 'calc(b + var(c) / 3)',
      ] as const;
      const source = `\`${a} ${b}\``;
      const results = [
        `"paddingBlockStart":\`${a}\``,
        `"paddingBlockEnd":\`${a}\``,
        `"paddingInlineStart":\`${b}\``,
        `"paddingInlineEnd":\`${b}\``,
      ];
      const test = {
        code: `style({padding: ${source}})`,
        errors: [{
          message: generateDirectionalShorthandError(
            `padding: ${source}`,
            results,
          ),
        }],
        output: `style({${results.join(',')}})`,
        options: [{}],
      } satisfies RuleTester.InvalidTestCase;
      return test;
    })(),
  ];
  runEslintTests(
    'manual padding template strings',
    rule,
    { invalid: tests },
  );
});
