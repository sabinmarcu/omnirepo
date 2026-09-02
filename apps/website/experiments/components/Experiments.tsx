import { Icon } from '@/components/Icon';
import { experimentsDialogStyle } from './Experiments.css';
import { ExperimentList } from './Experiments.list';
import { ExperimentsTrigger } from './Experiments.trigger';
import { experimentsDialogId } from './Experiments.constants';
import './Experiments.mobile.css';

export async function Experiments() {
  return (
    <dialog
      id={experimentsDialogId}
      className={experimentsDialogStyle}
      {...{ closedby: 'any' }}
    >
      <header>
        <p>Experiments</p>
        <button
          type="button"
          aria-label="Close experiments"
          {...{
            commandfor: experimentsDialogId,
            command: 'close',
          }}
        >
          <Icon icon="window-close-solid" />
        </button>
      </header>
      <ExperimentList />
    </dialog>
  );
}

Experiments.Trigger = ExperimentsTrigger;
