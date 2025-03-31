/* eslint-disable unicorn/prevent-abbreviations */
import type { IconsProps } from 'storybook/internal/components';
import type { InputType } from 'storybook/internal/types';

import type { Simplify } from '@sabinmarcu/types';
import type { TOOLBAR_ID } from './constants.js';

export type ToolbarItemType = 'item' | 'reset';

export type ToolbarItem<Data extends unknown = unknown> = (
  | {
    value?: string;
    icon?: IconsProps['icon'];
    title?: string;
    hideIcon?: boolean;
    data?: Data;
    type?: ToolbarItemType;
  }
);

export type ToolbarListConfigRequired = {
  title?: string;
  icon?: IconsProps['icon'];
};

export type ToolbarListConfig = (
  & ToolbarListConfigRequired
  & {
    description?: string;
    preventDynamicIcon?: boolean;
    dynamicTitle?: boolean;
  }
);

export type NormalizedToolbarItemList<Data extends unknown = unknown> = (
  {
    [Key in string]: (
      & ToolbarListConfig
      & {
        ident: Ident,
        list: ToolbarItem<Data>[]
      }
    )
  }
);

export type InputToolbarItemList<Data extends unknown = unknown> = (
  {
    [Key in string]: (
      & ToolbarListConfig
      & {
        list: string[] | ToolbarItem<Data>[]
      }
    )
  }
);

export type ToolbarItemList<Data extends unknown = unknown> = (
  | string[]
  | ToolbarItem<Data>[]
  | InputToolbarItemList<Data>
);

export type NormalizedToolbarConfig<Data extends unknown = unknown> = (
  & Partial<ToolbarListConfig>
  & {
    items: NormalizedToolbarItemList<Data>
  }
);

export type NormalizedToolbarArgType<Data extends unknown = unknown> = (
  & InputType
  & { id: string }
  & { [Key in typeof TOOLBAR_ID]: NormalizedToolbarConfig<Data> }
);

export type ToolbarConfigList<Data extends unknown = unknown> = Simplify<(
  & Omit<NormalizedToolbarConfig<Data>, 'items' | keyof ToolbarListConfigRequired>
  & Required<ToolbarListConfigRequired>
  & { items: ToolbarItemList<Data> & any[] }
)>;
export type ToolbarConfigRecord<Data extends unknown = unknown> = Simplify<(
  & Omit<NormalizedToolbarConfig<Data>, 'items' | keyof ToolbarListConfigRequired>
  & Partial<ToolbarListConfigRequired>
  & { items: Exclude<ToolbarItemList<Data>, any[]> }
)>;
export type ToolbarConfig<Data extends unknown = unknown> = Simplify<(
  | ToolbarConfigList<Data>
  | ToolbarConfigRecord<Data>
)>;

export type ToolbarArgType<Data extends unknown = unknown> = Simplify<(
  & InputType
  & { id?: string }
  & { [Key in typeof TOOLBAR_ID]: ToolbarConfig<Data> }
)>;

export type ToolbarMenuProps<Data extends unknown = unknown> = Simplify<(
  & NormalizedToolbarArgType<Data>
)>;

export type Ident = { key: string, id: string };
