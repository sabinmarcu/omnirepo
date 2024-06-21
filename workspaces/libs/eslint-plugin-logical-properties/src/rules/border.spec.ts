import rule, { ruleConfig } from './border.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Border Rule', () => {
  runDirectionalRulesTests('borderRule', rule, ruleConfig);
});