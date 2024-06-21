import rule, { ruleConfig } from './size.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Size Rule', () => {
  runDirectionalRulesTests('size', rule, ruleConfig);
});