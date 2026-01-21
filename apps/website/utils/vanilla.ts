export namespace extractRecipeProps {
  export type Input<Variants extends string = string> = {
    variants: () => Variants[]
  };
  export type Output<
    Variants extends string = string,
    Props extends Partial<Record<Variants, any>> = {},
  > = [
    & { [Key in Variants]: Props[Key] },
    & { [Key in Exclude<keyof Props, Variants> ]: Props[Key] },
  ];
}

export function extractRecipeProps<
  Variants extends string = string,
  Props extends Partial<Record<Variants, any>> = {},
>(
  recipe: extractRecipeProps.Input<Variants>,
  props: Props,
): extractRecipeProps.Output<Variants, Props> {
  const styleProps: extractRecipeProps.Output<Variants, Props>[0] = {} as any;
  const restProps: extractRecipeProps.Output<Variants, Props>[1] = {} as any;

  const variants = recipe.variants();

  for (const [prop, value] of Object.entries(props)) {
    if (variants.includes(prop as any)) {
      (styleProps as any)[prop] = value;
    } else {
      (restProps as any)[prop] = value;
    }
  }
  return [styleProps, restProps];
}
