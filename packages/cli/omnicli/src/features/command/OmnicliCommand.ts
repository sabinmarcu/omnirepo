import { Command } from 'clipanion';
import type {
  PartialOmniCliContext,
} from '../context';
import type {
  ReadonlyPaths,
} from '../paths';

export abstract class OmnicliCommand<
  Context extends PartialOmniCliContext = PartialOmniCliContext,
> extends Command<Context> {
  static readonlyPaths: ReadonlyPaths;

  static get paths() {
    return this.readonlyPaths as Array<Array<string>>;
  }
}
