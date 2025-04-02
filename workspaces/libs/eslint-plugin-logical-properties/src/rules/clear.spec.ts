import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './clear.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Clear Rule', () => {
  runDirectionalRulesTests('clear', rule, ruleConfig);
});
