import {
  describe,
} from 'vitest';
import type { RuleTester } from 'eslint';
import rule from './inset.js';
import { runEslintTests } from '../utils/runEslintTests.js';
import { generateDirectionalPropertyError } from '../parsers/directionalMapping.js';

describe('Inset Rule Settings Precedence', () => {
  runEslintTests('inset settings precedence', rule, {
    valid: [
      {
        code: 'style({ left: 0 })',
        settings: {
          'logical-properties': {
            functions: ['customStyle'],
          },
        },
      },
      {
        code: 'customStyle({ left: 0 })',
        settings: {
          'logical-properties': {
            functions: ['customStyle'],
          },
        },
        options: [{
          functions: ['style'],
        }],
      },
    ] satisfies RuleTester.ValidTestCase[],
    invalid: [
      {
        code: 'customStyle({ left: 0 })',
        settings: {
          'logical-properties': {
            functions: ['customStyle'],
          },
        },
        errors: [
          {
            message: generateDirectionalPropertyError('left', 'insetInlineStart'),
          },
        ],
        output: 'customStyle({ "insetInlineStart":0 })',
      },
      {
        code: 'style({ left: 0 })',
        settings: {
          'logical-properties': {
            functions: ['customStyle'],
          },
        },
        options: [{
          functions: ['style'],
        }],
        errors: [
          {
            message: generateDirectionalPropertyError('left', 'insetInlineStart'),
          },
        ],
        output: 'style({ "insetInlineStart":0 })',
      },
    ] satisfies RuleTester.InvalidTestCase[],
  });
});
