import rule, { ruleConfig } from './overflow.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Overflow Rule', () => {
  runDirectionalRulesTests('overflowRule', rule, ruleConfig);
});