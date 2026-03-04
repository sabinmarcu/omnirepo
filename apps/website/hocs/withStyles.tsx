import { cls } from '@/utils/cls';
import { extractRecipeProps } from '@/utils/vanilla';
import type {
  recipe,
  RecipeVariants,
} from '@vanilla-extract/recipes';
import { merge } from 'ts-deepmerge';
import type { ComponentType } from 'react';
import type {
  Simplify,
  UnionToIntersection,
} from '@sabinmarcu/types';

export namespace withStyles {

  type RecipeType = ReturnType<typeof recipe>;

  export type StyleOption = (
    | string
    | RecipeType
  );

  export type StylesProps<Options extends StyleOption[]> = Exclude<{
    [Key in keyof Options & number]: Options[Key] extends RecipeType
      ? RecipeVariants<Options[Key]>
      : {}
  }[keyof Options & number], undefined>;

  export type RequiredProps = { className?: string };

  export type Selectors<Options extends StyleOption[]> = Simplify<UnionToIntersection<{
    [Key in keyof Options]: Options[Key] extends RecipeType
      ? (
        & { Key: Options[Key]['classNames']['variants']
        & { 'base': 'string' } }
      )
      : { Key: { 'base': 'string' } }
  }[keyof Options & number]>['Key']>;

  export type SelectorsProps<Options extends StyleOption[]> = {
    selectors: Selectors<Options>
    selector: Selectors<Options>['base']
  };
}

export function withStyles<
  T extends withStyles.RequiredProps,
  Styles extends withStyles.StyleOption[],
  Rest extends Record<string, any>,
>(
  WrappedComponent: ComponentType<T> & Rest,
  ...options: Styles
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';

  let selectors: Record<string, any> = { base: [] };
  for (const style of options) {
    if (typeof style === 'string') {
      selectors.base.push(style);
    } else {
      selectors.base.push(style.classNames.base);
      const { base } = selectors;
      selectors = merge(selectors, style.classNames.variants) as any;
      selectors.base = base;
    }
  }

  selectors.base = selectors.base.join(' ');

  const ComponentWithStyles = (props: T & withStyles.StylesProps<Styles>) => {
    const styles: string[] = [];

    let finalProps: T = props as any;

    for (const style of options) {
      if (typeof style === 'string') {
        styles.push(style);
      } else {
        const [styleProps, rest] = extractRecipeProps(style, finalProps);
        styles.push(style(styleProps as any));
        finalProps = rest as any;
      }
    }

    const { className, ...rest } = finalProps;

    return (<WrappedComponent
      className={cls(className, ...styles)}
      {...(rest as any)}
    />);
  };

  // console.log({ [displayName]: Object.keys(WrappedComponent) });
  for (const extra of Object.keys(WrappedComponent)) {
    (ComponentWithStyles as any)[extra] = (WrappedComponent as any)[extra];
  }

  ComponentWithStyles.selectors = selectors;
  ComponentWithStyles.selector = selectors['base'];

  ComponentWithStyles.displayName = `withStyles(${displayName})`;

  return ComponentWithStyles as (
    & typeof ComponentWithStyles
    & withStyles.SelectorsProps<Styles>
    & { [Key in keyof Rest]: Rest[Key] }
  );
}
