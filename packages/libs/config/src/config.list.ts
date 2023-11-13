import type { Observable } from '@sabinmarcu/observable';
import {
  isObservable,
  observable,
} from '@sabinmarcu/observable';
import type {
  ConfigListParameters,
  TypeOfConfigParameters,
  SimpleConfigFunction,
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
  return outputs as TypeOfConfigParameters<Parameters>;
};

export const simpleConfig: SimpleConfigFunction = (
  ...input
) => {
  const observables = projectListInput(...input);
  const result = observable.project<[any], any>(
    (...values) => {
      for (const value in values.reverse()) {
        if (value !== undefined) {
          return value;
        }
      }
      return values[0];
    },
    observables,
  );
  return result as any;
};
