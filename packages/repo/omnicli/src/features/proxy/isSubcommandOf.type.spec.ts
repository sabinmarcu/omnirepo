import { isSubcommandOf } from './isSubcommandOf';
import { testSubcommands } from '../__mocks__/list';

const isValidSubcommand = isSubcommandOf(testSubcommands);

const isValidSubcommandTest1 = isValidSubcommand('test1');
type isValidSubcommandTest1Type = typeof isValidSubcommandTest1;
//    ^? type isValidSubcommandTest1Type = boolean

const isValidSubcommandTest2 = isValidSubcommand('test3');
type isValidSubcommandTest2Type = typeof isValidSubcommandTest1;
//    ^? type isValidSubcommandTest2Type = boolean

const isValidSubcommandTest3 = isValidSubcommand('test4');
type isValidSubcommandTest3Type = typeof isValidSubcommandTest1;
//    ^? type isValidSubcommandTest3Type = boolean
