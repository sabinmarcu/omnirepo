import type { PropsWithChildren } from 'react';
import { PageTOCLayout } from '@/layouts/PageTOCLayout';
import { cvPageStyles } from './page.css';

export default function CVPageLayout({ children }: Readonly<PropsWithChildren<{}>>) {
  return (
    <PageTOCLayout className={cvPageStyles} variant="large" maxLevel={3}>
      {children}
    </PageTOCLayout>
  );
}
