import { getLocale } from 'next-intl/server';
import { Icon } from '@/components/Icon';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { SearchEntrypointClient } from './SearchEntrypoint.client';

export async function SearchEntrypoint({ shortcut }: { shortcut?: boolean }) {
  const locale = await getLocale() as Locale;
  const corpusUrl = getPathname({
    locale,
    href: '/search-index',
  });
  return (
    <SearchEntrypointClient
      corpusUrl={corpusUrl}
      icon={<Icon icon="search" />}
      shortcut={shortcut}
    />
  );
}
