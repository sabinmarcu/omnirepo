import { observable } from './observable';

// eslint-disable-next-line unicorn/empty-brace-spaces
const testObservable = observable<number>(() => { });

const testObservableValue = testObservable.value;
//    ^? const testObservableValue: number

const testObservableSubscribe = testObservable.subscribe;
//    ^? const testObservableSubscribe: (observer: Observer<number>) => Subscription

const testObservableSubscription = testObservable.subscribe({} as any);
//    ^? const testObservableSubscription: Subscription
