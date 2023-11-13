import { observable } from './observable';
import type {
  ObserverController,
  Subject,
} from './types';

export const subject = <T>(initialValue?: T) => {
  let controller: ObserverController<T>;

  const root = observable<T>(
    (observableController) => {
      controller = observableController;
    },
    initialValue,
  );

  return {
    ...root,
    get value() {
      return root.value;
    },
    // @ts-ignore
    ...controller,
  } satisfies Subject<T>;
};
