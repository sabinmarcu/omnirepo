import { observableKeys } from './constants';
import type {
  Subscription,
} from './types';

export const subscriptionPool = new Set<Subscription>();

export const addToSubscriptionPool = (
  subscription: Subscription,
) => {
  const store = {
    unsubscribe: () => {
      subscriptionPool.delete(store);
      subscription.unsubscribe();
    },
  };
  subscriptionPool.add(store);
  return store;
};

export const emptySubscriptionPool = () => {
  for (const subscription of subscriptionPool) {
    subscription.unsubscribe();
  }
  subscriptionPool.clear();
};

export const mock = {
  keys: observableKeys,
  subscriptionPool,
  emptySubscriptionPool,
  stuff: 'awesome',
};

const hooked = false;
if (typeof afterEach === 'function' && !hooked) {
  afterEach(emptySubscriptionPool);
}
