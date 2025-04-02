import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './size.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Size Rule', () => {
  runDirectionalRulesTests('size', rule, ruleConfig);
});
