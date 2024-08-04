import { observable } from './observable';

const testObservableNumber = observable.from(42);
const testObservableString = observable.from('Value: ');

const testObservableValue = testObservableNumber.value;
//    ^? const testObservableValue: 42 | undefined

const testObservableSubscribe = testObservableNumber.subscribe;
//    ^? const testObservableSubscribe: (observer: Observer<42 | undefined>) => Subscription

const testObservableSubscription = testObservableNumber.subscribe({} as any);
//    ^? const testObservableSubscription: Subscription

const testObservableFilter = testObservableNumber.filter;
//    ^? const testObservableFilter: ObservableFilterFunction<42>

const testObservableMap = testObservableNumber.map;
//    ^? const testObservableMap: ObservableMapFunction<42>

const testObservableFrom = observable.from(1);
//    ^? const testObservableFrom: Observable<1>

const testObservableProjection = observable.project(
  (prefix, value) => ({
    prefix,
    value,
    result: `${prefix}${value}`,
  }),
  testObservableString,
  testObservableNumber,
);

const testObservableProjectionValue = testObservableProjection.value;
//    ^? const testObservableProjectionValue: any
