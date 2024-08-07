import type {
  Observable,
  ObservableFilterFunction,
  ObservableMapFunction,
  Observer,
  Subject,
  TypeOfObservable,
} from './types.js';

type ObserverTest = Observer<number>;

type OberverTestNext = ObserverTest['next'];
//    ^? type OberverTestNext = ((value: number | undefined) => void) | undefined

type OberverTestError = ObserverTest['error'];
//    ^? type OberverTestError = ((error: Error) => void) | undefined

type OberverTestComplete = ObserverTest['complete'];
//    ^? type OberverTestComplete = (() => void) | undefined

type ObservableTest = Observable<number>;

type ObservableTestSubscribe = ObservableTest['subscribe'];
//    ^? type ObservableTestSubscribe = (observer: Observer<number | undefined>) => Subscription

type ObservableTestValue = ObservableTest['value'];
//   ^? type ObservableTestValue = number | undefined

type SubjectTest = Subject<number>;

type SubjectTestKeys = keyof SubjectTest;
//    ^? type SubjectTestKeys = "subscribe" | "value" | keyof Observer<number> | "filter" | "map"

type SubjectTestSubscribe = SubjectTest['subscribe'];
//   ^? type SubjectTestSubscribe = (observer: Observer<number | undefined>) => Subscription

type SubjectTestNext = SubjectTest['next'];
//    ^? type SubjectTestNext = (value: number | undefined) => void

type SubjectTestError = SubjectTest['error'];
//    ^? type SubjectTestError = (error: Error) => void

type SubjectTestComplete = SubjectTest['complete'];
//    ^? type SubjectTestComplete = () => void

type SubjectTestValue = SubjectTest['value'];
//   ^? type SubjectTestValue = number | undefined

type ObservableFilterTest = ObservableFilterFunction<ObservableTest>;
//    ^? type ObservableFilterTest = (filter: (input: ObservableTest | undefined) => boolean) => PipedObservable<ObservableTest>

type ObservableMapTest = ObservableMapFunction<ObservableTest>;
//    ^? type ObservableMapTest = <R>(map: (input: ObservableTest | undefined) => R) => PipedObservable<R>

type TypeOfObservableTest1 = TypeOfObservable<ObservableTest>;
//    ^? type TypeOfObservableTest1 = number

type TypeOfObservableTest2 = TypeOfObservable<SubjectTest>;
//    ^? type TypeOfObservableTest2 = number

type TypeOfObservableTest3 = TypeOfObservable<Observable<string>>;
//    ^? type TypeOfObservableTest3 = string
