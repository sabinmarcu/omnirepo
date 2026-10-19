'use client';

import type {
  FocusEvent,
  KeyboardEvent,
  ReactNode,
} from 'react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import {
  useRouter,
} from '@/i18n/navigation';
import { projectListStyle } from '@/components/ProjectList.css';
import { showcaseListStyle } from '@/components/ShowcaseList.css';
import { cls } from '@/utils/cls';
import { SearchResultCard } from './SearchResultCard';
import { useSearchIndex } from './useSearchIndex';
import {
  searchEntrypointFieldStyle,
  searchEntrypointIconStyle,
  searchEntrypointInputStyle,
  searchEntrypointResultsStyle,
  searchEntrypointShortcutStyle,
  searchEntrypointStyle,
} from './SearchEntrypoint.css';

export namespace SearchEntrypointClient {
  export type Props = {
    corpusUrl: string,
    icon: ReactNode,
    shortcut?: boolean,
  };
}

export function SearchEntrypointClient({
  corpusUrl,
  icon,
  shortcut,
}: SearchEntrypointClient.Props) {
  const translate = useTranslations('search');
  const router = useRouter();
  const inputReference = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { index, loaded } = useSearchIndex(corpusUrl);
  const results = useMemo(
    () => index.search(query, 'all', 8),
    [index, query],
  );

  useEffect(() => {
    if (!shortcut) {
      return undefined;
    }
    const focusSearch = (event: globalThis.KeyboardEvent) => {
      if (!(event.key === 'k' && (event.ctrlKey || event.metaKey))) {
        return;
      }

      event.preventDefault();
      inputReference.current?.focus();
    };
    document.addEventListener('keydown', focusSearch);
    return () => document.removeEventListener('keydown', focusSearch);
  }, [shortcut]);

  const goToSearch = () => {
    const normalizedQuery = query.trim();
    router.push({
      pathname: '/search',
      query: normalizedQuery ? { q: normalizedQuery } : {},
    });
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    goToSearch();
  };

  return (
    <div
      className={searchEntrypointStyle}
      data-search-entrypoint
      data-focused={focused}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
    >
      <div className={searchEntrypointFieldStyle}>
        <span className={searchEntrypointIconStyle}>{icon}</span>
        <input
          ref={inputReference}
          className={searchEntrypointInputStyle}
          value={query}
          type="search"
          placeholder={translate('placeholderShort')}
          aria-label={translate('title')}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <kbd className={searchEntrypointShortcutStyle}>
          {translate('shortcut')}
        </kbd>
      </div>
      {focused && loaded && query.trim() && results.length > 0
        ? (
          <ul className={cls(showcaseListStyle, projectListStyle, searchEntrypointResultsStyle)}>
            {results.map((document) => (
              <li key={document.id}>
                <SearchResultCard
                  document={document}
                  keepInputFocus
                  onNavigate={() => setFocused(false)}
                />
              </li>
            ))}
          </ul>
        )
        : null}
    </div>
  );
}
