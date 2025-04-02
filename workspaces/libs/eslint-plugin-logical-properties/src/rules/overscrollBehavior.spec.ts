import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './overscrollBehavior.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Overscroll Behavior Rule', () => {
  runDirectionalRulesTests('overscrollBehavior', rule, ruleConfig);
});
