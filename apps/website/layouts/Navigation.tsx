import type { PropsWithChildren } from 'react';
import { rootNavigation } from '@/navigation/root';
import { withExperiment } from '@/experiments/components/withExperiment';
import { extendComponent } from '@/utils/components';
import { NavigationList } from './Navigation.list';
import { NavigationLink } from './Navigation.link';
import {
  NavigationBackdrop,
  NavigationMobileButton,
} from './Navigation.mobile';
import { grids } from './Navigation.grid';
import { NavigationAnchor } from './Navigation.anchor';
import { navigationStyles } from './Navigation.css';
import { NavigationSettings } from './Navigation.settings';

export namespace Navigation {
  export type Props = PropsWithChildren<(
    & { empty?: boolean }
    & withExperiment.Props<'animatedNavigation'>
  )>;
}

export const Navigation = extendComponent(
  withExperiment('animatedNavigation')(async function Navigation({
    children,
    empty,
    animatedNavigation,
  }: Navigation.Props) {
    return (
      <nav className={navigationStyles({
        empty,
        animated: animatedNavigation,
      })}
      >
        {empty
          ? null
          : (
            <>
              <section {...grids.selector('major')}>
                <NavigationList list={rootNavigation} />
              </section>
              {children
                ? (
                  <section {...grids.selector('minor')}>
                    {children}
                  </section>
                )
                : null}
            </>
          )}
        <section {...grids.selector('settings')}>
          <NavigationSettings />
          <NavigationMobileButton />
        </section>
        <NavigationBackdrop />
      </nav>
    );
  }),
  {
    List: NavigationList,
    Link: NavigationLink,
    Anchor: NavigationAnchor,
  },
);
