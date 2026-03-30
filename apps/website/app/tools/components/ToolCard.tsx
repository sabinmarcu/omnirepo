import type { toolsList } from '@/data/tools/tools';
import { extendPathname } from '@/utils/routes';
import type { HTMLAttributes } from 'react';
import { Card } from '@/components/Card';
import { resolveTool } from '../[slug]/data';

export namespace ToolCard {
  export type Props = (
    & typeof toolsList[number]
    & { pathname: string }
    & HTMLAttributes<HTMLDivElement>
  );
}

export async function ToolCard({
  title,
  slug,
  pathname,
  className,
  ...props
}: ToolCard.Props) {
  return resolveTool(
    { params: Promise.resolve({ slug }) } as any,
    {
      onError: () => null,
      onSuccess: (tool) => {
        const { preview: PreviewPage } = tool;
        const href = extendPathname(pathname, slug) as any;
        return (
          <Card {...props} href={href}>
            <Card.Thumbnail><PreviewPage /></Card.Thumbnail>
            <Card.Title>{title}</Card.Title>
          </Card>
        );
      },
    },
  );
}