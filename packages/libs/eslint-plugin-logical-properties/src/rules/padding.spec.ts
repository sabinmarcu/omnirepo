import rule, {
  mappings,
  disabled,
} from './padding';
import { runDirectionalRulesTests } from '../utils/directional';

describe('Padding Rule', () => {
  runDirectionalRulesTests('paddingRule', mappings, rule, disabled);
});
