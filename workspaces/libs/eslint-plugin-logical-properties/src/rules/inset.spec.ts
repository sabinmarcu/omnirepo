import rule, { ruleConfig } from './inset.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Inset Rule', () => {
  runDirectionalRulesTests('insetRule', rule, ruleConfig);
});
