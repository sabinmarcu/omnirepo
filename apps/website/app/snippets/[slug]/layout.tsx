import { PageTOCLayout } from '@/layouts/PageTOCLayout';
import type { PropsWithChildren } from 'react';

export default function SnippetLayoutPage({ children }: PropsWithChildren) {
  return <PageTOCLayout>{children}</PageTOCLayout>;
}
