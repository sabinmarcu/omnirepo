import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { sectionStyles } from './Section.css';
import './Section.mobile.css';

export namespace Section {
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & { name: string }
  >;
}
export function Section({
  name,
  className,
  ...rest
}: Section.Props) {
  return (
    <section
      {...rest}
      {...(name ? { 'data-name': name } : {})}
      className={[
        sectionStyles,
        className,
      ].join(' ')}
    />
  );
}