import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { withStyles } from '@/hocs/withStyles';
import type { TooltipStyleProps } from './Tooltip.component.css';
import { tooltipStyle } from './Tooltip.component.css';

export namespace Tooltip {
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & TooltipStyleProps
  >;
}

export const Tooltip = withStyles(function Tooltip(props: Tooltip.Props) {
  return <div {...props} />;
}, tooltipStyle);

