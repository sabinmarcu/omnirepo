/* eslint-disable unicorn/prevent-abbreviations */
import {
  TOOLBAR_ID,
  DEFAULT_ITEMS_KEY,
} from '../constants.js';
import type {
  NormalizedToolbarArgType as NormalizedToolbarArgumentType,
  NormalizedToolbarItemList,
  ToolbarArgType as ToolbarArgumentType,
  ToolbarItem,
} from '../types.js';
import { ident } from './ident.js';

const defaultItemValues: ToolbarItem = {
  type: 'item',
  value: '',
};

const normalizeItems = <Data extends unknown>(
  argumentType: ToolbarArgumentType<Data>,
  id: string,
): NormalizedToolbarItemList<Data> => {
  const {
    [TOOLBAR_ID]: {
      items,
      title,
      icon,
      preventDynamicIcon,
      dynamicTitle,
    },
  } = argumentType;
  if (!Array.isArray(items)) {
    return Object.fromEntries(
      Object.entries(items)
        .map(([key, set]) => {
          const { list: setItems } = set;
          const newSetItems: ToolbarItem[] = [];
          for (const item of setItems) {
            if (typeof item === 'string') {
              newSetItems.push({
                title: item,
                value: item,
              });
            } else {
              newSetItems.push(item);
            }
          }
          const normalizedSet = {
            title,
            preventDynamicIcon,
            dynamicTitle,
            ...set,
            list: newSetItems,
            ident: ident(id, key),
          };
          return [key, normalizedSet] as any;
        }),
    );
  }
  const normalizedItems = items.map((item: string | ToolbarItem<Data>) => {
    const normalizedItem = typeof item === 'string'
      ? {
        value: item,
        title: item,
      }
      : item;

    if (normalizedItem.type === 'reset' && argumentType.toolbar.icon) {
      normalizedItem.icon = argumentType.toolbar.icon;
      normalizedItem.hideIcon = true;
    }

    return {
      ...defaultItemValues,
      ...normalizedItem,
    } satisfies ToolbarItem<any> as ToolbarItem<any>;
  });

  return {
    [DEFAULT_ITEMS_KEY]: {
      title: title!,
      icon: icon!,
      preventDynamicIcon: preventDynamicIcon!,
      dynamicTitle: dynamicTitle!,
      ident: ident(id, DEFAULT_ITEMS_KEY),
      list: normalizedItems,
    },
  };
};

export const normalizeArgType = <Data extends unknown = unknown>(
  key: string,
  argumentType: ToolbarArgumentType<Data>,
): NormalizedToolbarArgumentType<Data> => {
  const items = normalizeItems(argumentType, key);

  return ({
    ...argumentType,
    id: key,
    name: argumentType.name || key,
    description: argumentType.description || key,
    [TOOLBAR_ID]: {
      ...argumentType[TOOLBAR_ID],
      items,
    },
  });
};
