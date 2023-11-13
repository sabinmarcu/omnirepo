import type {
  Observable,
} from '@sabinmarcu/observable';
import type {
  UnionToIntersection,
  IsKnown,
  TypeError,
  BoolToUnknownNever,
  IsUnknown,
} from '@sabinmarcu/types';

export type ConfigMapParameter = Readonly<Record<string, any>>;
export type ConfigListParameters<T = any> = Readonly<(T | Observable<T>)[]>;
export type ConfigParameters<T = any> = ConfigMapParameter | ConfigListParameters<T>;

export type MapConfigMapParameterToObservables<T extends ConfigMapParameter> = {
  [Key in keyof T]: T[Key] extends Observable<any>
    ? T
    : Observable<T[Key]>
};
export type MapConfigMapParameterToValues<T extends ConfigMapParameter> = {
  [Key in keyof T]: T[Key] extends Observable<infer Result>
    ? Result
    : T[Key]
};

export type TypeOfConfigParameters<T extends ConfigParameters<any>> =
  T extends ConfigListParameters<infer U>
    ? U
    : never;

export type ConfigListParametersCommonType<T extends ConfigListParameters<any>> =
  | UnionToIntersection<TypeOfConfigParameters<T>>;

export type ConsistentConfigParameters<
  T extends ConfigParameters<any>,
> = T extends ConfigListParameters
  ? BoolToUnknownNever<IsKnown<ConfigListParametersCommonType<T>>>
  : unknown;

export type CheckParametersConsistencyOrError<T extends ConfigParameters<any>> =
  IsUnknown<ConsistentConfigParameters<T>> extends false
    ? TypeError<'Config input is not consistent'>
    : unknown;

export type ConfigObservablesFromParameters<T, Parameters extends ConfigParameters<T>> = {
  [Key in keyof Parameters]: Parameters[Key] extends Observable<T>
    ? Parameters[Key]
    : Observable<Parameters[Key]>
};

export type ConfigResult<T extends ConfigParameters<any>> =
  IsUnknown<ConsistentConfigParameters<T>> extends false
    ? TypeError<'Config result cannot be derived from inconsistent input'>
    : T extends ConfigListParameters<any>
      ? ConfigListParametersCommonType<T>
      : MapConfigMapParameterToValues<T>;

export interface ConfigFunction {
  <const T extends ConfigMapParameter>(
    input: T
  ): Observable<ConfigResult<T> & {}>;
  <
    const T extends ConfigListParameters<any>,
    Result = ConfigResult<T>,
  >(
    ...inputs: T & ConsistentConfigParameters<T>
  ): Result extends TypeError ? Result : Observable<Result & {}>;
}
