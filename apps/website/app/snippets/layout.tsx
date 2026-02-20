import type { PropsWithChildren } from 'react';
import type {
  Metadata,
  ResolvingMetadata,
} from 'next';
import { title } from './content.mdx';

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title: parentTitle } = await parent;
  return {
    title: {
      default: title,
      template: `Snippet - ${parentTitle!.template}`,
    },
  };
}

export default function SnippetsLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <>{children}</>
  );
}
