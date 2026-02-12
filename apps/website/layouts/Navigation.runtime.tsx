'use client';

/* eslint-disable import/export */
import { withExperiment } from '@/experiments/components/withExperiment';
import type { PropsWithChildren } from 'react';
import { ClientClickProxy } from '@/components/ClientClickProxy';
import { navigationStyles } from './Navigation.css';
import { mobileNavigationTriggerSelector } from './Navigation.mobile.constants';

export namespace NavigationClient {
  export type Props = PropsWithChildren<
    & { empty?: boolean }
    & withExperiment.Props<'animatedNavigation'>
  >;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NavigationClient = withExperiment('animatedNavigation')(({
  children,
  empty,
  animatedNavigation,
}: NavigationClient.Props) => (
    <nav className={navigationStyles({
      empty,
      animated: animatedNavigation,
    })}>
      <ClientClickProxy delegate={mobileNavigationTriggerSelector} />
      {children}
    </nav>
));
