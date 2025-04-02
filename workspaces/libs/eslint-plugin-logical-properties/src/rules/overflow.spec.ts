import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './overflow.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Overflow Rule', () => {
  runDirectionalRulesTests('overflowRule', rule, ruleConfig);
});
