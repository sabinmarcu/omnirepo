import type { ButtonHTMLAttributes } from 'react';
import { withTooltip } from '@/components/Tooltip';
import { experimentsDialogId } from './Experiments.constants';

export namespace ExperimentsTrigger {
  export type Props = ButtonHTMLAttributes<HTMLButtonElement>;
}

export const ExperimentsTrigger = withTooltip(
  function ExperimentsTrigger(props: ExperimentsTrigger.Props) {
    return (
      <button
        {...props}
        type="button"
        {...{
          commandfor: experimentsDialogId,
          command: 'show-modal',
        }}
      >
        <span>Experiments</span>
      </button>
    );
  },
);

