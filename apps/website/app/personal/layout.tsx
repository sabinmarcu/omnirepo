import type { PropsWithChildren } from 'react';
import {
  Navigation,
} from '@/layouts/Navigation';
import { extendPathname } from '@/utils/routes';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { normalizeNavigationList } from '@/navigation/utils';
import {
  getPersonalPagesList,
} from './data';

export default async function SnippetsLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  const pages = await getPersonalPagesList();
  const getSlug = extendPathname.bind(undefined, '/personal');

  const sublist = normalizeNavigationList(
    pages.map(({ title, slug }) => ({
      text: title,
      theme: 'personal',
      href: getSlug(slug),
    })),
  );

  return (
    <RootPageLayout>
      <Navigation>
        <Navigation.List list={sublist} strictMatch />
      </Navigation>
      {children}
    </RootPageLayout>
  );
}

