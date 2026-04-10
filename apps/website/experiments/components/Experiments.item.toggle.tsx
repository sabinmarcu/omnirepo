import type { InputHTMLAttributes } from 'react';
import type {
  experiments,
} from '../experiments';
import {
  experimentEnabled,
  toggleExperiment,
} from '../utils';

export namespace ExperimentItemToggle {
  export type ExperimentProp = { experiment: keyof typeof experiments };
  export type Props = (
    & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'onClick' | 'type' | 'checked'
    >
    & ExperimentProp
  );
}
export async function ExperimentItemToggle({
  experiment,
  ...props
}: ExperimentItemToggle.Props) {
  const value = await experimentEnabled(experiment);

  async function onClick() {
    'use server';

    return toggleExperiment(experiment);
  }

  return (
    <input
      {...props}
      type="checkbox"
      onClick={onClick}
      defaultChecked={value}
    />
  );
}
