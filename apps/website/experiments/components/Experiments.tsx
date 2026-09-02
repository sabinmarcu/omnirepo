import { Icon } from '@/components/Icon';
import { getTranslations } from 'next-intl/server';
import { experimentsDialogStyle } from './Experiments.css';
import { ExperimentList } from './Experiments.list';
import { ExperimentsTrigger } from './Experiments.trigger';
import { experimentsDialogId } from './Experiments.constants';
import './Experiments.mobile.css';

export async function Experiments() {
  const translate = await getTranslations('experiments');
  return (
    <dialog
      id={experimentsDialogId}
      className={experimentsDialogStyle}
      {...{ closedby: 'any' }}
    >
      <header>
        <p>{translate('label')}</p>
        <button
          type="button"
          aria-label={translate('close')}
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
