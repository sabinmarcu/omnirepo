import rule, { ruleConfig } from './margin.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Margin Rule', () => {
  runDirectionalRulesTests('marginRule', rule, ruleConfig);
});
