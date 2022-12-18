import type {
  Asyncify,
} from 'type-fest';

export type AsyncifyArray<
  Input extends any[],
> = {
  [Key in keyof Input]: (
    Input[Key] extends (...args: any) => any
      ? Asyncify<Input[Key]>
      : Input[Key]
  )
};

export type AsyncifyParams<
  FnType extends (...args: any[]) => any,
  FnTypeArgs = AsyncifyArray<Parameters<FnType>>,
> = FnTypeArgs extends any[]
  ? FnTypeArgs
  : [];

export interface PathOperationSet<
  FnType extends (...args: any[]) => any,
  FnTypeArgs extends any[] = AsyncifyParams<FnType>,
  AsyncFnType = (...args: FnTypeArgs) => Promise<ReturnType<FnType>>,
> {
  sync: FnType,
  async: AsyncFnType
}

export interface PathResolver<T = string> extends PathOperationSet<
  (path: string) => T
> {}
export type PathResolverFn<T = string> = PathResolver<T>['sync'];
export type PathResolverFnAsync<T = string> = PathResolver<T>['async'];

export interface PathPredicate extends PathOperationSet<
  (path: string) => boolean
> {}
export type PathPredicateFn = PathPredicate['sync'];
export type PathPredicateFnAsync = PathPredicate['async'];

export interface PathWalkerProcessFunc<T> {
  (path: string): T
}
export interface PathWalkerOverload<T = string> {
  (
    path: string,
    predicate: PathPredicateFn,
  ): string;
  (
    path: string,
    predicate: PathPredicateFn,
    process?: PathWalkerProcessFunc<T>,
  ): T
}
export interface PathWalker<T = string>
  extends PathOperationSet<PathWalkerOverload<T>> {}
export type PathWalkerFn<T = string> = PathWalker<T>['sync'];
export type PathWalkerFnAsync<T = string> = PathWalker<T>['async'];
