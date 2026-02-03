import { experiments } from '../experiments';
import { ExperimentItem } from './Experiments.item';
import { experimentsListStyles } from './Experiments.list.css';

export function ExperimentList() {
  return (
    <div className={experimentsListStyles}>
      {Object.entries(experiments).map(([key, experiment]) => (
        <ExperimentItem {...experiment} key={key} experiment={key as any} />
      ))}
    </div>
  );
}
