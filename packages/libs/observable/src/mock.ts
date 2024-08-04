/* eslint-disable no-undef */
import { mutableStore } from '@sabinmarcu/utils-primitives';
import { observableKeys } from './constants';
import type {
  Subscription,
} from './types';

export const subscriptionPool = mutableStore<Set<Subscription>>();

export const addToSubscriptionPool = (
  subscription: Subscription,
) => {
  if (!subscriptionPool.value) {
    return subscription;
  }
  const store = {
    unsubscribe: () => {
      subscriptionPool.value?.delete(store);
      subscription.unsubscribe();
    },
  };
  subscriptionPool.value?.add(store);
  return store;
};

export const emptySubscriptionPool = () => {
  for (const subscription of subscriptionPool.value ?? []) {
    subscription.unsubscribe();
  }
  subscriptionPool.value?.clear();
};

export const startPooling = () => {
  subscriptionPool.value = new Set<Subscription>();
};

export const endPooling = () => {
  emptySubscriptionPool();
  subscriptionPool.value = undefined;
};

export const mock = {
  keys: observableKeys,
  subscriptionPool,
  emptySubscriptionPool,
  startPooling,
  endPooling,
  stuff: 'awesome',
};

if (
  typeof afterEach === 'function'
  && typeof beforeEach === 'function'
) {
  beforeEach(startPooling);
  afterEach(endPooling);
}
