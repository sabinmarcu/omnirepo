import type { Observable } from '@sabinmarcu/observable';
import {
  isObservable,
  observable,
} from '@sabinmarcu/observable';
import type {
  ComplexConfigFunction,
  ConfigMapParameter,
  MapConfigMapParameterKeyToObservable,
  MapConfigMapParameterToObservables,
  ObservableOf,
} from './types';

export const projectMapInputItem = <
  const Parameters extends ConfigMapParameter,
  const Key extends keyof Parameters,
>(
    inputs: Parameters,
    key: Key,
  ) => {
  const input = inputs[key];
  const inputObservable = (
    isObservable(input)
      ? input
      : observable.from(input) satisfies Observable<Parameters[Key]>
  ) as ObservableOf<Parameters[Key]>;
  return inputObservable.map(
    (value: any) => ({ [key]: value }),
  ) as MapConfigMapParameterKeyToObservable<Parameters, Key>;
};

export const projectMapInput = <
  const Parameters extends ConfigMapParameter,
>(
    inputs: Parameters,
  ) => {
  const outputs = Object
    .keys(inputs)
    .map((key) => projectMapInputItem(inputs, key));
  return outputs as MapConfigMapParameterToObservables<Parameters>;
};

export const complexConfig: ComplexConfigFunction = (
  input,
) => {
  const observables = projectMapInput(input);
  const result = observable.project(
    ...observables,
    (...values: any[]) => {
      let combinedValue = {};
      for (const value of values) {
        combinedValue = {
          ...combinedValue,
          ...value,
        };
      }
      return combinedValue;
    },
  );
  return result as any;
};
