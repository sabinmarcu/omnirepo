import { OmnicliCommand } from '../command/index.js';

export class Test3 extends OmnicliCommand {
  static readonlyPaths = [
    ['test4'],
    [
      'test5',
      'test6',
    ],
  ] as const;

  async execute() {
    console.log(this);
  }
}
