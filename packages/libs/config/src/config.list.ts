import type { Observable } from '@sabinmarcu/observable';
import {
  isObservable,
  observable,
} from '@sabinmarcu/observable';
import type {
  ConfigListParameters,
  SimpleConfigFunction,
  ConfigObservablesFromParameters,
} from './types';

export const projectListInput = <
  const Parameters extends ConfigListParameters,
>(
  ...inputs: Parameters
) => {
  const outputs: Observable<any>[] = [];
  for (const input of inputs) {
    outputs.push(
      isObservable(input)
        ? input
        : observable.from(input),
    );
  }
  return outputs as ConfigObservablesFromParameters<Parameters>;
};

export const simpleConfig: SimpleConfigFunction = (
  ...input
) => {
  const observables = projectListInput(...input);
  const result = observable.project(
    (...values) => {
      for (const value of values.reverse()) {
        if (value !== undefined) {
          return value;
        }
      }
      return values[0];
    },
    ...observables,
  );
  return result as any;
};
