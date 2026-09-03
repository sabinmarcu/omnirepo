/* eslint-disable unicorn/no-useless-template-literals */
import { getTranslations } from 'next-intl/server';
import type { experiments } from '../experiments';
import {
  experimentsItemStyles,
} from './Experiments.item.css';
import { grids } from './Experiments.item.grid';
import { ExperimentItemToggle } from './Experiments.item.toggle';

export namespace ExperimentItem {
  export type Props = (
    & Omit<typeof experiments[keyof typeof experiments], 'title' | 'description'>
    & ExperimentItemToggle.ExperimentProp
    & { title: string, description: string }
  );
}

export async function ExperimentItem({
  experiment,
  title,
  description,
  default: defaultValue,
}: ExperimentItem.Props) {
  const translate = await getTranslations('experiments');
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={experimentsItemStyles}>
      <div {...grids.selector('checkbox')}>
        <ExperimentItemToggle experiment={experiment} />
      </div>
      <p {...grids.selector('title')}>{title}</p>
      <p {...grids.selector('description')}>
        {description}
        {' '}
        (
        {translate('default')}
        :
        {' '}
        {`${defaultValue}`}
        )
      </p>
    </label>
  );
}
