import { cookies } from 'next/headers';
import { experiments } from './experiments';

const experiementKeyPrefix = 'experiment-';

const getExperimentKey = <Experiment extends keyof typeof experiments>(
  experiment: Experiment,
) => `${experiementKeyPrefix}${experiment}` as unknown as `${typeof experiementKeyPrefix}${Experiment}`;

export async function experimentEnabled<Experiment extends keyof typeof experiments>(
  experiment: Experiment,
): Promise<boolean> {
  'use server';

  const store = await cookies();
  const key = getExperimentKey(experiment);
  if (store.has(key)) {
    const { value } = store.get(key)!;
    return JSON.parse(value);
  }
  return experiments[experiment].default;
}

export async function toggleExperiment<Experiment extends keyof typeof experiments>(
  experiment: Experiment,
) {
  'use server';

  const current = await experimentEnabled(experiment);
  const store = await cookies();
  const key = getExperimentKey(experiment);

  store.set(key, JSON.stringify(!current));
}

export async function getExperiments() {
  'use server';

  const values:Record<keyof typeof experiments, boolean> = {} as any;
  for (const key of Object.keys(experiments)) {
    values[key as keyof typeof experiments] = (
      await experimentEnabled(key as keyof typeof experiments)
    );
  }
  return values;
}