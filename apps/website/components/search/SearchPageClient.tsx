'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { SearchClient } from './SearchClient';

export function SearchPageClient({ corpusUrl }: { corpusUrl: string }) {
  const searchParameters = useSearchParams();
  const router = useRouter();
  const query = searchParameters.get('q') ?? '';

  return (
    <SearchClient
      corpusUrl={corpusUrl}
      query={query}
      onQueryChange={(nextQuery) => {
        router.replace({
          pathname: '/search',
          query: nextQuery ? { q: nextQuery } : {},
        }, { scroll: false });
      }}
    />
  );
}
