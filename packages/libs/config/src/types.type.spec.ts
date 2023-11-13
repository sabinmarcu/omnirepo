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

type TestConfigParameters = ConfigParameters<number>;
//    ^? type TestConfigParameters = Readonly<Record<string, any>> | readonly (number | Observable<number>)[]

const testConfigParametersMap = {
  first: 21,
  second: 25,
  third: observable.from(35),
  fourth: observable<number>(() => {}),
  fifth: 42,
} as const satisfies ConfigParameters<number>;

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
] as const satisfies ConfigParameters<number>;

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
}) as const satisfies ConfigParameters<number>;

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
]) as const satisfies ConfigParameters<number>;

{ testConfigParametersExactNumberList; }
//    ^? const testConfigParametersExactNumberList: readonly [41, Observable<42>, 35]

const testConfigParametersExactStringMap = ({
  first: 'awesome',
  second: observable.from('stuff'),
}) as const satisfies ConfigParameters<string>;

{ testConfigParametersExactStringMap; }
//    ^? const testConfigParametersExactStringMap: {
//           readonly first: "awesome";
//           readonly second: Observable<"stuff">;
//       }
const testConfigParametersExactStringList = ([
  'awesome',
  observable.from('stuff'),
]) as const satisfies ConfigParameters<string>;

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

type TestConfigObservablesFromParametersMap = ConfigObservablesFromParameters<number, typeof testConfigParametersMap>;
//    ^? type TestConfigObservablesFromParametersMap = {
//           readonly first: Observable<21>;
//           readonly second: Observable<25>;
//           readonly third: Observable<35>;
//           readonly fourth: Observable<number>;
//           readonly fifth: Observable<...>;
//       }

type TestConfigObservablesFromParametersList = ConfigObservablesFromParameters<number, typeof testConfigParametersList>;
//    ^? type TestConfigObservablesFromParametersList = readonly [Observable<21>, Observable<25>, Observable<35>, Observable<number>, Observable<42>]

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
//    ^? type TestTypeOfConfigParametersRawExactNumberList = 35 | 42 | 41

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
//    ^? type TestConsistentConfigParametersMap = unknown

type TestConsistentConfigParametersList = ConsistentConfigParameters<typeof testConfigParametersList>;
//    ^? type TestConsistentConfigParametersList = unknown

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
//    ^? type TestConsistentConfigParametersExactStringList = never

type TestConsistentConfigParametersUnknownObserverMap = ConsistentConfigParameters<UnknownObserverTestMap>;
//    ^? type TestConsistentConfigParametersUnknownObserverMap = unknown

type TestConsistentConfigParametersUnknownObserverList = ConsistentConfigParameters<UnknownObserverTestList>;
//    ^? type TestConsistentConfigParametersUnknownObserverList = never

// --------------------------------------------------------------------------------------

type TestCheckParametersConsistencyOrErrorMap = CheckParametersConsistencyOrError<typeof testConfigParametersMap>;
//    ^? type TestCheckParametersConsistencyOrErrorMap = unknown

type TestCheckParametersConsistencyOrErrorList = CheckParametersConsistencyOrError<typeof testConfigParametersList >;
//    ^? type TestCheckParametersConsistencyOrErrorList = unknown

type TestCheckParametersConsistencyOrErrorFailMap = CheckParametersConsistencyOrError<typeof testConfigParametersFailMap>;
//    ^? type TestCheckParametersConsistencyOrErrorFailMap = unknown

type TestCheckParametersConsistencyOrErrorFailList = CheckParametersConsistencyOrError<typeof testConfigParametersFailList>;
//    ^? type TestCheckParametersConsistencyOrErrorFailList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

type TestCheckParametersConsistencyOrErrorExactNumberMap = CheckParametersConsistencyOrError<typeof testConfigParametersExactNumberMap>;
//    ^? type TestCheckParametersConsistencyOrErrorExactNumberMap = unknown

type TestCheckParametersConsistencyOrErrorExactNumberList = CheckParametersConsistencyOrError<typeof testConfigParametersExactNumberList>;
//    ^? type TestCheckParametersConsistencyOrErrorExactNumberList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

type TestCheckParametersConsistencyOrErrorExactStringMap = CheckParametersConsistencyOrError<typeof testConfigParametersExactStringMap>;
//    ^? type TestCheckParametersConsistencyOrErrorExactStringMap = unknown

type TestCheckParametersConsistencyOrErrorExactStringList = CheckParametersConsistencyOrError<typeof testConfigParametersExactStringList>;
//    ^? type TestCheckParametersConsistencyOrErrorExactStringList = {
//           [__TypeError__]: "Config input is not consistent";
//       }

type TestCheckParametersConsistencyOrErrorUnknownObserverMap = CheckParametersConsistencyOrError<UnknownObserverTestMap>;
//    ^? type TestCheckParametersConsistencyOrErrorUnknownObserverMap = unknown

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
//    ^? const testConfigMap: Observable<MapConfigMapParameterToValues<{
//           readonly first: 21;
//           readonly second: 25;
//           readonly third: Observable<35>;
//           readonly fourth: Observable<number>;
//           readonly fifth: 42;
//       }>>

const testConfigList = config(...testConfigParametersList);
//    ^? const testConfigList: Observable<number>

const testConfigFailMap = config(testConfigParametersFailMap);
//    ^? const testConfigFailMap: Observable<MapConfigMapParameterToValues<{
//           readonly first: 41;
//           readonly second: "stuff";
//       }>>

// @ts-expect-error
const testConfigFailList = config(...testConfigParametersFailList);
//    ^? const testConfigFailList: TypeError<"Config result cannot be derived from inconsistent input">

const testConfigExactNumberMap = config(testConfigParametersExactNumberMap);
//    ^? const testConfigExactNumberMap: Observable<MapConfigMapParameterToValues<{
//           readonly first: 41;
//           readonly second: Observable<42>;
//           readonly third: 35;
//       }>>

// @ts-expect-error
const testConfigExactNumberList = config(...testConfigParametersExactNumberList);
//    ^? const testConfigExactNumberList: TypeError<"Config result cannot be derived from inconsistent input">

const testConfigExactStringMap = config(testConfigParametersExactStringMap);
//    ^? const testConfigExactStringMap: Observable<MapConfigMapParameterToValues<{
//           readonly first: "awesome";
//           readonly second: Observable<"stuff">;
//       }>>

// @ts-expect-error
const testConfigExactStringList = config(...testConfigParametersExactStringList);
//    ^? const testConfigExactStringList: TypeError<"Config result cannot be derived from inconsistent input">
