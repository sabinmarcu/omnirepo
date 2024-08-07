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
    ...observables as any[],
    (...values) => {
      for (const value of values.reverse()) {
        if (value !== undefined) {
          return value;
        }
      }
      return (values as any[])[0];
    },
  );
  return result as any;
};
