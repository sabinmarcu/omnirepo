'use client';

import type { PropsWithChildren } from 'react';
import {
  createContext,
  useContext,
  useState,
} from 'react';
import type { Experiments } from '../experiments';
import { experiments } from '../experiments';

const defaultData = Object.fromEntries(
  Object.entries(experiments)
    .map(([key, { default: defaultValue }]) => [key, defaultValue]),
) as unknown as { [Key in Experiments]: typeof experiments[Key]['default'] };

export function useExperimentsContextProvider(inputData: Record<Experiments, boolean>) {
  const [data, setData] = useState(inputData);
  const toggle = (experiment: Experiments) => {
    setData((previous) => ({
      ...previous,
      [experiment]: !previous[experiment],
    }));
  };
  return {
    toggle,
    data,
  } as const;
}

export const ExperimentsContext = createContext<
  ReturnType<typeof useExperimentsContextProvider>
>({ data: defaultData } as any);

export function ExperimentsContextProvider({
  data,
  children,
}: PropsWithChildren<{
  data: Parameters<typeof useExperimentsContextProvider>[0]
}>) {
  const value = useExperimentsContextProvider(data);
  return <ExperimentsContext.Provider value={value}>
    {children}
  </ExperimentsContext.Provider>;
}

export function useExperimentsContext() {
  return useContext(ExperimentsContext);
}

export function useExperimentEnabled(experiment: Experiments) {
  return useExperimentsContext().data[experiment];
}
