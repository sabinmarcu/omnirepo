import {
  describe,
} from 'vitest';
import rule, { ruleConfig } from './inset.js';
import { runDirectionalRulesTests } from '../parsers/directional.utils.js';

describe('Inset Rule', () => {
  runDirectionalRulesTests('insetRule', rule, ruleConfig);
});
