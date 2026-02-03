'use client';

import type {
  ComponentProps,
  ComponentType,
} from 'react';
import type { Experiments } from '../experiments';
import { useExperimentEnabled } from './Experiments.core';

// eslint-disable-next-line import/export
export namespace withExperiment {
  export type Props<T extends Experiments> = {
    [Key in T]: boolean
  };
}

// eslint-disable-next-line @typescript-eslint/no-redeclare, import/export
export const withExperiment = <Experiment extends Experiments>(
  experiment: Experiment,
) => (
  <T extends withExperiment.Props<Experiment>>(
      WrappedComponent: ComponentType<T>,
    ) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
    const ComponentWithExperiment = (
      props: Omit<ComponentProps<typeof WrappedComponent>, Experiment>,
    ) => {
      const isEnabled = useExperimentEnabled(experiment);
      const experimentProp = { [experiment]: isEnabled };
      return (
          <WrappedComponent
            {...{
              ...props,
              ...experimentProp,
            } as any}
          />
      );
    };

    const experimentSuffix = [
      experiment[0].toUpperCase(),
      experiment.slice(1),
    ].join('');

    ComponentWithExperiment.displayName = `withExperiment${experimentSuffix}(${displayName})`;

    return ComponentWithExperiment;
  }
  );
