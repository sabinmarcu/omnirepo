/* eslint-disable unicorn/prevent-abbreviations */
import type { ForwardedRef } from 'react';
import {
  useEffect,
  useRef,
} from 'react';

export const useDuplicateRef = <T extends HTMLElement>(
  replicateReference: ForwardedRef<T>,
) => {
  const reference = useRef<T>(null);
  useEffect(
    () => {
      if (replicateReference && reference.current) {
        if (typeof replicateReference === 'function') {
          replicateReference(reference.current);
        } else {
          // eslint-disable-next-line no-param-reassign
          replicateReference.current = reference.current;
        }
      }
    },
    [
      reference,
      replicateReference,
    ],
  );
  return reference;
};
