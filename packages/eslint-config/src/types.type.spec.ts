import type {
  Config,
} from './types.js';

type Test = Config;
//    ^? type Test = Linter.Config<Linter.RulesRecord, Linter.RulesRecord>
