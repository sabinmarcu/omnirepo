import { observable } from './observable';

// eslint-disable-next-line unicorn/empty-brace-spaces
const testObservableNumber = observable.from(42);
const testObservableString = observable.from('Value: ');

const testObservableValue = testObservableNumber.value;
//    ^? const testObservableValue: number

const testObservableSubscribe = testObservableNumber.subscribe;
//    ^? const testObservableSubscribe: (observer: Observer<number>) => Subscription

const testObservableSubscription = testObservableNumber.subscribe({} as any);
//    ^? const testObservableSubscription: Subscription

const testObservableFilter = testObservableNumber.filter;
//    ^? const testObservableFilter: ObservableFilter<number>

const testObservableMap = testObservableNumber.map;
//    ^? const testObservableMap: ObservableMap<number>

const testObservableFrom = observable.from(1);
//    ^? const testObservableFrom: Observable<number>

const testObservableProjection = observable.project(
  (prefix, value) => ({ prefix, value, result: `${prefix}${value}` }),
  testObservableString,
  testObservableNumber,
);

const testObservableProjectionValue = testObservableProjection.value;
//    ^? const testObservableProjectionValue: {
//           prefix: string;
//           value: number;
//           result: string;
//       }
