import { id } from '@/utils/id';
import type { ComponentType } from 'react';
import type { Simplify } from '@sabinmarcu/types';
import { Tooltip } from './Tooltip.component';
import type { TooltipStyleProps } from './Tooltip.component.css';

export namespace withTooltip {
  export type PositionProps = TooltipStyleProps;
  export type RequiredProps = Simplify<(
    & { style?: Record<string, any> }
    & Partial<PositionProps>
  )>;
  export type TooltipProps = {
    tooltip?: string
  };
}

export function withTooltip<
  T extends withTooltip.RequiredProps,
  Rest extends Record<string, any>,
>(
  WrappedComponent: ComponentType<T> & Rest,
  initialValue?: string,
  options?: withTooltip.PositionProps,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
  const ComponentWithTooltip = ({
    tooltip,
    position,
    ...rest
  }: T & withTooltip.TooltipProps) => {
    const content = tooltip ?? initialValue;
    if (!content) {
      return (<WrappedComponent {...(rest as any)} />);
    }

    const anchorId = id();
    const anchorVariable = `--${anchorId}`;
    const positionValue = position ?? options?.position;
    const positionProps = (positionValue
      ? { position: positionValue }
      : {}
    );

    return (
      <>
        <WrappedComponent
          style={{ anchorName: anchorVariable }}
          {...(rest as any)}
        />
        <Tooltip
          style={{ positionAnchor: anchorVariable }}
          {...positionProps}
        >{content}</Tooltip>
      </>
    );
  };

  for (const extra of Object.keys(WrappedComponent)) {
    (ComponentWithTooltip as any)[extra] = (WrappedComponent as any)[extra];
  }

  ComponentWithTooltip.displayName = `withTooltip(${displayName})`;

  return ComponentWithTooltip as (
    & typeof ComponentWithTooltip
    & { [Key in keyof Rest]: Rest[Key] }
  );
}