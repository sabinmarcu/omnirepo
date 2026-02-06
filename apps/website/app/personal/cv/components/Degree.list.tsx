import type { degrees } from '@/data/personal/cv.workplace';
import { DegreeItem } from './Degree.item';

export namespace DegreeList {
  export type Props = {
    list: typeof degrees
  };
}

export function DegreeList({ list }: DegreeList.Props) {
  return (
    <>
      {list.map((degree) => (
        <DegreeItem key={degree.degree.title} {...degree} />
      ))}
    </>
  );
}
