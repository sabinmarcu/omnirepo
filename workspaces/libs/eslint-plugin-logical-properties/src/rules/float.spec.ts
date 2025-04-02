import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './float.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Float Rule', () => {
  runDirectionalRulesTests('float', rule, ruleConfig);
});
