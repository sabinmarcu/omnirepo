import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  gridColummns,
  gridStyles,
  type GridStylesProps,
} from './Grid.css';
import './Grid.mobile.css';

export namespace Grid {
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & { columns: number }
    & GridStylesProps
  >;
}

export function Grid({
  className,
  columns,
  large,
  center,
  ...props
}: Grid.Props) {
  return (
    <div
      { ...props }
      className={[
        className,
        gridStyles({
          large,
          center,
        }),
      ].join(' ')}
      style={assignInlineVars({
        [gridColummns]: `${columns}`,
      })}
    />
  );
}
