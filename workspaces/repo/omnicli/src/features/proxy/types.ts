import type { SubcommandType } from '../command/index.js';
import type { PrimaryPathsOfCommand } from '../paths/types.js';

export type SubcommandsList = Readonly<Array<SubcommandType>>;
export type IKVSubcommandsList = { paths: string, item: any };

export type KVSubcommandsList<
  List extends Readonly<SubcommandsList>,
> = {
  [key in keyof List]: {
    item: List[key],
    paths: PrimaryPathsOfCommand<List[key]>,
  }
}[number];

export type FindKV<
  List extends Readonly<SubcommandsList>,
  Which extends string,
> = {
  [key in keyof List]: Which extends PrimaryPathsOfCommand<List[key]>
    ? PrimaryPathsOfCommand<List[key]>
    : never
}[number];

export type MapOfSubcommandsList<
  List extends Readonly<SubcommandsList>,
  KV extends IKVSubcommandsList = KVSubcommandsList<List>,
> = { [key in KV['paths']]: Extract<KV, { paths: FindKV<List, key> }>['item'] };
