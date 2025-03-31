import type { CSSProperties } from 'react';

export type StylesheetRuleSet<Selector extends string = string> = {
  selector: Selector,
  layer?: string,
  rules?: (
    & CSSProperties
    & { [Key in `--${string}`]: string }
  )
};
