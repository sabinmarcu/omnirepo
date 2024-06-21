import rule, {
  mappings,
  disabled,
} from './margin';
import { runDirectionalRulesTests } from '../utils/directional';

describe('Margin Rule', () => {
  runDirectionalRulesTests('marginRule', mappings, rule, disabled);
});
