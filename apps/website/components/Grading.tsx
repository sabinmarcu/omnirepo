import type {
  HTMLAttributes,
} from 'react';
import { withStyles } from '@/hocs/withStyles';
import { Icon } from './Icon';
import {
  gradingPipSelector,
  gradingStyles,
} from './Grading.css';

export namespace Grading {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
    & {
      max: number,
      value: number,
    }
  );
}

export const Grading = withStyles(function Grading({
  max,
  value,
  ...props
}: Grading.Props) {
  const elements = Array.from({ length: max })
    .map((_, index) => (
      <div
        key={`grading-${index}`}
        {...{ [gradingPipSelector]: index < value }}
      >
        <Icon icon='circle-notch' />
      </div>
    ));
  return (
    <div {...props}>
      {elements}
    </div>
  );
}, gradingStyles);