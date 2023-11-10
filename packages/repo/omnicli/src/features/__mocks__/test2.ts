import { OmnicliCommand } from '../command';

export class Test2 extends OmnicliCommand {
  static readonlyPaths = [['test2'], ['test3']] as const;

  async execute() {
    console.log(this);
  }
}
