import { extendPathname } from '@/utils/routes';
import type { HTMLAttributes } from 'react';
import { Card } from '@/components/Card';
import type { ToolResource } from '@/models/ToolResource';

export namespace ToolCard {
  export type Props = (
    & { pathname: string, tool: ToolResource }
    & HTMLAttributes<HTMLDivElement>
  );
}

export async function ToolCard({
  pathname,
  className,
  tool,
  ...props
}: ToolCard.Props) {
  const {
    slug,
    title,
    preview: { Component: PreviewPage },
  } = tool;
  const href = extendPathname(pathname, slug) as any;
  return (
    <Card {...props} href={href}>
      <Card.Thumbnail><PreviewPage /></Card.Thumbnail>
      <Card.Title>{title}</Card.Title>
    </Card>
  );
}
