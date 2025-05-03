export type CSSVariableFunction = `var(--${string})`;
export type CSSVariableOfFunction<T extends CSSVariableFunction> = (
  T extends `var(--${infer Variable extends string})`
    ? Variable
    : never
);

const cssVariableRegex = /var\(--([a-zA-Z0-9-]+)\)/;
export const prefixVariable = <
  const Variable extends CSSVariableFunction,
  const Prefix extends string,
>(
    variable: Variable,
    prefix: Prefix,
  ): `var(--${Prefix}-${CSSVariableOfFunction<Variable>})` => {
  const [,innerVariable] = variable.match(cssVariableRegex)!;
  return `var(--${[prefix, innerVariable].join('-')})` as any;
};
