/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/export */
import { Icon } from '@/components/Icon';
import type { ComponentProps } from 'react';
import { withTooltip } from '@/components/Tooltip';
import { ExperimentsTriggerClient } from './Experiments.trigger.runtime';

export namespace ExperimentsTrigger {
  export type Props = ComponentProps<typeof ExperimentsTriggerClient>;
}

export const ExperimentsTrigger = withTooltip(
  function ExperimentsTrigger(props: ExperimentsTrigger.Props) {
    return (
      <ExperimentsTriggerClient {...props}>
        <Icon icon="programming" />
      </ExperimentsTriggerClient>
    );
  },
  'Experiments',
  { position: 'bottom' },
);

