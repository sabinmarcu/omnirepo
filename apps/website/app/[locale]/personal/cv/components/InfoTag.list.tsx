import type { CVOverview } from '@/models/CV.types';
import { InfoTag } from './InfoTag.tag';
import { infoTagListStyles } from './InfoTag.list.css';
import './InfoTag.list.mobile.css';

export namespace InfoTagList {
  export type Props = {
    list: CVOverview['info']
  };
}
export function InfoTagList({ list }: InfoTagList.Props) {
  return (
    <section className={infoTagListStyles}>
      {list.map(({ key, value }) => (
        <InfoTag key={key} type={key} value={value} />
      ))}
    </section>
  );
}
