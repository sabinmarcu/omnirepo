import type {
  ComponentProps,
  ComponentType,
} from 'react';
import type { Experiments } from '../experiments';
import { experimentEnabled } from '../utils';

export namespace withExperiment {
  export type Props<T extends Experiments> = {
    [Key in T]: boolean
  };
}

export const withExperiment = <Experiment extends Experiments>(
  experiment: Experiment,
) => {
  const HOC = <T extends withExperiment.Props<Experiment>>(
    WrappedComponent: ComponentType<T>,
  ) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
    const ComponentWithExperiment = async (
      props: Omit<ComponentProps<typeof WrappedComponent>, Experiment>,
    ) => {
      const isEnabled = await experimentEnabled(experiment);
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
  };

  return HOC;
};
