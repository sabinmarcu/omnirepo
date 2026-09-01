import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { withStyles } from '@/hocs/withStyles';
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

export const Grid = withStyles(function Grid({
  columns,
  ...props
}: Grid.Props) {
  const inlineStyle = {
    ...assignInlineVars({
      [gridColumns]: `${columns}`,
    }),
  };

  return (
    <div
      {...props}
      style={inlineStyle}
    />
  );
}, gridStyles);
