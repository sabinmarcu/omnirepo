import type { ProjectResource } from '@/models/ProjectResource';
import { showcaseListStyle } from './ShowcaseList.css';
import { ProjectCard } from './ProjectCard';
import { projectListStyle } from './ProjectList.css';
import { cls } from '@/utils/cls';

export namespace ProjectList {
  export type Props = {
    locale: string,
    pathname: string,
    resources: ProjectResource[],
  };
}

export async function ProjectList({
  locale, pathname, resources,
}: ProjectList.Props) {
  return (
    <div className={cls(showcaseListStyle, projectListStyle)}>
      {await Promise.all(resources.map(async (resource) => (
        <ProjectCard
          key={await resource.id}
          locale={locale}
          pathname={pathname}
          resource={resource}
        />
      )))}
    </div>
  );
}
