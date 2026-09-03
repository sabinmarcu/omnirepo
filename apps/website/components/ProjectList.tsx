import type { ProjectResource } from '@/models/ProjectResource';
import { showcaseListStyle } from './ShowcaseList.css';
import { ProjectCard } from './ProjectCard';

export namespace ProjectList {
  export type Props = {
    pathname: string,
    resources: ProjectResource[],
  };
}

export async function ProjectList({ pathname, resources }: ProjectList.Props) {
  return (
    <div className={showcaseListStyle}>
      {await Promise.all(resources.map(async (resource) => (
        <ProjectCard
          key={await resource.id}
          pathname={pathname}
          resource={resource}
        />
      )))}
    </div>
  );
}
