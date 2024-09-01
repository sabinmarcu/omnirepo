export type AngleFunctions = 'asin' | 'acos' | 'atan' | 'sin' | 'cos' | 'tan' | 'atan2';
export type MathFunctions = 'calc' | 'clamp' | 'counter' | 'counters' | 'exp' | 'log' | 'max' | 'min' | 'mod' | 'pi' | 'pow' | 'sqrt';
export type ColorFunctions = 'color-mix' | 'light-dark';
export type AccessFunctions = 'var' | 'env';
export type CSSFunctionsType = AngleFunctions | MathFunctions | ColorFunctions;

export type CSSFunctions<
  Functions extends CSSFunctionsType = CSSFunctionsType,
> = `${AccessFunctions | Functions}(${string})`;
