import type { PropsWithChildren } from 'react';
import { RootPageLayout } from '@/layouts/RootPageLayout';

export default function TagsLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <RootPageLayout theme="base">
      {children}
    </RootPageLayout>
  );
}
