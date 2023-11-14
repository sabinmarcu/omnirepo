import { config } from '@sabinmarcu/config';
import {
  subject,
  observableSet,
} from '@sabinmarcu/observable';
import { env as environment } from './environment';

export const debugSubject = subject<string>();
export const enabledStrings = observableSet<string>();
export const disabledStrings = observableSet<string>();

export const debugString = config(
  environment.DEBUG,
  debugSubject,
);
