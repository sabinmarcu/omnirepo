import { breakpointGenerator } from '../generators/breakpoint.js';
import type { UpdaterFunction } from '../utils/types.js';
import type {
  TypeOfThemeGenerator,
} from '../generators/types.js';
import type { CSSVariableFunction } from '../utils/prefixVariable.js';

let rawContract = breakpointGenerator({
  mobile: 700,
  tablet: 1000,
  screen: 1200,
  large: 1920,
  huge: 3000,
});
const contract = new Proxy(rawContract, {
  get(target, k) {
    return (target as any)[k] as any;
  },
}) as unknown as { [Key in keyof typeof rawContract]: CSSVariableFunction };
const update: UpdaterFunction<TypeOfThemeGenerator<typeof breakpointGenerator>> = (input) => {
  rawContract = breakpointGenerator(input) as any;
};
const prefix = 'breakpoint';

export const breakpointContract = [contract, update, prefix, { raw: true }] as const;
