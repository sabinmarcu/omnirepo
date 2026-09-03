import type { CVPublicationItem } from '@/models/CV.types';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import type { ContentLocation } from '@/models/ContentIndex';
import type { Locale } from '@/i18n/locales';
import { publicationsItemStyle } from './Publications.item.css';

export namespace PublicationItem {
  export type Props = {
    source: string,
    publications: CVPublicationItem[],
    sourceLink?: { location: ContentLocation, locale: Locale },
  };
}

export function PublicationItem({
  source,
  publications,
  sourceLink,
}: PublicationItem.Props) {
  return (
    <li className={publicationsItemStyle}>
      <p>{source}</p>
      <ul>
        {publications.map(({
          publication: {
            title, from, reference,
          },
        }) => (
          <li key={`${title}-${from}-${reference ?? 'noref'}`}>
            {sourceLink
              ? (
                <ThemedLink href={sourceLink.location} locale={sourceLink.locale}>
                  <span>{title}</span>
                  {reference
                    ? (
                      <span>
                        ,
                        {reference}
                      </span>
                    )
                    : null}
                  <span>
                    ,
                    {from}
                  </span>
                </ThemedLink>
              )
              : (
                <>
                  <span>{title}</span>
                  {reference
                    ? (
                      <span>
                        ,
                        {reference}
                      </span>
                    )
                    : null}
                  <span>
                    ,
                    {from}
                  </span>
                </>
              )}
          </li>
        ))}
      </ul>
    </li>
  );
}
