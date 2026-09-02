import { experiments } from '../experiments';
import { getTranslations } from 'next-intl/server';
import { ExperimentItem } from './Experiments.item';
import { experimentsListStyles } from './Experiments.list.css';

export async function ExperimentList() {
  const translate = await getTranslations('experiments');
  return (
    <div className={experimentsListStyles}>
      {Object.entries(experiments).map(([key, experiment]) => (
        <ExperimentItem
          {...experiment}
          key={key}
          experiment={key as any}
          title={translate(`${key}.title` as any)}
          description={translate(`${key}.description` as any)}
        />
      ))}
    </div>
  );
}
