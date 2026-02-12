'use client';

import {
  useEffect,
  useRef,
} from 'react';

export namespace ClientClickProxy {
  export type Props = {
    delegate: string,
  };
}
export function ClientClickProxy({ delegate }: ClientClickProxy.Props) {
  const reference = useRef<HTMLSpanElement>(null);
  useEffect(
    () => {
      if (!reference.current) {
        return undefined;
      }
      const element = reference.current.parentNode!;
      const handler = () => {
        const targetElement = document.querySelector(`#${delegate}`);
        if (!targetElement || !('checked' in targetElement)) {
          return;
        }

        targetElement.checked = !targetElement.checked;
      };
      element.addEventListener('click', handler);
      return () => element.removeEventListener('click', handler);
    },
    [delegate],
  );
  return (
    <span ref={reference} />
  );
}
