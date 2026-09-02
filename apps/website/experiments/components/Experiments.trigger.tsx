import type { ButtonHTMLAttributes } from 'react';
import { getTranslations } from 'next-intl/server';
import { experimentsDialogId } from './Experiments.constants';

export namespace ExperimentsTrigger {
  export type Props = ButtonHTMLAttributes<HTMLButtonElement>;
}

export async function ExperimentsTrigger(props: ExperimentsTrigger.Props) {
  const translate = await getTranslations('experiments');
  return (
    <button
      {...props}
      type="button"
      {...{
        commandfor: experimentsDialogId,
        command: 'show-modal',
      }}
    >
      <span>{translate('label')}</span>
    </button>
  );
}

