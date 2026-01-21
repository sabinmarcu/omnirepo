/* eslint-disable import/export */
import {
  forwardRef,
  type HTMLAttributes,
} from 'react';
import { navigationAnchorStyle } from './Navigation.anchor.css';

export namespace NavigationAnchor {
  export type Props = (
    & HTMLAttributes<HTMLSpanElement>
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NavigationAnchor = forwardRef<HTMLSpanElement, NavigationAnchor.Props>(
  ({
    id,
    className,
    ...props
  }, reference) => (
    <span
      {...props}
      id={id}
      ref={reference}
      className={[
        navigationAnchorStyle,
        className,
      ].filter(Boolean).join(' ')}
    />),
);
