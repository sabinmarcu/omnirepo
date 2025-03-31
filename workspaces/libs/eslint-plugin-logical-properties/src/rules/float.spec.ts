import rule, { ruleConfig } from './float.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Float Rule', () => {
  runDirectionalRulesTests('float', rule, ruleConfig);
});
