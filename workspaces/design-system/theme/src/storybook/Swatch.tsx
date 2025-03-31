import type { PropsWithChildren } from 'react';
import {
  memo,
  useMemo,
} from 'react';
import {
  assignInlineVars,
} from '@vanilla-extract/dynamic';
import {
  swatchColor,
  swatchColorStyle,
  swatchStyle,
} from './Swatch.css.js';

export namespace SwatchColor {
  export type Props = PropsWithChildren<{
    color: string
  }>;
}

function SwatchColor({ color, children }: SwatchColor.Props) {
  return (
    <div
      className={swatchColorStyle}
      style={assignInlineVars({
        [swatchColor]: color,
      })}
    >
      {children}
    </div>
  );
}

export namespace Swatch {
  export type Props = {
    colors: Record<string, string>
  };
}

function Swatch({ colors }: Swatch.Props) {
  const entries = useMemo(
    () => Object.entries(colors),
    [colors],
  );
  return (
    <div className={swatchStyle}>
      {entries.map(([name, color]) => (
        <SwatchColor key={name} color={color}>
          <span>{name}</span>
          <span>{color}</span>
        </SwatchColor>
      ))}
    </div>
  );
}

export default memo(Swatch);
