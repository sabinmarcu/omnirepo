import type z from 'zod';
import type { infoTagListSchema } from '@/data/personal/cv.schema';
import { InfoTag } from './InfoTag.tag';
import { infoTagListStyles } from './InfoTag.list.css';
import './InfoTag.list.mobile.css';

export namespace InfoTagList {
  export type Props = {
    list: z.output<typeof infoTagListSchema>
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
