import { theme } from '@sabinmarcu/website-theme';
import { recipe } from '@vanilla-extract/recipes';
import type { ProjectStatus } from '@/models/ProjectResource';

export const statusPillStyle = recipe({
  variants: {
    status: {
      active: {
        background: `color-mix(in hsl, ${theme.colors.success.muted} 50%, transparent)`,
        color: theme.colors.success.contrast,
      },
      deprecated: {
        background: `color-mix(in hsl, ${theme.colors.warning.muted} 75%, transparent)`,
        color: theme.colors.warning.contrast,
      },
      archived: {
        color: theme.colors.warning.contrast,
        background: `color-mix(in hsl, ${theme.colors.warning.muted} 50%, transparent)`,
      },
      planned: {
        color: theme.colors.info.contrast,
        background: `color-mix(in hsl, ${theme.colors.info.muted} 50%, transparent)`,
      },
      wip: {
        color: theme.colors.info.contrast,
        background: `color-mix(in hsl, ${theme.colors.info.muted} 50%, transparent)`,
      },
    } satisfies { [key in ProjectStatus]?: Parameters<typeof recipe>[0]['base'] },
  },
});
