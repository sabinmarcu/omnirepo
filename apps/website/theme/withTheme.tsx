import type { families } from '@sabinmarcu/website-theme';
import { selector } from '@sabinmarcu/website-theme';
import type {
  ComponentType,
} from 'react';

export namespace withTheme {
  export type ThemeType = typeof families[number];
  export type ThemeProps = { theme?: ThemeType };
  export type ThemeParamsProps = { [Key in typeof selector]?: withTheme.ThemeType };
}

export function withTheme<T extends unknown>(
  WrappedComponent: ComponentType<T & withTheme.ThemeParamsProps>,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
  const ComponentWithTheme = ({ theme, ...rest }: T & withTheme.ThemeProps) => {
    const themeParams = theme ? { [selector]: theme } as any : {};
    return (<WrappedComponent {...themeParams} {...rest} />);
  };

  ComponentWithTheme.displayName = `withTheme(${displayName})`;

  return ComponentWithTheme;
}
