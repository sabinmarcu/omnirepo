import type {
  Asyncify,
} from 'type-fest';

export type AsyncifyArray<
  Input extends any[],
> = {
  [Key in keyof Input]: (
    Input[Key] extends (...arguments_: any) => any
      ? Asyncify<Input[Key]>
      : Input[Key]
  )
};

export type AsyncifyParameters<
  FunctionType extends (...arguments_: any[]) => any,
  FunctionTypeArguments = AsyncifyArray<Parameters<FunctionType>>,
> = FunctionTypeArguments extends any[]
  ? FunctionTypeArguments
  : [];

export interface PathOperationSet<
  FunctionType extends (...arguments_: any[]) => any,
  FunctionTypeArguments extends any[] = AsyncifyParameters<FunctionType>,
  AsyncFunctionType = (...arguments_: FunctionTypeArguments) => Promise<ReturnType<FunctionType>>,
> {
  sync: FunctionType,
  async: AsyncFunctionType
}

export interface PathResolver<T = string> extends PathOperationSet<
  (path: string) => T
> {}
export type PathResolverFunction<T = string> = PathResolver<T>['sync'];
export type PathResolverFunctionAsync<T = string> = PathResolver<T>['async'];

export interface PathPredicate extends PathOperationSet<
  (path: string) => boolean
> {}
export type PathPredicateFunction = PathPredicate['sync'];
export type PathPredicateFunctionAsync = PathPredicate['async'];

export interface PathWalkerProcessFunction<T> {
  (path: string): T
}
export interface PathWalkerOverload<T = string> {
  (
    path: string,
    predicate: PathPredicateFunction,
  ): string;
  (
    path: string,
    predicate: PathPredicateFunction,
    process?: PathWalkerProcessFunction<T>,
  ): T
}
export interface PathWalker<T = string>
  extends PathOperationSet<PathWalkerOverload<T>> {}
export type PathWalkerFunction<T = string> = PathWalker<T>['sync'];
export type PathWalkerFunctionAsync<T = string> = PathWalker<T>['async'];
