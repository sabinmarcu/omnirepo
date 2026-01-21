import { Icon } from '@/components/Icon';
import { experimentsDialogStyle } from './Experiments.css';
import { ExperimentList } from './Experiments.list';
import { ExperimentsTrigger } from './Experiments.trigger';
import './Experiments.mobile.css';

export async function Experiments() {
  return (
    <dialog
      className={experimentsDialogStyle}
    >
      <form method="dialog" >
        <p>Experiments</p>
        <button type="submit">
          <Icon icon="window-close-solid" />
        </button>
      </form>
      <ExperimentList />
    </dialog>
  );
}

Experiments.Trigger = ExperimentsTrigger;
