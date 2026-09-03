import type { ShowcaseResource } from '@/models/ShowcaseResource';
import { ShowcaseCard } from './ShowcaseCard';
import { showcaseListStyle } from './ShowcaseList.css';

export namespace ShowcaseList {
  export type Props = {
    pathname: string,
    resources: ShowcaseResource[],
  };
}

export async function ShowcaseList({
  pathname,
  resources,
}: ShowcaseList.Props) {
  return (
    <div className={showcaseListStyle}>
      {await Promise.all(resources.map(async (resource) => (
        <ShowcaseCard
          key={await resource.id}
          resource={resource}
          pathname={pathname}
        />
      )))}
    </div>
  );
}
