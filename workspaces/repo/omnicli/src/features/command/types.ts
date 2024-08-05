import type { OmnicliCommand } from './OmnicliCommand';

export type CommandType = typeof OmnicliCommand<any>;
export type SubcommandType = typeof OmnicliCommand<any>;
