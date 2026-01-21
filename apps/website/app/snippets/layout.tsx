import type { PropsWithChildren } from 'react';
import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';

export default function SnippetsLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <RootPageLayout>
      <Navigation />
      {children}
    </RootPageLayout>
  );
}
