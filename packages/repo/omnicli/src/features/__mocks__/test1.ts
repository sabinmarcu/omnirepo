import { OmnicliCommand } from '../command';

export class Test1 extends OmnicliCommand {
  static readonlyPaths = [['test1']] as const;

  async execute() {
    console.log(this);
  }
}
