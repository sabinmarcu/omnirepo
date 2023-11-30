import * as R from 'ramda';
import type {
  DebugChannels,
  DebugRule,
} from './types';
import { debugChannels } from './constants';
import { globalWarnFunction } from './printers';

const validCharacters = /^[*9@A-Z_a-z-]*$/;

class InvalidDebugStringError extends Error {
  constructor(reason: string) {
    super(`Invalid or empty debug string! (${reason})`);
  }
}

const validateChannel = (channel: string): channel is DebugChannels => (
  debugChannels.includes(channel as any)
);

export const parseDebugStringFragment = (
  input: string,
  rethrow = false,
): DebugRule | undefined => {
  try {
    if (input === '') {
      throw new InvalidDebugStringError('Input empty');
    }
    let stringToProcess = input.trim();
    let channel;
    let namespace;
    let enabled = true;
    if (stringToProcess.at(0) === '-') {
      stringToProcess = stringToProcess.slice(1);
      enabled = false;
    }
    const channelIndex = stringToProcess.lastIndexOf('#');
    if (channelIndex >= 0) {
      channel = stringToProcess.slice(Math.max(0, channelIndex + 1));
      if (channel === '') {
        throw new InvalidDebugStringError('Channel Empty');
      }
      if (!validCharacters.test(channel)) {
        throw new InvalidDebugStringError('Channel contains invalid characters');
      }
      if (!validateChannel(channel)) {
        throw new InvalidDebugStringError('Channel invalid');
      }
      stringToProcess = stringToProcess.slice(0, Math.max(0, channelIndex));
    }
    const namespaceIndex = stringToProcess.indexOf(':');
    if (namespaceIndex >= 0) {
      namespace = stringToProcess.slice(0, Math.max(0, namespaceIndex));
      if (namespace === '') {
        throw new InvalidDebugStringError('Namespace empty');
      }
      if (!validCharacters.test(namespace)) {
        throw new InvalidDebugStringError('Namespace contains invalid characters');
      }
      stringToProcess = stringToProcess.slice(Math.max(0, namespaceIndex + 1));
    }
    if (stringToProcess === '' && namespace && namespace !== '') {
      throw new InvalidDebugStringError('Has namespace but no path');
    }
    if (!validCharacters.test(stringToProcess)) {
      throw new InvalidDebugStringError('Path contains invalid characters');
    }
    return {
      path: stringToProcess === '' ? undefined : stringToProcess,
      namespace,
      channel,
      enabled,
    };
  } catch (error) {
    if (error instanceof InvalidDebugStringError) {
      if (rethrow) {
        throw error;
      } else {
        globalWarnFunction.value?.(error.message);
      }
      return undefined;
    }
    throw error;
  }
};

export const parseDebugString = (input: string | undefined) => {
  if (!input) {
    return undefined;
  }
  const fragments = R.map(
    (fragment) => fragment.trim(),
    R.split(',', input),
  );
  return R.filter(
    (fragment) => fragment !== undefined,
    R.map(parseDebugStringFragment, fragments),
  ) as DebugRule[];
};
