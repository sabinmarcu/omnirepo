'use client';

import {
  useMemo,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { searchDocumentThemeFamilies } from '@/constants/searchDocumentThemeFamilies';
import type {
  SearchDocumentType,
} from '@/models/SearchDocument';
import { useSearchIndex } from './useSearchIndex';
import {
  searchClientStyle,
  searchControlsStyle,
  searchInputStyle,
  searchResultLinkStyle,
  searchResultsStyle,
  searchResultTypeStyle,
  searchSelectStyle,
  searchStatusStyle,
} from './SearchClient.css';

const searchableTypes: SearchDocumentType[] = [
  'article',
  'degree',
  'experience',
  'project',
  'publication',
  'skill',
  'snippet',
  'tag',
  'tool',
];

export namespace SearchClient {
  export type Props = {
    corpusUrl: string,
    query: string,
    onQueryChange: (query: string) => void,
    onNavigate?: () => void,
  };
}

export function SearchClient({
  corpusUrl,
  query,
  onQueryChange,
  onNavigate,
}: SearchClient.Props) {
  const translate = useTranslations('search');
  const [type, setType] = useState<SearchDocumentType | 'all'>('all');
  const {
    index,
    loaded,
    loadError,
  } = useSearchIndex(corpusUrl);

  const results = useMemo(() => index.search(query, type), [index, query, type]);

  let status: string | undefined;
  if (loadError) {
    status = translate('error');
  } else if (!loaded) {
    status = translate('loading');
  } else if (!query.trim()) {
    status = translate('emptyQuery');
  } else if (results.length === 0) {
    status = translate('noResults', { query });
  }

  return (
    <section className={searchClientStyle}>
      <div className={searchControlsStyle}>
        <input
          className={searchInputStyle}
          value={query}
          type="search"
          placeholder={translate('placeholder')}
          aria-label={translate('title')}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <select
          className={searchSelectStyle}
          value={type}
          aria-label={translate('filter')}
          onChange={(event) => setType(event.target.value as SearchDocumentType | 'all')}
        >
          <option value="all">{translate('allTypes')}</option>
          {searchableTypes.map((value) => (
            <option key={value} value={value}>{translate(`types.${value}`)}</option>
          ))}
        </select>
      </div>
      {status ? <p className={searchStatusStyle}>{status}</p> : null}
      <ul className={searchResultsStyle}>
        {results.map((document) => (
          <li key={document.id}>
            <ThemedLink
              decoration="none"
              className={searchResultLinkStyle}
              href={document.location}
              locale={document.locale}
              onClick={onNavigate}
            >
              <strong>{document.title}</strong>
              <span
                className={searchResultTypeStyle}
                data-theme-family={searchDocumentThemeFamilies[document.type]}
              >
                {translate(`${document.type === 'tag' ? 'tagKinds' : 'types'}.${document.type === 'tag' ? document.kind ?? 'tag' : document.type}`)}
              </span>
            </ThemedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
