import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { sectionStyles } from './Section.css';
import './Section.mobile.css';

export namespace Section {
  export type TagType = { name: string };
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & Partial<TagType>
  >;
  export type SubsectionProps = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & TagType
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

Section.Subsection = ({ name, ...props }: Section.SubsectionProps) => (
  <article data-name={name} {...props} />
);
