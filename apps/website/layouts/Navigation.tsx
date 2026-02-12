import type { PropsWithChildren } from 'react';
import { ThemeSelector } from '@/theme';
import { rootNavigation } from '@/navigation/root';
import { Experiments } from '@/experiments';
import { NavigationList } from './Navigation.list';
import { NavigationLink } from './Navigation.link';
import {
  NavigationBackdrop,
  NavigationMobileButton,
} from './Navigation.mobile';
import { grids } from './Navigation.grid';
import { NavigationClient } from './Navigation.runtime';
import { NavigationAnchor } from './Navigation.anchor';
import { TOCMobileButton } from './PageTOCLayout.toc.mobile';

export namespace Navigation {
  export type Props = PropsWithChildren<{
    empty?: boolean,
  }>;
}
export function Navigation({ children, empty }: Navigation.Props) {
  return (
    <NavigationClient empty={empty}>
      {empty
        ? <></>
        : (
          <>
            <section {...grids.selector('major')}>
              <NavigationList list={rootNavigation} />
            </section>
            {children
              ? (<section {...grids.selector('minor')}>
                {children}
              </section>)
              : null
            }
          </>
        )}
      <section {...grids.selector('settings')}>
        <ThemeSelector />
        <Experiments.Trigger />
        <NavigationMobileButton />
        <TOCMobileButton />
      </section>
      <NavigationBackdrop />
    </NavigationClient>
  );
}

Navigation.List = NavigationList;
Navigation.Link = NavigationLink;
Navigation.Anchor = NavigationAnchor;
