'use server';

import { getThemeVariant } from '@/theme';
import { variantSelector } from '@sabinmarcu/website-theme';
import type { PropsWithChildren } from 'react';
import { RootBodyLayout } from './layout.runtime';

export async function RootHtmlLayout({ children }: PropsWithChildren<{}>) {
  'use server';

  return (
    <html
      lang="en"
      {...{ [variantSelector]: await getThemeVariant() }}
    >
      <RootBodyLayout>
        {children}
      </RootBodyLayout>
    </html>
  );
}
