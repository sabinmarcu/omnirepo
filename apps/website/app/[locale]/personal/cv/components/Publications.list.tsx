import type { CVPublicationGroups } from '@/models/CV.types';
import { PublicationItem } from './Publications.item';
import { publicationsListStyles } from './Publications.list.css';

export namespace PublicationsList {
  export type Props = {
    list: CVPublicationGroups
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
