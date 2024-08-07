import { OmnicliCommand } from '../command/index.js';

export class Test1 extends OmnicliCommand {
  static readonlyPaths = [['test1']] as const;

  async execute() {
    console.log(this);
  }
}
