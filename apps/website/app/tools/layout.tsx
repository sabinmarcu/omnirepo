import type { PropsWithChildren } from 'react';
import type {
  Metadata,
  ResolvingMetadata,
} from 'next';
import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { title } from './content.mdx';

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title: parentTitle } = await parent;
  return {
    title: {
      default: title,
      template: `Tool - ${parentTitle!.template}`,
    },
  };
}

export default function SnippetsLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <RootPageLayout theme='projects'>
      <Navigation />
      {children}
    </RootPageLayout>
  );
}