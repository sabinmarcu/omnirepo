import { observable } from './observable';

// eslint-disable-next-line unicorn/empty-brace-spaces
const testObservableNumber = observable.from(42);
const testObservableString = observable.from('Value: ');

const testObservableValue = testObservableNumber.value;
//    ^? const testObservableValue: 42

const testObservableSubscribe = testObservableNumber.subscribe;
//    ^? const testObservableSubscribe: (observer: Observer<42>) => Subscription

const testObservableSubscription = testObservableNumber.subscribe({} as any);
//    ^? const testObservableSubscription: Subscription

const testObservableFilter = testObservableNumber.filter;
//    ^? const testObservableFilter: ObservableFilter<42>

const testObservableMap = testObservableNumber.map;
//    ^? const testObservableMap: ObservableMap<42>

const testObservableFrom = observable.from(1);
//    ^? const testObservableFrom: Observable<1>

const testObservableProjection = observable.project(
  (prefix, value) => ({ prefix, value, result: `${prefix}${value}` }),
  testObservableString,
  testObservableNumber,
);

const testObservableProjectionValue = testObservableProjection.value;
//    ^? const testObservableProjectionValue: {
//           prefix: "Value: ";
//           value: 42;
//           result: string;
//       }
