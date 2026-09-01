import type { HTMLAttributes } from 'react';
import {
  CardThumbnail,
  CardTitle,
  CardWrapper,
} from './Card.primitives';
import { ThemedLink } from './ThemedLink';

export namespace Card {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
    & { href?: string }
  );
}

export function Card({
  href,
  ...props
}: Card.Props) {
  const content = (
    <CardWrapper {...props} />
  );

  if (href) {
    return (<ThemedLink href={href as any}>{content}</ThemedLink>);
  }

  return content;
}

Card.Title = CardTitle;
Card.Thumbnail = CardThumbnail;
