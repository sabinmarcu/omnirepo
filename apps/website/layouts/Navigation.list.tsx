import { ViewTransition } from 'react';
import type { NavigationItem } from '@/navigation/utils';
import { ClientClickProxy } from '@/components/ClientClickProxy';
import { NavigationLink } from './Navigation.link';
import { mobileNavigationTriggerSelector } from './Navigation.mobile.constants';

export namespace NavigationList {
  export type Props = (
    & {
      list: NavigationItem[]
      strictMatch?: NavigationLink.Props['strictMatch']
    }
  );
}

export function NavigationList({
  list,
  strictMatch,
}: NavigationList.Props) {
  return (
    <>
      <ClientClickProxy delegate={mobileNavigationTriggerSelector} />
      <ViewTransition>
        {list.map(({
          text,
          id,
          ...rest
        }) => (
          <ViewTransition
            name={`navigation-${id}`}
            key={id}
          >
            <NavigationLink
              {...rest}
              href={(rest as any).href ?? '#'}
              strictMatch={strictMatch}
            >
              {text}
            </NavigationLink>
          </ViewTransition>
        ))}
      </ViewTransition>
    </>
  );
}
