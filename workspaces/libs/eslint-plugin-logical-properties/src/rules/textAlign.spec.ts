import rule, { ruleConfig } from './textAlign.js';
import { runDirectionalRulesTests } from '../parsers/directional.js';

describe('Text Align Rule', () => {
  runDirectionalRulesTests('textAlign', rule, ruleConfig);
});
