import type { CVPublicationItem } from '@/models/CV.types';
import { publicationsItemStyle } from './Publications.item.css';

export namespace PublicationItem {
  export type Props = {
    source: string,
    publications: CVPublicationItem[]
  };
}

export function PublicationItem({ source, publications }: PublicationItem.Props) {
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
              <span>{title}</span>
              {reference
                ? (<span>, {reference}</span>)
                : null}
              <span>, {from}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}
