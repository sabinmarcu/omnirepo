import type { Observable } from '@sabinmarcu/observable';
import {
  isObservable,
  observable,
} from '@sabinmarcu/observable';
import type {
  ConfigListParameters,
  SimpleConfigFunction,
  ConfigObservablesFromParameters,
} from './types.js';

export const projectListInput = <
  const Parameters extends ConfigListParameters,
>(
  ...inputs: Parameters
) => {
  const outputs: Observable<any>[] = Array.from(
    inputs,
    (input) => (isObservable(input) ? input : observable.from(input)),
  );
  return outputs as ConfigObservablesFromParameters<Parameters>;
};

export const simpleConfig: SimpleConfigFunction = (
  ...input
) => {
  const observables = projectListInput(...input);
  const result = observable.project(
    ...observables as any[],
    (...values) => {
      // This package's lib target predates Array#toReversed.
      // eslint-disable-next-line unicorn/no-array-reverse
      for (const value of [...values].reverse()) {
        if (value !== undefined) {
          return value;
        }
      }
      return (values as any[])[0];
    },
  );
  return result as any;
};
