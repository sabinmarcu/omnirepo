import { Icon } from '@/components/Icon';
import { ExperimentsTriggerClient } from './Experiments.trigger.runtime';

export function ExperimentsTrigger() {
  return (
    <ExperimentsTriggerClient>
      <Icon icon="programming" />
    </ExperimentsTriggerClient>
  );
}
