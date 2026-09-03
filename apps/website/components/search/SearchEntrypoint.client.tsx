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
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { useSearchIndex } from './useSearchIndex';
import { searchDocumentThemeFamilies } from '@/constants/searchDocumentThemeFamilies';
import {
  searchEntrypointFieldStyle,
  searchEntrypointIconStyle,
  searchEntrypointInputStyle,
  searchEntrypointResultLabelStyle,
  searchEntrypointResultStyle,
  searchEntrypointResultTitleStyle,
  searchEntrypointResultsStyle,
  searchEntrypointSecondaryResultListStyle,
  searchEntrypointSecondaryResultsStyle,
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
          <ul className={searchEntrypointResultsStyle}>
            {results.map((document) => (
              <li key={document.id}>
                <ThemedLink
                  decoration="none"
                  className={searchEntrypointResultStyle}
                  href={document.location}
                  locale={document.locale}
                  onClick={() => setFocused(false)}
                >
                  <span className={searchEntrypointResultTitleStyle}>
                    {document.title}
                  </span>
                  <span
                    className={searchEntrypointResultLabelStyle}
                    data-theme-family={searchDocumentThemeFamilies[document.type]}
                  >
                    {translate(document.type === 'tag'
                      ? `tagKinds.${document.kind ?? 'tag'}`
                      : `types.${document.type}`)}
                  </span>
                </ThemedLink>
                {document.secondaryResults?.length
                  ? (
                    <div className={searchEntrypointSecondaryResultsStyle}>
                      <span>{translate('alsoIn')}</span>
                      <ul className={searchEntrypointSecondaryResultListStyle}>
                        {document.secondaryResults.map((secondary) => (
                          <li key={secondary.id}>
                            <ThemedLink
                              decoration="none"
                              className={searchEntrypointResultLabelStyle}
                              href={secondary.location}
                              locale={secondary.locale}
                              onClick={() => setFocused(false)}
                              data-theme-family={searchDocumentThemeFamilies[secondary.type]}
                            >
                              {translate(`types.${secondary.type}`)}
                            </ThemedLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                  : null}
              </li>
            ))}
          </ul>
        )
        : null}
    </div>
  );
}
