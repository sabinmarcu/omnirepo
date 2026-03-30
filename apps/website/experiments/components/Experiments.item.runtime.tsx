'use client';

import type { InputHTMLAttributes } from 'react';
import type {
  Experiments,
  experiments,
} from '../experiments';
import {
  useExperimentEnabled,
  useExperimentsContext,
} from './Experiments.core';

export namespace ExperimentItemToggle {
  export type ExperimentProp = { experiment: keyof typeof experiments };
  export type Props = (
    & Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'onClick' | 'type' | 'checked'
    >
    & ExperimentProp
    & { onClick: (experiment: Experiments) => Promise<void> }
  );
}
export function ExperimentItemToggle({
  experiment,
  onClick,
  ...props
}: ExperimentItemToggle.Props) {
  'use client';

  const { toggle } = useExperimentsContext();
  const value = useExperimentEnabled(experiment);

  const ownOnClick = () => {
    toggle(experiment);
    onClick(experiment);
  };

  return (
    <input
      {...props}
      type="checkbox"
      onClick={ownOnClick}
      defaultChecked={value}
    />
  );
}