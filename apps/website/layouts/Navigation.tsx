import type { PropsWithChildren } from 'react';
import { ThemeSelector } from '@/components/ThemeSelector';
import { rootNavigation } from '@/navigation/root';
import {
  grids,
  navigationStyles,
} from './Navigation.css';
import { NavigationList } from './Navigation.list';
import { NavigationLink } from './Navigation.link';
import {
  NavigationBackdrop,
  NavigationMobileButton,
} from './Navigation.mobile';

export namespace Navigation {
  export type Props = PropsWithChildren<{
    empty?: boolean,
  }>;
}
export function Navigation({ children, empty }: Navigation.Props) {
  return (
    <nav className={navigationStyles({ empty })}>
      {empty
        ? <></>
        : (
          <>
            <section id={grids.major}>
              <NavigationList list={rootNavigation} />
            </section>
            {children
              ? (<section id={grids.minor}>
                {children}
              </section>)
              : null
            }
          </>
        )}
      <section id={grids.settings}>
        <ThemeSelector />
        <NavigationMobileButton />
      </section>
      <NavigationBackdrop />
    </nav>
  );
}

Navigation.List = NavigationList;
Navigation.Link = NavigationLink;
