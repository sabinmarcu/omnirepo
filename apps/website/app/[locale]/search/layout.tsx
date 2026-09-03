import type { PropsWithChildren } from 'react';
import { RootPageLayout } from '@/layouts/RootPageLayout';

export default function SearchLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <RootPageLayout theme="base">
      {children}
    </RootPageLayout>
  );
}
