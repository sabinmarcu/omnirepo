import type { PropsWithChildren } from 'react';
import type {
  Metadata,
  ResolvingMetadata,
} from 'next';
import { MdxResource } from '@/models/MdxResource';
import { layoutTitle } from '@/utils/metadata';

const content = await MdxResource.from(import('./content.mdx'));
console.dir({
  content: content.content,
  toc: content.toc,
}, { depth: null });

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: await layoutTitle({
      parent,
      title: content.title,
      prefix: 'Snippet',
    }),
  };
}

export default function SnippetsLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <>{children}</>
  );
}
