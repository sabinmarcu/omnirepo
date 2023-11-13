import type {
  Observable,
  TypeOfObservableOrType,
} from '@sabinmarcu/observable';
import type {
  UnionToIntersection,
  IsKnown,
  TypeError,
} from '@sabinmarcu/types';

export type ConfigMapParameter = Readonly<Record<string, any>>;
export type ConfigListParameters = Readonly<unknown[]>;
export type ConfigParameters = ConfigMapParameter | ConfigListParameters;

export type ObservableOf<T extends any> = T extends Observable<any>
  ? T
  : Observable<T>;

export type MapConfigMapParameterKeyToObservable<
  T extends ConfigMapParameter,
  Key extends keyof T,
> = T[Key] extends Observable<infer Value>
  ? Observable<{ [key in Key]: Value }>
  : Observable<{ [key in Key]: T[Key] }>;

export type MapConfigMapParameterToObservables<T extends ConfigMapParameter> = {
  [Key in keyof T]: MapConfigMapParameterKeyToObservable<T, Key>
}[keyof T][];

export type MapConfigMapParameterToValues<T extends ConfigMapParameter> = {
  [Key in keyof T]: T[Key] extends Observable<infer Result>
    ? Result
    : T[Key]
};

export type TypeOfConfigParameters<T extends ConfigParameters> =
  T extends ConfigListParameters
    ? TypeOfObservableOrType<T[number]>
    : never;

export type ConfigListParametersCommonType<T extends ConfigListParameters> =
  | UnionToIntersection<TypeOfConfigParameters<T>>;

export type ConsistentConfigParameters<
  T extends ConfigParameters,
> = T extends ConfigListParameters
  ? IsKnown<ConfigListParametersCommonType<T>>
  : true;

export type CheckParametersConsistencyOrError<T extends ConfigParameters> =
  ConsistentConfigParameters<T> extends false
    ? TypeError<'Config input is not consistent'>
    : T;

export type ConfigObservablesFromParameters<Parameters extends ConfigParameters> = {
  [Key in keyof Parameters]: Parameters[Key] extends Observable<any>
    ? Parameters[Key]
    : Observable<Parameters[Key]>
};

export type ConfigResult<T extends ConfigParameters> =
  ConsistentConfigParameters<T> extends false
    ? TypeError<'Config result cannot be derived from inconsistent input'>
    : T extends ConfigListParameters
      ? ConfigListParametersCommonType<T>
      : MapConfigMapParameterToValues<T>;

export interface ComplexConfigFunction {
  <const T extends ConfigMapParameter>(
    input: T
  ): Observable<ConfigResult<T>>
}

export interface SimpleConfigFunction {
  <
    const T extends ConfigListParameters,
    Result = ConfigResult<T>,
  >(
    ...inputs: T
  ): Result extends TypeError ? Result : Observable<Result>;
}

export interface ConfigFunction extends SimpleConfigFunction, ComplexConfigFunction {}
