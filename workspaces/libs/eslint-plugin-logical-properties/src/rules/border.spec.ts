import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './border.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Border Rule', () => {
  runDirectionalRulesTests('borderRule', rule, ruleConfig);
});
