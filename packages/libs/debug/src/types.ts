import type { TypeError } from '@sabinmarcu/types';
import type {
  Observable,
  Subject,
} from '@sabinmarcu/observable';
import type {
  debugChannels,
  defaultChannel,
} from './constants';

export type DebugRule = {
  path?: string;
  namespace?: string;
  channel?: string;
  enabled: boolean;
};

export type DebugChannels = typeof debugChannels[number];
export type DefaultChannel = typeof defaultChannel;

export type DebugDefinition<
  Path extends string = string,
  Namespace extends string = '',
  Channel extends DebugChannels = DefaultChannel,
> = {
  path: Path,
  namespace: Namespace,
  channel: Channel,
};

export type DebugDefinitionInput<
  Path extends string = string,
  Namespace extends string = '',
  Channel extends DebugChannels = DefaultChannel,
> = {
  readonly path: Path,
  readonly namespace?: Namespace,
  readonly channel?: Channel,
};

// TODO: move this to types package
export type NonEmptyString<T extends string> =
  T extends ''
    ? never
    : unknown;

export type DebugDefinitionFromString<T extends string> =
    T extends `${infer Namespace}:${infer Path}#${infer Channel}`
      ? Channel extends DebugChannels
        ? NonEmptyString<Path>
        & NonEmptyString<Namespace>
        & NonEmptyString<Channel>
        & DebugDefinition<Path, Namespace, Channel>
        : never
      : T extends `${infer Namespace}:${infer Path}`
        ?
        & NonEmptyString<Path>
        & NonEmptyString<Namespace>
        & DebugDefinition<Path, Namespace>
        : T extends `${infer Path}#${infer Channel}`
          ? Channel extends DebugChannels
            ? NonEmptyString<Path>
            & NonEmptyString<Channel>
            & DebugDefinition<Path, '', Channel>
            : never
          : T extends `${infer Path}`
            ?
            & NonEmptyString<Path>
            & DebugDefinition<Path>
            : never;

export type ValidDebugDefinitionString<T extends string> =
  DebugDefinitionFromString<T> extends never
    ? TypeError<'Invalid debug definition string!'>
    : T;

export type DebugOptions = {
  formatter?: Formatter,
  printFunction?: PrintFunction
};

export interface DebugDefinitionFromDebugInput {
  <
    const Path extends string = string,
    const Namespace extends string = '',
    const Channel extends DebugChannels = DefaultChannel,
  >(
    definition: DebugDefinitionInput<Path, Namespace, Channel>,
  ): DebugDefinition<Path, Namespace, Channel>;

  <const T extends string>(
    definition: T & ValidDebugDefinitionString<T>
  ): DebugDefinitionFromString<T>;
}

export interface DebugFactory {
  <
    const Path extends string = string,
    const Namespace extends string = '',
    const Channel extends DebugChannels = DefaultChannel,
  >(
    definition: DebugDefinitionInput<Path, Namespace, Channel>,
    options?: DebugOptions,
  ): DebugFunction;

  <T extends string>(
    definition: T & ValidDebugDefinitionString<T>,
    options?: DebugOptions,
  ): DebugFunction;
}

export type DebugFunction = PrintFunction & {
  setFormatter: Subject<Formatter>['next'],
  setPrintFunction: Subject<PrintFunction>['next'],
};

export type FormatterOptions = {
  columns?: number,
  color?: string,
  tty?: boolean,
};

export type FormatterFunction = (
  options: FormatterOptions,
  ...parameters: any[]
) => any[];

export type Formatter = (
  definition: DebugDefinition,
) => FormatterFunction;

export type PrintFunction = typeof console.log;
export type PrintFunctionMap = Record<DebugChannels, Observable<PrintFunction>>;
