import type { PropsWithChildren } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getRootNavigation } from '@/navigation/root';
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
import { SearchEntrypoint } from '@/components/search/SearchEntrypoint';

export namespace Navigation {
  export type Props = PropsWithChildren<(
    & { empty?: boolean }
    & { localeParams?: Partial<Record<Locale, Record<string, string>>> }
    & withExperiment.Props<'animatedNavigation'>
  )>;
}

export const Navigation = extendComponent(
  withExperiment('animatedNavigation')(async function Navigation({
    children,
    empty,
    localeParams,
    animatedNavigation,
  }: Navigation.Props) {
    const translate = await getTranslations('navigation');
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
                <NavigationList list={getRootNavigation(translate)} />
                <SearchEntrypoint shortcut />
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
          <NavigationSettings localeParams={localeParams} />
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
