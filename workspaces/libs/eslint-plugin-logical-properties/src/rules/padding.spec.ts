import rule, { ruleConfig } from './padding.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Padding Rule', () => {
  runDirectionalRulesTests('paddingRule', rule, ruleConfig);
});
