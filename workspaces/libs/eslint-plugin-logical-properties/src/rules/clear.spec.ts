import rule, { ruleConfig } from './clear.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Clear Rule', () => {
  runDirectionalRulesTests('clear', rule, ruleConfig);
});
