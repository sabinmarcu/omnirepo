import { useTranslations } from 'next-intl';
import type { PointerEventHandler } from 'react';
import { ContentCard } from '@/components/ContentCard';
import { TagPill } from '@/components/TagPill';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { searchDocumentThemeFamilies } from '@/constants/searchDocumentThemeFamilies';
import type { SearchDocument } from '@/models/SearchDocument';
import { tagLabel } from '@/models/TagRegistry';
import {
  searchResultTypeStyle,
  searchSecondaryResultListStyle,
} from './SearchClient.css';

export function SearchResultCard({
  document,
  onNavigate,
  keepInputFocus = false,
}: {
  document: SearchDocument,
  onNavigate?: () => void,
  keepInputFocus?: boolean,
}) {
  const translate = useTranslations('search');
  const preserveFocus: PointerEventHandler<HTMLAnchorElement> | undefined = keepInputFocus
    ? (event) => event.preventDefault()
    : undefined;
  const typeLabel = translate(document.type === 'tag'
    ? `tagKinds.${document.kind ?? 'tag'}`
    : `types.${document.type}`);

  return (
    <ContentCard
      title={(
        <ThemedLink
          decoration="none"
          href={document.location}
          locale={document.locale}
          onPointerDown={preserveFocus}
          onClick={onNavigate}
        >
          {document.title}
        </ThemedLink>
      )}
      kind={typeLabel}
      kindTheme={searchDocumentThemeFamilies[document.type]}
      metadata={document.secondaryResults?.length
        ? (
          <>
            <span>{translate('alsoIn')}</span>
            <ul className={searchSecondaryResultListStyle}>
              {document.secondaryResults.map((secondary) => (
                <li key={secondary.id}>
                  <ThemedLink
                    decoration="none"
                    className={searchResultTypeStyle}
                    href={secondary.location}
                    locale={secondary.locale}
                    onPointerDown={preserveFocus}
                    onClick={onNavigate}
                    data-theme-family={searchDocumentThemeFamilies[secondary.type]}
                  >
                    {translate(`types.${secondary.type}`)}
                  </ThemedLink>
                </li>
              ))}
            </ul>
          </>
        )
        : undefined}
      tags={document.tags.length > 0
        ? document.tags.map((tag) => (
          <TagPill key={tag} id={tag} label={tagLabel(tag, (id) => id)} />
        ))
        : undefined}
    />
  );
}
