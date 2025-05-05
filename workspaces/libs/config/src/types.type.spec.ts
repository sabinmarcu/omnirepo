import type { Observable } from '@sabinmarcu/observable';
import { observable } from '@sabinmarcu/observable';
import type {
  ConfigParameters,
  ConsistentConfigParameters,
  ConfigObservablesFromParameters,
  TypeOfConfigParameters,
  CheckParametersConsistencyOrError,
  ConfigResult,
  ConfigListParametersCommonType,
  ConfigFunction,
  MapConfigMapParameterToObservables,
} from './types.js';

type TestConfigParameters = ConfigParameters;
//    ^? type TestConfigParameters = Readonly<Record<string, any>> | readonly unknown[]

const testConfigParametersMap = {
  first: 21,
  fourth: observable<number>(() => {}),
} as const satisfies ConfigParameters;

{ testConfigParametersMap; }
//           ^? const testConfigParametersMap: {
//                  readonly first: 21;
//                  readonly fourth: any;
//              }

const testConfigParametersList = [
  21,
  observable<number>(() => {}),
] as const satisfies ConfigParameters;

{ testConfigParametersList; }
//           ^? const testConfigParametersList: readonly [21, any]

const testConfigParametersFailMap = ({
  first: 41,
  second: 'stuff',
}) as const;

{ testConfigParametersFailMap; }
//     ^? const testConfigParametersFailMap: {
//            readonly first: 41;
//            readonly second: "stuff";
//        }

const testConfigParametersFailList = ([
  41,
  'stuff',
]) as const;

{ testConfigParametersFailList; }
//     ^? const testConfigParametersFailList: readonly [41, "stuff"]

const testConfigParametersExactNumberMap = ({
  first: 41,
  second: observable.from(42),
  third: 35,
}) as const satisfies ConfigParameters;

{ testConfigParametersExactNumberMap; }
//    ^? const testConfigParametersExactNumberMap: {
//           readonly first: 41;
//           readonly second: any;
//           readonly third: 35;
//       }

const testConfigParametersExactNumberList = ([
  41,
  observable.from(42),
  35,
]) as const satisfies ConfigParameters;

{ testConfigParametersExactNumberList; }
//    ^? const testConfigParametersExactNumberList: readonly [41, any, 35]

const testConfigParametersExactStringMap = ({
  first: 'awesome',
  second: observable.from('stuff'),
}) as const satisfies ConfigParameters;

{ testConfigParametersExactStringMap; }
//    ^? const testConfigParametersExactStringMap: {
//           readonly first: "awesome";
//           readonly second: any;
//       }
const testConfigParametersExactStringList = ([
  'awesome',
  observable.from('stuff'),
]) as const satisfies ConfigParameters;

{ testConfigParametersExactStringList; }
//    ^? const testConfigParametersExactStringList: readonly ["awesome", any]

type UnknownObserverTestMap = {
  first: 21,
  second: 42,
  third: Observable<number>,
  fourth: Observable<unknown>,
  fifth: 22
};

type UnknownObserverTestList = [
  21,
  42,
  Observable<number>,
  Observable<unknown>,
  22,
];

type TestConfigObservablesFromParametersMap = ConfigObservablesFromParameters<typeof testConfigParametersMap>;
//    ^? type TestConfigObservablesFromParametersMap = {
//           readonly first: 21;
//           readonly fourth: any;
//       }

type TestConfigObservablesFromParametersList = ConfigObservablesFromParameters<typeof testConfigParametersList>;
//    ^? type TestConfigObservablesFromParametersList = any

type TestTypeOfConfigParametersRawMap = TypeOfConfigParameters<typeof testConfigParametersMap>;
//    ^? type TestTypeOfConfigParametersRawMap = never

type TestTypeOfConfigParametersRawList = TypeOfConfigParameters<typeof testConfigParametersList>;
//    ^? type TestTypeOfConfigParametersRawList = TypeOfObservableOrType<T[number]>

type TestTypeOfConfigParametersRawFailMap = TypeOfConfigParameters<typeof testConfigParametersFailMap>;
//    ^? type TestTypeOfConfigParametersRawFailMap = never

type TestTypeOfConfigParametersRawFailList = TypeOfConfigParameters<typeof testConfigParametersFailList>;
//    ^? type TestTypeOfConfigParametersRawFailList = TypeOfObservableOrType<T[number]>

type TestTypeOfConfigParametersRawExactNumberMap = TypeOfConfigParameters<typeof testConfigParametersExactNumberMap>;
//    ^? type TestTypeOfConfigParametersRawExactNumberMap = never

type TestTypeOfConfigParametersRawExactNumberList = TypeOfConfigParameters<typeof testConfigParametersExactNumberList>;
//    ^? type TestTypeOfConfigParametersRawExactNumberList = TypeOfObservableOrType<T[number]>

type TestTypeOfConfigParametersRawExactStringMap = TypeOfConfigParameters<typeof testConfigParametersExactStringMap>;
//    ^? type TestTypeOfConfigParametersRawExactStringMap = never

type TestTypeOfConfigParametersRawExactStringList = TypeOfConfigParameters<typeof testConfigParametersExactStringList>;
//    ^? type TestTypeOfConfigParametersRawExactStringList = TypeOfObservableOrType<T[number]>

type TestTypeOfConfigParametersUnknownObserverMap = TypeOfConfigParameters<UnknownObserverTestMap>;
//      ^? type TestTypeOfConfigParametersUnknownObserverMap = never

type TestTypeOfConfigParametersUnknownObserverList = TypeOfConfigParameters<UnknownObserverTestList>;
//      ^? type TestTypeOfConfigParametersUnknownObserverList = TypeOfObservableOrType<T[number]>

// --------------------------------------------------------------------------------------

type TestConfigListParametersCommonTypeList = ConfigListParametersCommonType<typeof testConfigParametersList>;
//    ^? type TestConfigListParametersCommonTypeList = any

type TestConfigListParametersCommonTypeFailList = ConfigListParametersCommonType<typeof testConfigParametersFailList>;
//    ^? type TestConfigListParametersCommonTypeFailList = any

type TestConfigListParametersCommonTypeExactNumberList = ConfigListParametersCommonType<typeof testConfigParametersExactNumberList>;
//    ^? type TestConfigListParametersCommonTypeExactNumberList = any

type TestConfigListParametersCommonTypeExactStringList = ConfigListParametersCommonType<typeof testConfigParametersExactStringList>;
//    ^? type TestConfigListParametersCommonTypeExactStringList = any

type TestConfigListParametersCommonTypeUnknownObserverList = ConfigListParametersCommonType<UnknownObserverTestList>;
//    ^? type TestConfigListParametersCommonTypeUnknownObserverList = any

// --------------------------------------------------------------------------------------

type TestConsistentConfigParametersMap = ConsistentConfigParameters<typeof testConfigParametersMap>;
//    ^? type TestConsistentConfigParametersMap = true

type TestConsistentConfigParametersList = ConsistentConfigParameters<typeof testConfigParametersList>;
//    ^? type TestConsistentConfigParametersList = IsKnown<UnionToIntersection<TypeOfConfigParameters<T>>>

type TestConsistentConfigParametersFailMap = ConsistentConfigParameters<typeof testConfigParametersFailMap>;
//    ^? type TestConsistentConfigParametersFailMap = true

type TestConsistentConfigParametersFailList = ConsistentConfigParameters<typeof testConfigParametersFailList>;
//    ^? type TestConsistentConfigParametersFailList = IsKnown<UnionToIntersection<TypeOfConfigParameters<T>>>

type TestConsistentConfigParametersExactNumberMap = ConsistentConfigParameters<typeof testConfigParametersExactNumberMap>;
//    ^? type TestConsistentConfigParametersExactNumberMap = true

type TestConsistentConfigParametersExactNumberList = ConsistentConfigParameters<typeof testConfigParametersExactNumberList>;
//    ^? type TestConsistentConfigParametersExactNumberList = IsKnown<UnionToIntersection<TypeOfConfigParameters<T>>>

type TestConsistentConfigParametersExactStringMap = ConsistentConfigParameters<typeof testConfigParametersExactStringMap>;
//    ^? type TestConsistentConfigParametersExactStringMap = true

type TestConsistentConfigParametersExactStringList = ConsistentConfigParameters<typeof testConfigParametersExactStringList>;
//    ^? type TestConsistentConfigParametersExactStringList = IsKnown<UnionToIntersection<TypeOfConfigParameters<T>>>

type TestConsistentConfigParametersUnknownObserverMap = ConsistentConfigParameters<UnknownObserverTestMap>;
//    ^? type TestConsistentConfigParametersUnknownObserverMap = true

type TestConsistentConfigParametersUnknownObserverList = ConsistentConfigParameters<UnknownObserverTestList>;
//    ^? type TestConsistentConfigParametersUnknownObserverList = IsKnown<UnionToIntersection<TypeOfConfigParameters<T>>>

// --------------------------------------------------------------------------------------

type TestCheckParametersConsistencyOrErrorMap = CheckParametersConsistencyOrError<typeof testConfigParametersMap>;
//    ^? type TestCheckParametersConsistencyOrErrorMap = {
//           readonly first: 21;
//           readonly fourth: any;
//       }

type TestCheckParametersConsistencyOrErrorList = CheckParametersConsistencyOrError<typeof testConfigParametersList >;
//    ^? type TestCheckParametersConsistencyOrErrorList = any

type TestCheckParametersConsistencyOrErrorFailMap = CheckParametersConsistencyOrError<typeof testConfigParametersFailMap>;
//    ^? type TestCheckParametersConsistencyOrErrorFailMap = {
//           readonly first: 41;
//           readonly second: "stuff";
//       }

type TestCheckParametersConsistencyOrErrorFailList = CheckParametersConsistencyOrError<typeof testConfigParametersFailList>;
//    ^? type TestCheckParametersConsistencyOrErrorFailList = any

type TestCheckParametersConsistencyOrErrorExactNumberMap = CheckParametersConsistencyOrError<typeof testConfigParametersExactNumberMap>;
//    ^? type TestCheckParametersConsistencyOrErrorExactNumberMap = {
//           readonly first: 41;
//           readonly second: any;
//           readonly third: 35;
//       }

type TestCheckParametersConsistencyOrErrorExactNumberList = CheckParametersConsistencyOrError<typeof testConfigParametersExactNumberList>;
//    ^? type TestCheckParametersConsistencyOrErrorExactNumberList = any

type TestCheckParametersConsistencyOrErrorExactStringMap = CheckParametersConsistencyOrError<typeof testConfigParametersExactStringMap>;
//    ^? type TestCheckParametersConsistencyOrErrorExactStringMap = {
//           readonly first: "awesome";
//           readonly second: any;
//       }

type TestCheckParametersConsistencyOrErrorExactStringList = CheckParametersConsistencyOrError<typeof testConfigParametersExactStringList>;
//    ^? type TestCheckParametersConsistencyOrErrorExactStringList = any

type TestCheckParametersConsistencyOrErrorUnknownObserverMap = CheckParametersConsistencyOrError<UnknownObserverTestMap>;
//    ^? type TestCheckParametersConsistencyOrErrorUnknownObserverMap = {
//           first: 21;
//           second: 42;
//           third: Observable<number>;
//           fourth: Observable<unknown>;
//           fifth: 22;
//       }

type TestCheckParametersConsistencyOrErrorUnknownObserverList = CheckParametersConsistencyOrError<UnknownObserverTestList>;
//    ^? type TestCheckParametersConsistencyOrErrorUnknownObserverList = any

// --------------------------------------------------------------------------------------

type TestConfigResultMap = ConfigResult<typeof testConfigParametersMap>;
//    ^? type TestConfigResultMap = {
//           readonly first: unknown;
//           readonly fourth: any;
//       }

type TestConfigResultList = ConfigResult<typeof testConfigParametersList>;
//    ^? type TestConfigResultList = any

type TestConfigResultFailMap = ConfigResult<typeof testConfigParametersFailMap>;
//    ^? type TestConfigResultFailMap = {
//           readonly first: unknown;
//           readonly second: unknown;
//       }

type TestConfigResultFailList = ConfigResult<typeof testConfigParametersFailList>;
//    ^? type TestConfigResultFailList = any

type TestConfigResultExactNumberMap = ConfigResult<typeof testConfigParametersExactNumberMap>;
//    ^? type TestConfigResultExactNumberMap = {
//           readonly first: unknown;
//           readonly second: any;
//           readonly third: unknown;
//       }

type TestConfigResultExactNumberList = ConfigResult<typeof testConfigParametersExactNumberList>;
//    ^? type TestConfigResultExactNumberList = any

type TestConfigResultExactStringMap = ConfigResult<typeof testConfigParametersExactStringMap>;
//    ^? type TestConfigResultExactStringMap = {
//           readonly first: unknown;
//           readonly second: any;
//       }

type TestConfigResultExactStringList = ConfigResult<typeof testConfigParametersExactStringList>;
//    ^? type TestConfigResultExactStringList = any

type TestConfigResultUnknownObserverMap = ConfigResult<UnknownObserverTestMap>;
//    ^? type TestConfigResultUnknownObserverMap = {
//           first: unknown;
//           second: unknown;
//           third: Observable<number>;
//           fourth: Observable<unknown>;
//           fifth: unknown;
//       }

type TestConfigResultUnknownObserverList = ConfigResult<UnknownObserverTestList>;
//    ^? type TestConfigResultUnknownObserverList = any

// --------------------------------------------------------------------------------------

declare const config: ConfigFunction;

// --------------------------------------------------------------------------------------

const testConfigMap = config(testConfigParametersMap);
//    ^? const testConfigMap: Observable<ConfigResult<T>>

const testConfigList = config(...testConfigParametersList);
//    ^? const testConfigList: any

const testConfigFailMap = config(testConfigParametersFailMap);
//    ^? const testConfigFailMap: Observable<ConfigResult<T>>

const testConfigFailList = config(...testConfigParametersFailList);
//    ^? const testConfigFailList: any

const testConfigExactNumberMap = config(testConfigParametersExactNumberMap);
//    ^? const testConfigExactNumberMap: Observable<ConfigResult<T>>

const testConfigExactNumberList = config(...testConfigParametersExactNumberList);
//    ^? const testConfigExactNumberList: any

const testConfigExactStringMap = config(testConfigParametersExactStringMap);
//    ^? const testConfigExactStringMap: Observable<ConfigResult<T>>

const testConfigExactStringList = config(...testConfigParametersExactStringList);
//    ^? const testConfigExactStringList: any

// TODO: Find a solution for this issue.
// Required: config('a', 'b') should turn input params into 'never' to cause
// typescript to not compile the code, and force the developer to split think about
// the code they are writing. So far, best one could do is return a TypeError type
// and hope the code crashes somewhere else. (ie: expecting a string, received TypeError)
const testConfigExactStringListHardcoded = config('something', 'else');
//    ^? const testConfigExactStringListHardcoded: any

const testConfigOneObject = config({ test: 21 });
//    ^? const testConfigOneObject: Observable<ConfigResult<T>>

// --------------------------------------------------------------------------------------

type TestMapConfigMapParameterToObservablesMap = MapConfigMapParameterToObservables<typeof testConfigParametersMap>;
//    ^? type TestMapConfigMapParameterToObservablesMap = any[]

type TestMapConfigMapParameterToObservablesFailMap = MapConfigMapParameterToObservables<typeof testConfigParametersFailMap>;
//    ^? type TestMapConfigMapParameterToObservablesFailMap = any[]

type TestMapConfigMapParameterToObservablesExactNumberMap = MapConfigMapParameterToObservables<typeof testConfigParametersExactNumberMap>;
//    ^? type TestMapConfigMapParameterToObservablesExactNumberMap = any[]

type TestMapConfigMapParameterToObservablesExactStringMap = MapConfigMapParameterToObservables<typeof testConfigParametersExactStringMap>;
//    ^? type TestMapConfigMapParameterToObservablesExactStringMap = any[]

type TestMapConfigMapParameterToObservablesUnknownObserverMap = MapConfigMapParameterToObservables<UnknownObserverTestMap>;
//    ^? type TestMapConfigMapParameterToObservablesUnknownObserverMap = any[]
