import type { OmnicliCommand } from './OmnicliCommand.js';

export type CommandType = typeof OmnicliCommand<any>;
export type SubcommandType = typeof OmnicliCommand<any>;
