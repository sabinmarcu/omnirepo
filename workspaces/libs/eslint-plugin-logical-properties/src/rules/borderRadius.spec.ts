import rule, { ruleConfig } from './borderRadius.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Border Radius Rule', () => {
  runDirectionalRulesTests('borderRadiusRule', rule, ruleConfig);
});
