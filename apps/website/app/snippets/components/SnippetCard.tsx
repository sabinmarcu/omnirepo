import { ThemedLink } from '@/components/ThemedLink';
import type { snippetsList } from '@/data/snippets/snippets';
import { extendPathname } from '@/utils/routes';
import type { HTMLAttributes } from 'react';
import { Typography } from '@/components/mdx/Typography';
import { resolveSnippet } from '../[slug]/data';
import { SnippetCardThumbnail } from './SnippetCard.thumbnail';
import { snippetCardStyle } from './SnippetCard.css';

export namespace SnippetCard {
  export type Props = (
    & typeof snippetsList[number]
    & { pathname: string }
    & HTMLAttributes<HTMLDivElement>
  );
}

export async function SnippetCard({
  title,
  slug,
  pathname,
  className,
  ...props
}: SnippetCard.Props) {
  return resolveSnippet(
    { params: Promise.resolve({ slug }) } as any,
    {
      onError: () => null,
      onSuccess: (snippet) => {
        const { preview: PreviewPage } = snippet;
        const href = extendPathname(pathname, slug) as any;
        return (
          <ThemedLink href={href}>
            <article {...props} className={
              [className, snippetCardStyle]
                .filter(Boolean)
                .join(' ')
            }>
              <SnippetCardThumbnail><PreviewPage /></SnippetCardThumbnail>
              <Typography as="h2">{title}</Typography>
            </article>
          </ThemedLink>
        );
      },
    },
  );
}
