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
//                  readonly fourth: Observable<number>;
//              }

const testConfigParametersList = [
  21,
  observable<number>(() => {}),
] as const satisfies ConfigParameters;

{ testConfigParametersList; }
//           ^? const testConfigParametersList: readonly [21, Observable<number>]

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
//           readonly fourth: Observable<number>;
//       }

type TestConfigObservablesFromParametersList = ConfigObservablesFromParameters<typeof testConfigParametersList>;
//    ^? type TestConfigObservablesFromParametersList = readonly [Observable<21>, Observable<number>]

type TestTypeOfConfigParametersRawMap = TypeOfConfigParameters<typeof testConfigParametersMap>;
//    ^? type TestTypeOfConfigParametersRawMap = never

type TestTypeOfConfigParametersRawList = TypeOfConfigParameters<typeof testConfigParametersList>;
//    ^? type TestTypeOfConfigParametersRawList = number

type TestTypeOfConfigParametersRawFailMap = TypeOfConfigParameters<typeof testConfigParametersFailMap>;
//    ^? type TestTypeOfConfigParametersRawFailMap = never

type TestTypeOfConfigParametersRawFailList = TypeOfConfigParameters<typeof testConfigParametersFailList>;
//    ^? type TestTypeOfConfigParametersRawFailList = 41 | "stuff"

type TestTypeOfConfigParametersRawExactNumberMap = TypeOfConfigParameters<typeof testConfigParametersExactNumberMap>;
//    ^? type TestTypeOfConfigParametersRawExactNumberMap = never

type TestTypeOfConfigParametersRawExactNumberList = TypeOfConfigParameters<typeof testConfigParametersExactNumberList>;
//    ^? type TestTypeOfConfigParametersRawExactNumberList = 41 | 42 | 35

type TestTypeOfConfigParametersRawExactStringMap = TypeOfConfigParameters<typeof testConfigParametersExactStringMap>;
//    ^? type TestTypeOfConfigParametersRawExactStringMap = never

type TestTypeOfConfigParametersRawExactStringList = TypeOfConfigParameters<typeof testConfigParametersExactStringList>;
//    ^? type TestTypeOfConfigParametersRawExactStringList = "stuff" | "awesome"

type TestTypeOfConfigParametersUnknownObserverMap = TypeOfConfigParameters<UnknownObserverTestMap>;
//      ^? type TestTypeOfConfigParametersUnknownObserverMap = never

type TestTypeOfConfigParametersUnknownObserverList = TypeOfConfigParameters<UnknownObserverTestList>;
//      ^? type TestTypeOfConfigParametersUnknownObserverList = unknown

// --------------------------------------------------------------------------------------

type TestConfigListParametersCommonTypeList = ConfigListParametersCommonType<typeof testConfigParametersList>;
//    ^? type TestConfigListParametersCommonTypeList = number

type TestConfigListParametersCommonTypeFailList = ConfigListParametersCommonType<typeof testConfigParametersFailList>;
//    ^? type TestConfigListParametersCommonTypeFailList = never

type TestConfigListParametersCommonTypeExactNumberList = ConfigListParametersCommonType<typeof testConfigParametersExactNumberList>;
//    ^? type TestConfigListParametersCommonTypeExactNumberList = never

type TestConfigListParametersCommonTypeExactStringList = ConfigListParametersCommonType<typeof testConfigParametersExactStringList>;
//    ^? type TestConfigListParametersCommonTypeExactStringList = never

type TestConfigListParametersCommonTypeUnknownObserverList = ConfigListParametersCommonType<UnknownObserverTestList>;
//    ^? type TestConfigListParametersCommonTypeUnknownObserverList = unknown

// --------------------------------------------------------------------------------------

type TestConsistentConfigParametersMap = ConsistentConfigParameters<typeof testConfigParametersMap>;
//    ^? type TestConsistentConfigParametersMap = true

type TestConsistentConfigParametersList = ConsistentConfigParameters<typeof testConfigParametersList>;
//    ^? type TestConsistentConfigParametersList = true

type TestConsistentConfigParametersFailMap = ConsistentConfigParameters<typeof testConfigParametersFailMap>;
//    ^? type TestConsistentConfigParametersFailMap = true

type TestConsistentConfigParametersFailList = ConsistentConfigParameters<typeof testConfigParametersFailList>;
//    ^? type TestConsistentConfigParametersFailList = false

type TestConsistentConfigParametersExactNumberMap = ConsistentConfigParameters<typeof testConfigParametersExactNumberMap>;
//    ^? type TestConsistentConfigParametersExactNumberMap = true

type TestConsistentConfigParametersExactNumberList = ConsistentConfigParameters<typeof testConfigParametersExactNumberList>;
//    ^? type TestConsistentConfigParametersExactNumberList = false

type TestConsistentConfigParametersExactStringMap = ConsistentConfigParameters<typeof testConfigParametersExactStringMap>;
//    ^? type TestConsistentConfigParametersExactStringMap = true

type TestConsistentConfigParametersExactStringList = ConsistentConfigParameters<typeof testConfigParametersExactStringList>;
//    ^? type TestConsistentConfigParametersExactStringList = false

type TestConsistentConfigParametersUnknownObserverMap = ConsistentConfigParameters<UnknownObserverTestMap>;
//    ^? type TestConsistentConfigParametersUnknownObserverMap = true

type TestConsistentConfigParametersUnknownObserverList = ConsistentConfigParameters<UnknownObserverTestList>;
//    ^? type TestConsistentConfigParametersUnknownObserverList = false

// --------------------------------------------------------------------------------------

type TestCheckParametersConsistencyOrErrorMap = CheckParametersConsistencyOrError<typeof testConfigParametersMap>;
//    ^? type TestCheckParametersConsistencyOrErrorMap = {
//           readonly first: 21;
//           readonly fourth: Observable<number>;
//       }

type TestCheckParametersConsistencyOrErrorList = CheckParametersConsistencyOrError<typeof testConfigParametersList >;
//    ^? type TestCheckParametersConsistencyOrErrorList = readonly [21, Observable<number>]

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
//    ^? type TestCheckParametersConsistencyOrErrorExactStringList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

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
//           readonly fourth: number;
//       }

type TestConfigResultList = ConfigResult<typeof testConfigParametersList>;
//    ^? type TestConfigResultList = number

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
//    ^? type TestConfigResultExactStringList = {
//           [__TypeError__]: "Config result cannot be derived from inconsistent input";
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
//           readonly fourth: Observable<number>;
//       }>

const testConfigList = config(...testConfigParametersList);
//    ^? const testConfigList: Observable<number>

const testConfigFailMap = config(testConfigParametersFailMap);
//    ^? const testConfigFailMap: Observable<{
//           readonly first: 41;
//           readonly second: "stuff";
//       }>

const testConfigFailList = config(...testConfigParametersFailList);
//    ^? const testConfigFailList: TypeError<"Config result cannot be derived from inconsistent input">

const testConfigExactNumberMap = config(testConfigParametersExactNumberMap);
//    ^? const testConfigExactNumberMap: Observable<{
//           readonly first: 41;
//           readonly second: Observable<42>;
//           readonly third: 35;
//       }>

const testConfigExactNumberList = config(...testConfigParametersExactNumberList);
//    ^? const testConfigExactNumberList: TypeError<"Config result cannot be derived from inconsistent input">

const testConfigExactStringMap = config(testConfigParametersExactStringMap);
//    ^? const testConfigExactStringMap: Observable<{
//           readonly first: "awesome";
//           readonly second: Observable<"stuff">;
//       }>

const testConfigExactStringList = config(...testConfigParametersExactStringList);
//    ^? const testConfigExactStringList: TypeError<"Config result cannot be derived from inconsistent input">

// TODO: Find a solution for this issue.
// Required: config('a', 'b') should turn input params into 'never' to cause
// typescript to not compile the code, and force the developer to better think about
// the code they are writing. So far, best one could do is return a TypeError type
// and hope the code crashes somewhere else. (ie: expecting a string, received TypeError)
const testConfigExactStringListHardcoded = config('something', 'else');
//    ^? const testConfigExactStringListHardcoded: TypeError<"Config result cannot be derived from inconsistent input">

const testConfigOneObject = config({ test: 21 });
//    ^? const testConfigOneObject: Observable<{
//           readonly test: 21;
//       }>

// --------------------------------------------------------------------------------------

type TestMapConfigMapParameterToObservablesMap = MapConfigMapParameterToObservables<typeof testConfigParametersMap>;
//    ^? type TestMapConfigMapParameterToObservablesMap = (Observable<{
//           readonly first: 21;
//       }> | Observable<{
//           fourth: number;
//       }>)[]

type TestMapConfigMapParameterToObservablesFailMap = MapConfigMapParameterToObservables<typeof testConfigParametersFailMap>;
//    ^? type TestMapConfigMapParameterToObservablesFailMap = (Observable<{
//           readonly first: 41;
//       }> | Observable<{
//           readonly second: "stuff";
//       }>)[]

type TestMapConfigMapParameterToObservablesExactNumberMap = MapConfigMapParameterToObservables<typeof testConfigParametersExactNumberMap>;
//    ^? type TestMapConfigMapParameterToObservablesExactNumberMap = (Observable<{
//           readonly first: 41;
//       }> | Observable<{
//           readonly third: 35;
//       }> | Observable<{
//           second: 42;
//       }>)[]

type TestMapConfigMapParameterToObservablesExactStringMap = MapConfigMapParameterToObservables<typeof testConfigParametersExactStringMap>;
//    ^? type TestMapConfigMapParameterToObservablesExactStringMap = (Observable<{
//           readonly first: "awesome";
//       }> | Observable<{
//           second: "stuff";
//       }>)[]

type TestMapConfigMapParameterToObservablesUnknownObserverMap = MapConfigMapParameterToObservables<UnknownObserverTestMap>;
//    ^? type TestMapConfigMapParameterToObservablesUnknownObserverMap = (Observable<{
//           first: 21;
//       }> | Observable<{
//           fourth: unknown;
//       }> | Observable<{
//           third: number;
//       }> | Observable<{
//           second: 42;
//       }> | Observable<{
//           fifth: 22;
//       }>)[]
