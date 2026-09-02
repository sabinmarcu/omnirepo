'use client';

import {
  useEffect,
  useRef,
} from 'react';
import { clientClickProxyStyles } from './ClientClickProxy.css';

export namespace ClientClickProxy {
  export type Props = {
    delegate: string,
    toggle?: boolean,
  };
}
export function ClientClickProxy({
  delegate,
  toggle,
}: ClientClickProxy.Props) {
  const reference = useRef<HTMLSpanElement>(null);
  useEffect(
    () => {
      if (!reference.current) {
        return undefined;
      }
      const element = reference.current.parentNode!;
      const handler = () => {
        const targetElement = document.querySelector(`#${delegate}`);

        if (targetElement instanceof HTMLInputElement && targetElement.type === 'checkbox') {
          targetElement.checked = toggle
            ? !targetElement.checked
            : false;
          return;
        }

        // Popovers light-dismiss on outside clicks and Escape, but not on clicks within.
        if (targetElement instanceof HTMLElement && targetElement.hasAttribute('popover')) {
          if (toggle) {
            targetElement.togglePopover();
          } else if (targetElement.matches(':popover-open')) {
            targetElement.hidePopover();
          }
        }
      };
      element.addEventListener('click', handler);
      return () => element.removeEventListener('click', handler);
    },
    [delegate, toggle],
  );
  return (
    <span ref={reference} className={clientClickProxyStyles} />
  );
}
