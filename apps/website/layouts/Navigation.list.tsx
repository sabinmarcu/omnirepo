import type { NavigationItem } from '@/navigation/utils';
import { ViewTransition } from 'react';
import { NavigationLink } from './Navigation.link';

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
  );
}
