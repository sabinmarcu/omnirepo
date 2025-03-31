import rule, { ruleConfig } from './overscrollBehavior.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Overscroll Behavior Rule', () => {
  runDirectionalRulesTests('overscrollBehavior', rule, ruleConfig);
});
