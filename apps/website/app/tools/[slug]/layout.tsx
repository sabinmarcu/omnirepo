import { ToolResource } from '@/models/ToolResource';
import type { PropsWithChildren } from 'react';

export async function generateStaticParams() {
  return ToolResource.slugs;
}

export default function ToolsPageLayout({ children }: PropsWithChildren<{}>) {
  return children;
}
