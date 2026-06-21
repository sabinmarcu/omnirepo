// #region ignore Root Setup
import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

export const showcaseRootStyles = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  inlineSize: '100cqw',
  blockSize: '100cqh',
  gap: '5cqmax',
});

export const showcaseRootContainerStyles = style({
  inlineSize: '100cqw',
  display: 'flex',
  flexFlow: 'column nowrap',
});
// #endregion

// #region List Styles
/**
 * Nothing fancy, rendering a list of things
 */
export const showcaseListStyles = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: theme.grid.xl,
});
// #endregion

// #region ignore Transition Disable
globalStyle([
  showcaseRootStyles,
  `${showcaseListStyles} *`,
].join(', '), {
  transition: 'none',
});
// #endregion

// #region Showcase Image
/**
 * Styles for the image itself
 */
export const showcaseImageStyles = style({
  blockSize: '100cqh',
  inlineSize: '100cqw',
  objectFit: 'cover',
  objectPosition: 'center center',
});
// #endregion

// #region Constants
/**
 * Through these variables we will be controlling the showcase items themselves
 * The position variables are required for functioning, the rest are for you to play around with.
 */
// Control the size of the items
export const imageSize = createVar();

// Expose cursor position from JS
export const xPosition = createVar();
export const yPosition = createVar();

// Control the effects intensity
export const shadowIntensity = createVar();
export const transformIntensity = createVar();
export const perspective = createVar();
// #endregion

// #region ignore Constants Defaults
export const defaults = {
  [imageSize]: '300',
  [transformIntensity]: '6',
  [shadowIntensity]: '0.10',
  [perspective]: '250',
} as const;
// #endregion

// #region Variables
/**
 * We'll be using these to break down the calculations for explanations
 */
// Primitives for the calculations
const xOffset = createVar();
const yOffset = createVar();

// Transform calculations
const transformX = createVar();
const transformY = createVar();
const transform = createVar();

// Box Shadow Calculations
const shadowXOffset = createVar();
const shadowYOffset = createVar();
const shadowXSlope = createVar();
const shadowYSlope = createVar();
const shadowSlope = createVar();
const shadowSpread = createVar();
const shadowColorOpacity = createVar();
const shadowColor = createVar();
const shadowBlur = createVar();
const shadow = createVar();
// #endregion

// #region Showcase Effects
/**
 * We'll have two wrappers to create the effect we want.
 * One of them will handle scaling while the other will handle transforms and box shadows
 * The calculations will be present down <a href='#heading-calculations'>below</a>
 */
export const showcaseWrapperStyles = recipe({

  // Common Styles
  base: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  // Base styles for each variant of wrapper (well, for the outer wrapper)
  variants: {
    which: {
      outer: {
        transition: 'transform 0.2s ease-out',
        containerType: 'size',
        inlineSize: `calc(${imageSize} * 1px)`,
        aspectRatio: '11/15',
      },
      inner: {},
    },
    active: {
      true: {},
    },
  },

  compoundVariants: [
    // Outer wrapper will pop out when active
    {
      variants: {
        which: 'outer',
        active: true,
      },
      style: {
        transform: 'scale(1.2)',
        position: 'relative',
      },
    },

    // Inner wrapper will transform and render a box shadow when active
    {
      variants: {
        which: 'inner',
        active: true,
      },
      style: {
        transform,
        boxShadow: shadow,
        background: shadowColor,
      },
    },
  ],
});

// #endregion

// #region Calculations
globalStyle(showcaseWrapperStyles.classNames.variants.which.outer, {
  vars: {
    // Calculate offset ([-1, 1]) for each axis
    // with respects to the center of the item
    [xOffset]: `calc(${xPosition} - 0.5)`,
    [yOffset]: `calc(${yPosition} - 0.5)`,

    // Slightly rotate the item based on our offsets
    // and factor in perspective
    // We want to tilt the item in the opposite direction
    // as that of our cursos with respects to the center of the item
    [transformY]: `calc(${xOffset} * ${transformIntensity} * 1deg)`,
    [transformX]: `calc(${yOffset} * ${transformIntensity} * -1deg)`,
    [transform]: [
      `perspective(calc(${perspective} * 1px))`,
      `rotateY(${transformY})`,
      `rotateX(${transformX})`,
    ].join(' '),

    // Calculate X and Y offsets for the shadow based on our offsets
    // and the size of the item
    [shadowXOffset]: `calc(${xOffset} * 100cqw * -1 * ${shadowIntensity})`,
    [shadowYOffset]: `calc(${yOffset} * 100cqh * -1 * ${shadowIntensity})`,

    // Calculate the slope of the transform
    // (the most we're tilting the item on each axis)
    [shadowXSlope]: `abs(${xOffset})`,
    [shadowYSlope]: `abs(${yOffset})`,
    [shadowSlope]: `max(max(${shadowXSlope}, ${shadowYSlope}), 0)`,

    // Calculate the blur based on the slope
    [shadowBlur]: `calc(max(${shadowSlope}, 0.4) * 50px)`,

    // Calculate the spread based on the slope
    [shadowSpread]: `calc(max(${shadowSlope}, 0.1) * 20px)`,

    // Calculate the color based on the slope
    [shadowColorOpacity]: `calc(max(0, min(1 - ${shadowSlope})) - 0.3)`,
    [shadowColor]: `hsla(from black h s l / ${shadowColorOpacity})`,

    // Combine our calculations into a box-shadow specification
    [shadow]: [
      shadowXOffset,
      shadowYOffset,
      shadowBlur,
      shadowSpread,
      shadowColor,
    ].join(' '),
  },
});

export type ShowcaseWrapperStylesProps = RecipeVariants<typeof showcaseWrapperStyles>;
// #endregion

// #region ignore Controls Styles
export const controlLabelStyle = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  inlineSize: '100cqw',
});

export const controlLabelTextStyle = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const controlLabelWrapperStyle = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
});

export const controlLabelControlStyle = style({
  flex: 1,
});
// #endregion
