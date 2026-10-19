import { recipe } from '@vanilla-extract/recipes';
import type { ProjectStatus } from '@/models/ProjectResource';

export const projectCardStyle = recipe({
  variants: {
    status: {
      active: {},
      deprecated: {
        opacity: 0.5,
      },
      archived: {
        opacity: 0.5,
      },
      planned: {},
      wip: {},
    } satisfies { [key in ProjectStatus]?: Parameters<typeof recipe>[0]['base'] },
  },
});

