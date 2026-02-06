import type { publications } from '@/data/personal/cv.workplace';
import { publicationsItemStyle } from './Publications.item.css';

export namespace PublicationItem {
  export type Props = {
    source: string,
    publications: typeof publications
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
          <li>
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
