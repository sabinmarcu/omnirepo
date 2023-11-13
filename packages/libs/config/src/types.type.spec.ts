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
  ConfigMapParameter,
  ConfigListParameters,
} from './types';

type TestConfigParameters = ConfigParameters;
//    ^? type TestConfigParameters = Readonly<Record<string, any>> | readonly unknown[]

const testConfigParametersMap = {
  first: 21,
  second: 25,
  third: observable.from(35),
  fourth: observable<number>(() => {}),
  fifth: 42,
} as const satisfies ConfigParameters;

{ testConfigParametersMap; }
//           ^? const testConfigParametersMap: {
//                  readonly first: 21;
//                  readonly second: 25;
//                  readonly third: Observable<35>;
//                  readonly fourth: Observable<number>;
//                  readonly fifth: 42;
//              }

const testConfigParametersList = [
  21,
  25,
  observable.from(35),
  observable<number>(() => {}),
  42,
] as const satisfies ConfigParameters;

{ testConfigParametersList; }
//           ^? const testConfigParametersList: readonly [21, 25, Observable<35>, Observable<number>, 42]

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
//           readonly second: Observable<42>;
//           readonly third: 35;
//       }

const testConfigParametersExactNumberList = ([
  41,
  observable.from(42),
  35,
]) as const satisfies ConfigParameters;

{ testConfigParametersExactNumberList; }
//    ^? const testConfigParametersExactNumberList: readonly [41, Observable<42>, 35]

const testConfigParametersExactStringMap = ({
  first: 'awesome',
  second: observable.from('stuff'),
}) as const satisfies ConfigParameters;

{ testConfigParametersExactStringMap; }
//    ^? const testConfigParametersExactStringMap: {
//           readonly first: "awesome";
//           readonly second: Observable<"stuff">;
//       }
const testConfigParametersExactStringList = ([
  'awesome',
  observable.from('stuff'),
]) as const satisfies ConfigParameters;

{ testConfigParametersExactStringList; }
//    ^? const testConfigParametersExactStringList: readonly ["awesome", Observable<"stuff">]

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
//           readonly first: Observable<21>;
//           readonly second: Observable<25>;
//           readonly third: Observable<35>;
//           readonly fourth: Observable<number>;
//           readonly fifth: Observable<...>;
//       }

type TestConfigObservablesFromParametersList = ConfigObservablesFromParameters<typeof testConfigParametersList>;
//    ^? type TestConfigObservablesFromParametersList = readonly [Observable<21>, Observable<25>, Observable<35>, Observable<number>, Observable<42>]

type TestTypeOfConfigParametersRawMap = TypeOfConfigParameters<typeof testConfigParametersMap>;
//    ^? type TestTypeOfConfigParametersRawMap = never

type TestTypeOfConfigParametersRawList = TypeOfConfigParameters<typeof testConfigParametersList>;
//    ^? type TestTypeOfConfigParametersRawList = 21 | 25 | Observable<35> | Observable<number> | 42

type TestTypeOfConfigParametersRawFailMap = TypeOfConfigParameters<typeof testConfigParametersFailMap>;
//    ^? type TestTypeOfConfigParametersRawFailMap = never

type TestTypeOfConfigParametersRawFailList = TypeOfConfigParameters<typeof testConfigParametersFailList>;
//    ^? type TestTypeOfConfigParametersRawFailList = 41 | "stuff"

type TestTypeOfConfigParametersRawExactNumberMap = TypeOfConfigParameters<typeof testConfigParametersExactNumberMap>;
//    ^? type TestTypeOfConfigParametersRawExactNumberMap = never

type TestTypeOfConfigParametersRawExactNumberList = TypeOfConfigParameters<typeof testConfigParametersExactNumberList>;
//    ^? type TestTypeOfConfigParametersRawExactNumberList = 35 | 41 | Observable<42>

type TestTypeOfConfigParametersRawExactStringMap = TypeOfConfigParameters<typeof testConfigParametersExactStringMap>;
//    ^? type TestTypeOfConfigParametersRawExactStringMap = never

type TestTypeOfConfigParametersRawExactStringList = TypeOfConfigParameters<typeof testConfigParametersExactStringList>;
//    ^? type TestTypeOfConfigParametersRawExactStringList = "awesome" | Observable<"stuff">

type TestTypeOfConfigParametersUnknownObserverMap = TypeOfConfigParameters<UnknownObserverTestMap>;
//      ^? type TestTypeOfConfigParametersUnknownObserverMap = never

type TestTypeOfConfigParametersUnknownObserverList = TypeOfConfigParameters<UnknownObserverTestList>;
//      ^? type TestTypeOfConfigParametersUnknownObserverList = 21 | Observable<number> | 42 | Observable<unknown> | 22

// --------------------------------------------------------------------------------------

type TestConfigListParametersCommonTypeList = ConfigListParametersCommonType<typeof testConfigParametersList>;
//    ^? type TestConfigListParametersCommonTypeList = never

type TestConfigListParametersCommonTypeFailList = ConfigListParametersCommonType<typeof testConfigParametersFailList>;
//    ^? type TestConfigListParametersCommonTypeFailList = never

type TestConfigListParametersCommonTypeExactNumberList = ConfigListParametersCommonType<typeof testConfigParametersExactNumberList>;
//    ^? type TestConfigListParametersCommonTypeExactNumberList = never

type TestConfigListParametersCommonTypeExactStringList = ConfigListParametersCommonType<typeof testConfigParametersExactStringList>;
//    ^? type TestConfigListParametersCommonTypeExactStringList = "awesome" & RawObservable<"stuff"> & {
//           readonly value: "stuff";
//           filter: ObservableFilter<"stuff">;
//           map: ObservableMap<"stuff">;
//       }

type TestConfigListParametersCommonTypeUnknownObserverList = ConfigListParametersCommonType<UnknownObserverTestList>;
//    ^? type TestConfigListParametersCommonTypeUnknownObserverList = never

// --------------------------------------------------------------------------------------

type TestConsistentConfigParametersMap = ConsistentConfigParameters<typeof testConfigParametersMap>;
//    ^? type TestConsistentConfigParametersMap = unknown

type TestConsistentConfigParametersList = ConsistentConfigParameters<typeof testConfigParametersList>;
//    ^? type TestConsistentConfigParametersList = never

type TestConsistentConfigParametersFailMap = ConsistentConfigParameters<typeof testConfigParametersFailMap>;
//    ^? type TestConsistentConfigParametersFailMap = unknown

type TestConsistentConfigParametersFailList = ConsistentConfigParameters<typeof testConfigParametersFailList>;
//    ^? type TestConsistentConfigParametersFailList = never

type TestConsistentConfigParametersExactNumberMap = ConsistentConfigParameters<typeof testConfigParametersExactNumberMap>;
//    ^? type TestConsistentConfigParametersExactNumberMap = unknown

type TestConsistentConfigParametersExactNumberList = ConsistentConfigParameters<typeof testConfigParametersExactNumberList>;
//    ^? type TestConsistentConfigParametersExactNumberList = never

type TestConsistentConfigParametersExactStringMap = ConsistentConfigParameters<typeof testConfigParametersExactStringMap>;
//    ^? type TestConsistentConfigParametersExactStringMap = unknown

type TestConsistentConfigParametersExactStringList = ConsistentConfigParameters<typeof testConfigParametersExactStringList>;
//    ^? type TestConsistentConfigParametersExactStringList = unknown

type TestConsistentConfigParametersUnknownObserverMap = ConsistentConfigParameters<UnknownObserverTestMap>;
//    ^? type TestConsistentConfigParametersUnknownObserverMap = unknown

type TestConsistentConfigParametersUnknownObserverList = ConsistentConfigParameters<UnknownObserverTestList>;
//    ^? type TestConsistentConfigParametersUnknownObserverList = never

// --------------------------------------------------------------------------------------

type TestCheckParametersConsistencyOrErrorMap = CheckParametersConsistencyOrError<typeof testConfigParametersMap>;
//    ^? type TestCheckParametersConsistencyOrErrorMap = {
//           readonly first: 21;
//           readonly second: 25;
//           readonly third: Observable<35>;
//           readonly fourth: Observable<number>;
//           readonly fifth: 42;
//       }

type TestCheckParametersConsistencyOrErrorList = CheckParametersConsistencyOrError<typeof testConfigParametersList >;
//    ^? type TestCheckParametersConsistencyOrErrorList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

type TestCheckParametersConsistencyOrErrorFailMap = CheckParametersConsistencyOrError<typeof testConfigParametersFailMap>;
//    ^? type TestCheckParametersConsistencyOrErrorFailMap = {
//           readonly first: 41;
//           readonly second: "stuff";
//       }

type TestCheckParametersConsistencyOrErrorFailList = CheckParametersConsistencyOrError<typeof testConfigParametersFailList>;
//    ^? type TestCheckParametersConsistencyOrErrorFailList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

type TestCheckParametersConsistencyOrErrorExactNumberMap = CheckParametersConsistencyOrError<typeof testConfigParametersExactNumberMap>;
//    ^? type TestCheckParametersConsistencyOrErrorExactNumberMap = {
//           readonly first: 41;
//           readonly second: Observable<42>;
//           readonly third: 35;
//       }

type TestCheckParametersConsistencyOrErrorExactNumberList = CheckParametersConsistencyOrError<typeof testConfigParametersExactNumberList>;
//    ^? type TestCheckParametersConsistencyOrErrorExactNumberList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

type TestCheckParametersConsistencyOrErrorExactStringMap = CheckParametersConsistencyOrError<typeof testConfigParametersExactStringMap>;
//    ^? type TestCheckParametersConsistencyOrErrorExactStringMap = {
//           readonly first: "awesome";
//           readonly second: Observable<"stuff">;
//       }

type TestCheckParametersConsistencyOrErrorExactStringList = CheckParametersConsistencyOrError<typeof testConfigParametersExactStringList>;
//    ^? type TestCheckParametersConsistencyOrErrorExactStringList = readonly ["awesome", Observable<"stuff">]

type TestCheckParametersConsistencyOrErrorUnknownObserverMap = CheckParametersConsistencyOrError<UnknownObserverTestMap>;
//    ^? type TestCheckParametersConsistencyOrErrorUnknownObserverMap = {
//           first: 21;
//           second: 42;
//           third: Observable<number>;
//           fourth: Observable<unknown>;
//           fifth: 22;
//       }

type TestCheckParametersConsistencyOrErrorUnknownObserverList = CheckParametersConsistencyOrError<UnknownObserverTestList>;
//    ^? type TestCheckParametersConsistencyOrErrorUnknownObserverList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

// --------------------------------------------------------------------------------------

type TestConfigResultMap = ConfigResult<typeof testConfigParametersMap>;
//    ^? type TestConfigResultMap = {
//           readonly first: 21;
//           readonly second: 25;
//           readonly third: 35;
//           readonly fourth: number;
//           readonly fifth: 42;
//       }

type TestConfigResultList = ConfigResult<typeof testConfigParametersList>;
//    ^? type TestConfigResultList = {
//           [__TypeError__]: "Config result cannot be derived from inconsistent input";
//       }

type TestConfigResultFailMap = ConfigResult<typeof testConfigParametersFailMap>;
//    ^? type TestConfigResultFailMap = {
//           readonly first: 41;
//           readonly second: "stuff";
//       }

type TestConfigResultFailList = ConfigResult<typeof testConfigParametersFailList>;
//    ^? type TestConfigResultFailList = {
//           [__TypeError__]: "Config result cannot be derived from inconsistent input";
//       }

type TestConfigResultExactNumberMap = ConfigResult<typeof testConfigParametersExactNumberMap>;
//    ^? type TestConfigResultExactNumberMap = {
//           readonly first: 41;
//           readonly second: 42;
//           readonly third: 35;
//       }

type TestConfigResultExactNumberList = ConfigResult<typeof testConfigParametersExactNumberList>;
//    ^? type TestConfigResultExactNumberList = {
//           [__TypeError__]: "Config result cannot be derived from inconsistent input";
//       }

type TestConfigResultExactStringMap = ConfigResult<typeof testConfigParametersExactStringMap>;
//    ^? type TestConfigResultExactStringMap = {
//           readonly first: "awesome";
//           readonly second: "stuff";
//       }

type TestConfigResultExactStringList = ConfigResult<typeof testConfigParametersExactStringList>;
//    ^? type TestConfigResultExactStringList = "awesome" & RawObservable<"stuff"> & {
//           readonly value: "stuff";
//           filter: ObservableFilter<"stuff">;
//           map: ObservableMap<"stuff">;
//       }

type TestConfigResultUnknownObserverMap = ConfigResult<UnknownObserverTestMap>;
//    ^? type TestConfigResultUnknownObserverMap = {
//           first: 21;
//           second: 42;
//           third: number;
//           fourth: unknown;
//           fifth: 22;
//       }

type TestConfigResultUnknownObserverList = ConfigResult<UnknownObserverTestList>;
//    ^? type TestConfigResultUnknownObserverList = {
//           [__TypeError__]: "Config result cannot be derived from inconsistent input";
//       }

// --------------------------------------------------------------------------------------

declare const config: ConfigFunction;

// --------------------------------------------------------------------------------------

const testConfigMap = config(testConfigParametersMap);
//    ^? const testConfigMap: Observable<{
//           readonly first: 21;
//           readonly second: 25;
//           readonly third: Observable<35>;
//           readonly fourth: Observable<number>;
//           readonly fifth: 42;
//       }>

const testConfigList = config(testConfigParametersList);
//    ^? const testConfigList: Observable<readonly [21, 25, Observable<35>, Observable<number>, 42]>

const testConfigFailMap = config(testConfigParametersFailMap);
//    ^? const testConfigFailMap: Observable<{
//           readonly first: 41;
//           readonly second: "stuff";
//       }>

const testConfigFailList = config(testConfigParametersFailList);
//    ^? const testConfigFailList: Observable<readonly [41, "stuff"]>

const testConfigExactNumberMap = config(testConfigParametersExactNumberMap);
//    ^? const testConfigExactNumberMap: Observable<{
//           readonly first: 41;
//           readonly second: Observable<42>;
//           readonly third: 35;
//       }>

const testConfigExactNumberList = config(testConfigParametersExactNumberList);
//    ^? const testConfigExactNumberList: Observable<readonly [41, Observable<42>, 35]>

const testConfigExactStringMap = config(testConfigParametersExactStringMap);
//    ^? const testConfigExactStringMap: Observable<{
//           readonly first: "awesome";
//           readonly second: Observable<"stuff">;
//       }>

const testConfigExactStringList = config(testConfigParametersExactStringList);
//    ^? const testConfigExactStringList: Observable<readonly ["awesome", Observable<"stuff">]>

// TODO: Find a solution for this issue.
// Required: config('a', 'b') should turn input params into 'never' to cause
// typescript to not compile the code, and force the developer to better think about
// the code they are writing. So far, best one could do is return a TypeError type
// and hope the code crashes somewhere else. (ie: expecting a string, received TypeError)
const testConfigExactStringListHardcoded = config('something', 'else');
//    ^? const testConfigExactStringListHardcoded: TypeError<"Config result cannot be derived from inconsistent input">
