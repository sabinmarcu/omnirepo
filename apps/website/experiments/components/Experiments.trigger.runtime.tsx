'use client';

import type {
  PropsWithChildren,
  ButtonHTMLAttributes,
} from 'react';
import {
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { experimentsDialogStyle } from './Experiments.css';

export namespace ExperimentsTriggerClient {
  export type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;
}

const getElement = () => document.querySelector(
  `.${experimentsDialogStyle}`,
);

export function ExperimentsTriggerClient(props: ExperimentsTriggerClient.Props) {
  const [element, setElement] = useState<HTMLDialogElement>();

  useLayoutEffect(
    () => {
      const maybeElement = getElement();
      if (maybeElement) {
        setElement(maybeElement as any);
      }
    },
  );

  const onClick = useCallback(
    () => element?.showModal(),
    [element],
  );

  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
    />
  );
}
