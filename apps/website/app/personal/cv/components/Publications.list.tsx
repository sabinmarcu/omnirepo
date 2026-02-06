import type { zippedPublications } from '@/data/personal/cv';
import { PublicationItem } from './Publications.item';
import { publicationsListStyles } from './Publications.list.css';

export namespace PublicationsList {
  export type Props = {
    list: typeof zippedPublications
  };
}

export function PublicationsList({ list }: PublicationsList.Props) {
  return (
    <ul className={publicationsListStyles}>
      {Object.entries(list).map(([key, publications]) => (
        <PublicationItem source={key} key={key} publications={publications} />
      ))}
    </ul>
  );
}
