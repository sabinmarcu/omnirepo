import type {
  LastOf,
  MapObservablesToProjectionParameters,
  Observable,
  ObservableFilter,
  Observer,
  Operator,
  OutputOfOperator,
  Subject,
  ValidOperatorSet,
} from './types';

type ObserverTest = Observer<number>;

type OberverTestNext = ObserverTest['next'];
//    ^? type OberverTestNext = ((value: number) => void) | undefined

type OberverTestError = ObserverTest['error'];
//    ^? type OberverTestError = ((error: Error) => void) | undefined

type OberverTestComplete = ObserverTest['complete'];
//    ^? type OberverTestComplete = (() => void) | undefined

type ObservableTest = Observable<number>;

type ObservableTestSubscribe = ObservableTest['subscribe'];
//    ^? type ObservableTestSubscribe = (observer: Observer<number>) => Subscription

type ObservableTestValue = ObservableTest['value'];
//   ^? type ObservableTestValue = number

type SubjectTest = Subject<number>;

type SubjectTestKeys = keyof SubjectTest;
//    ^? type SubjectTestKeys = keyof Observer<number> | keyof Observable<number>

type SubjectTestSubscribe = SubjectTest['subscribe'];
//   ^? type SubjectTestSubscribe = (observer: Observer<number>) => Subscription

type SubjectTestNext = SubjectTest['next'];
//    ^? type SubjectTestNext = (value: number) => void

type SubjectTestError = SubjectTest['error'];
//    ^? type SubjectTestError = (error: Error) => void

type SubjectTestComplete = SubjectTest['complete'];
//    ^? type SubjectTestComplete = () => void

type SubjectTestValue = SubjectTest['value'];
//   ^? type SubjectTestValue = number
