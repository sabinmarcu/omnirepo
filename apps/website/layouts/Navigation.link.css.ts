import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';
import { theme } from '@sabinmarcu/website-theme';
import { themedLinkColor } from '@/components/ThemedLink.css';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import { animatedNavigationSelector } from './Navigation.css';
import { blendAnimation } from './Navigation.animation.css';

const navigationLinkBackground = createVar();

const wipMeshSize = createVar('wip-mesh-size');
const wipMeshColor = createVar('wip-mesh-color');
const wipMeshSteps = [
  'transparent 0%',
  `transparent calc(${wipMeshSize} / 2)`,
  `${wipMeshColor} calc(${wipMeshSize} / 2)`,
  `${wipMeshColor} ${wipMeshSize}`,
].join(', ');

export const navigationLinkStyles = recipe({
  variants: {
    active: {
      true: {
        vars: {
          [navigationLinkBackground]: theme.colors.primary.muted,
        },
        background: navigationLinkBackground,
      },
    },
    wip: {
      true: {
        cursor: 'not-allowed',
        position: 'relative',
        ':before': {
          content: '',
          position: 'absolute',
          inset: '0',
          backgroundImage: `repeating-linear-gradient(45deg, ${wipMeshSteps})`,
          backgroundAttachment: 'fixed',
          opacity: 0.15,
          vars: {
            [wipMeshSize]: '15px',
            [wipMeshColor]: theme.colors.warning.base,
          },
          '@media': {
            '(prefers-color-scheme: dark)': {
              vars: {
                [wipMeshColor]: `hsla(from ${theme.colors.warning.base} h s l / 0.1)`,
              },
            },
          },
        },
      },
    },
  },
  base: {
    color: theme.colors.background.text,
    ':visited': {
      color: theme.colors.background.text,
    },
    ':hover': {
      background: themedLinkColor,
    },
  },
});

globalStyle(`${animatedNavigationSelector} ${navigationLinkStyles.classNames.variants.active.true}`, {
  background: blendAnimation(navigationLinkBackground, '20%'),
});

export type NavigationLinkStylesProps = RecipeVariants<typeof navigationLinkStyles>;
