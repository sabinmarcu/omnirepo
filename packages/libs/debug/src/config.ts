import { config } from '@sabinmarcu/config';
import {
  subject,
} from '@sabinmarcu/observable';
import * as R from 'ramda';
import { env as environment } from './environment';
import type {
  DebugRule,
  RawDebugRule,
} from './types';
import { parseDebugString } from './parsers';

export const debugSubject = subject<string>();

export const filterRawDebugRulesBy = (isEnabled: boolean) => (
  input: RawDebugRule[] | undefined,
) => (input
  ? R.filter(({ enabled }) => enabled === isEnabled, input)
  : undefined
);

export const mapRawDebugRuleToDebugRule = (
  input: RawDebugRule[] | undefined,
) => (input
  ? R.map(({ enabled, ...rest }) => rest satisfies DebugRule, input)
  : undefined
);

export const debugString = config(
  environment.DEBUG,
  debugSubject,
);

export const rawRules = debugString.map(parseDebugString);

export const enabledRules = rawRules
  .map(filterRawDebugRulesBy(true))
  .map(mapRawDebugRuleToDebugRule);

export const disabledRules = rawRules
  .map(filterRawDebugRulesBy(false))
  .map(mapRawDebugRuleToDebugRule);

if (typeof afterEach === 'function') {
  afterEach(() => debugSubject.next(undefined as any));
}
