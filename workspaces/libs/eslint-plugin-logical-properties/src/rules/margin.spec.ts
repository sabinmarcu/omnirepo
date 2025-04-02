import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './margin.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Margin Rule', () => {
  runDirectionalRulesTests('marginRule', rule, ruleConfig);
});
