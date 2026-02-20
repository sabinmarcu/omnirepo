import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { snippetCardThumbnailStyle } from './SnippetCard.thumbnail.css';

export namespace SnippetCardThumbnail {
  export type Props = PropsWithChildren<
    HTMLAttributes<HTMLDivElement>
  >;
}

export function SnippetCardThumbnail({
  className,
  children,
  ...props
}: SnippetCardThumbnail.Props) {
  return (
    <div {...props} className={
      [className, snippetCardThumbnailStyle]
        .filter(Boolean)
        .join(' ')
    }>
      <div>{children}</div>
    </div>
  );
}
