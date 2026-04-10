import { extendPathname } from '@/utils/routes';
import type { HTMLAttributes } from 'react';
import { Card } from '@/components/Card';
import type { ShowcaseResource } from '@/models/ShowcaseResource';

export namespace ShowcaseCard {
  export type Props = (
    & {
      pathname: string,
      resource: ShowcaseResource,
    }
    & Omit<HTMLAttributes<HTMLDivElement>, 'resource'>
  );
}

export async function ShowcaseCard({
  pathname,
  className,
  resource,
  ...props
}: ShowcaseCard.Props) {
  const {
    slug,
    title,
    preview: { Component: PreviewPage },
  } = resource;
  const href = extendPathname(pathname, slug) as any;
  return (
    <Card {...props} href={href}>
      <Card.Thumbnail><PreviewPage /></Card.Thumbnail>
      <Card.Title>{title}</Card.Title>
    </Card>
  );
}
