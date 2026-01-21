import type { CVDegreeItem } from '@/models/CV.types';
import { DegreeItem } from './Degree.item';

export namespace DegreeList {
  export type Props = {
    list: CVDegreeItem[]
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
