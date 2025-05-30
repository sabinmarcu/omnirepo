import { afterEach } from 'vitest';
import {
  subject,
} from '@sabinmarcu/observable';
import { filter } from 'ramda';
import { env as environment } from './environment.js';
import type {
  DebugRule,
} from './types.js';
import { parseDebugString } from './parsers.js';

export const debugString = subject<string>(environment.DEBUG);

export const filterRawDebugRulesBy = (isEnabled: boolean) => (
  input: DebugRule[] | undefined,
) => (input
  ? filter(({ enabled }) => enabled === isEnabled, input)
  : undefined
);

export const debugRules = debugString.map(parseDebugString);

if (typeof afterEach === 'function') {
  afterEach(() => debugString.next(environment.DEBUG));
}
