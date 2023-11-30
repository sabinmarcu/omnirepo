import type { Subject } from '@sabinmarcu/observable';
import {
  subject,
} from '@sabinmarcu/observable';
import { config } from '@sabinmarcu/config';
import {
  defaultChannel,
} from './constants';
import { parseDebugStringFragment } from './parsers';
import type {
  DebugDefinitionFromDebugInput,
  DebugDefinitionFromString,
  DebugFactory,
  DebugFunction,
  DebugOptions,
  FormatterOptions,
} from './types';
import { globalFormatter } from './formatting';
import { globalPrintFunctions } from './printers';
import { debugDefinitionEnabled } from './enabled';

export const debugDefinitionFromString = <T extends string>(input: T) => {
  const parsed = parseDebugStringFragment(input, true);
  const { path, namespace, channel = defaultChannel } = parsed!;
  if (path === undefined) {
    throw new Error('Invalid debug definition string (requires a name)');
  }
  return {
    path,
    namespace,
    channel,
  } as DebugDefinitionFromString<T>;
};

export const debugDefinitionFromInput: DebugDefinitionFromDebugInput = (
  definition: any,
) => (
  typeof definition === 'string'
    ? debugDefinitionFromString(definition)
    : definition
);

export const getOverrideForSubject = <T extends any>(
  defaultSubject: Subject<T>,
  optionalInput?: T,
) => {
  const ownSubject = subject<T>(optionalInput);
  const output = config(defaultSubject, ownSubject);
  return [
    output,
    ownSubject.next,
  ] as const;
};

export const debug: DebugFactory = (
  definition: any,
  options: DebugOptions = {},
) => {
  const template = debugDefinitionFromInput(definition);
  const enabled = debugDefinitionEnabled(template as any);

  const [formatter, setFormatter] = getOverrideForSubject(globalFormatter, options.formatter);
  const boundFormatter = formatter.map((it) => it?.(template as any));
  const [printFunction, setPrintFunction] = getOverrideForSubject(
    globalPrintFunctions[template.channel],
    options.printFunction,
  );

  const debugFunctionRaw = (...parameters: any[]) => {
    const formatterOptions = {
      columns: process?.stdout?.columns,
      tty: process?.stdout?.isTTY,
    } satisfies FormatterOptions;
    const finalArguments = boundFormatter.value?.(formatterOptions, ...parameters) ?? parameters;
    // eslint-disable-next-line no-console
    const printFunctionValue = printFunction.value ?? console.log;
    printFunctionValue(...finalArguments);
  };

  const debugFunction = (...parameters: any[]) => {
    if (enabled.value) {
      debugFunctionRaw(...parameters);
    }
    return undefined;
  };

  debugFunction.setFormatter = setFormatter;
  debugFunction.setPrintFunction = setPrintFunction;

  return debugFunction satisfies DebugFunction;
};
