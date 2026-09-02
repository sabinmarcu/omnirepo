import type { PropsWithChildren } from 'react';
import type {
  Metadata,
  ResolvingMetadata,
} from 'next';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { MdxResource } from '@/models/MdxResource';
import { layoutTitle } from '@/utils/metadata';

// export const dynamicParams = false;
// export const dynamic = 'force-static';

const content = await MdxResource.from(import('./content.mdx'));

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: await layoutTitle({
      parent,
      title: await content.title,
      prefix: 'Tool',
    }),
  };
}

export default function SnippetsLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <RootPageLayout theme="projects">
      {children}
    </RootPageLayout>
  );
}
