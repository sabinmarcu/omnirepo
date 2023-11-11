import { observable } from './observable';
import type {
  ObserverController,
  Subject,
} from './types';

export const subject = <T>() => {
  let controller: ObserverController<T>;

  const root = observable<T>((observableController) => {
    controller = observableController;
  });

  return {
    ...root,
    // @ts-ignore
    ...controller,
  } satisfies Subject<T>;
};
