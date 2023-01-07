import type { Simplify } from 'type-fest';
import type {
  AsyncifyArray,
  PathPredicate,
  PathResolver,
  PathWalker,
} from './types';

type _AsyncifyArrayTest1 = AsyncifyArray<[string, number, boolean]>;
//    ^? type _AsyncifyArrayTest1 = [string, number, boolean]

type _AsyncifyArrayTest2 = AsyncifyArray<[string, () => void, boolean]>;
//    ^? type _AsyncifyArrayTest2 = [string, () => Promise<void>, boolean]

type _AsyncifyArrayTest3 = AsyncifyArray<[(input: string) => boolean, () => void, boolean]>;
//    ^? type _AsyncifyArrayTest3 = [(input: string) => Promise<boolean>, () => Promise<void>, boolean]

type _PathResolverKeys = Simplify<keyof PathResolver>;
//    ^? type _PathResolverKeys = "sync" | "async"

type _PathResolverSync = PathResolver['sync'];
//    ^? type _PathResolverSync = (path: string) => string

type _PathResolverAsync = PathResolver['async'];
//    ^? type _PathResolverAsync = (path: string) => Promise<string>

type _PathPredicateKeys = Simplify<keyof PathPredicate>;
//    ^? type _PathPredicateKeys = "sync" | "async"

type _PathPredicateSync = PathPredicate['sync'];
//    ^? type _PathPredicateSync = (path: string) => boolean

type _PathPredicateAsync = PathPredicate['async'];
//    ^? type _PathPredicateAsync = (path: string) => Promise<boolean>

type _PathWalkerKeys = Simplify<keyof PathWalker>;
//    ^? type _PathWalkerKeys = "sync" | "async"

type _PathWalkerSync = PathWalker['sync'];
//    ^? type _PathWalkerSync = PathWalkerOverload<string>

type _PathWalkerAsync = PathWalker['async'];
//    ^? type _PathWalkerAsync = (path: string, predicate: (path: string) => Promise<boolean>, process?: PathWalkerProcessFunction<string> | undefined) => Promise<string>
