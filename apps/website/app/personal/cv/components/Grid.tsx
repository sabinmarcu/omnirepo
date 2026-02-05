import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  gridColumns,
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
  grid,
  ...props
}: Grid.Props) {
  return (
    <div
      { ...props }
      className={[
        className,
        gridStyles({
          large,
          grid,
        }),
      ].join(' ')}
      style={assignInlineVars({
        [gridColumns]: `${columns}`,
      })}
    />
  );
}