import { navigationAnchorStyle } from './Navigation.anchor.css';

export namespace NavigationAnchor {
  export type Props = {
    id: string
  };
}

export function NavigationAnchor({ id }: NavigationAnchor.Props) {
  return (<span id={id} className={navigationAnchorStyle}></span>);
}
