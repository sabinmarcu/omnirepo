import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './borderRadius.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Border Radius Rule', () => {
  runDirectionalRulesTests('borderRadiusRule', rule, ruleConfig);
});
