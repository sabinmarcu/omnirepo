import type { experiments } from '../experiments';
import {
  toggleExperiment,
} from '../utils';
import {
  experimentsItemStyles,
} from './Experiments.item.css';
import { grids } from './Experiments.item.grid';
import { ExperimentItemToggle } from './Experiments.item.runtime';

export namespace ExperimentItem {
  export type Props = (
    & typeof experiments[keyof typeof experiments]
    & ExperimentItemToggle.ExperimentProp
  );
}

export async function ExperimentItem({
  experiment,
  title,
  description,
  default: defaultValue,
}: ExperimentItem.Props) {
  return (
    <label className={experimentsItemStyles}>
      <div {...grids.selector('checkbox')}>
        <ExperimentItemToggle
          experiment={experiment}
          onClick={toggleExperiment}
        />
      </div>
      <p {...grids.selector('title')}>{title}</p>
      <p {...grids.selector('description')}>{description} (default: {defaultValue})</p>
    </label>
  );
}
