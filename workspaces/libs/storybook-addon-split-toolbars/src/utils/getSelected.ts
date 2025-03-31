import type { ToolbarItem } from '../types.js';

interface GetSelectedItemProps<Data extends unknown = unknown> {
  currentValue: string | undefined;
  items: ToolbarItem<Data>[];
}

export const getSelectedItem = <Data extends unknown = unknown>(
  { currentValue, items }: GetSelectedItemProps<Data>,
) => {
  const selectedItem = currentValue !== undefined
    && items.find((item) => item.value === currentValue && item.type !== 'reset');
  return selectedItem;
};

export const getSelectedIcon = <Data extends unknown>(
  { currentValue, items }: GetSelectedItemProps<Data>,
) => {
  const selectedItem = getSelectedItem({
    currentValue,
    items,
  });
  if (selectedItem) {
    return selectedItem.icon;
  }
  return undefined;
};

export const getSelectedTitle = <Data extends unknown>(
  { currentValue, items }: GetSelectedItemProps<Data>,
) => {
  const selectedItem = getSelectedItem({
    currentValue,
    items,
  });
  if (selectedItem) {
    return selectedItem.title;
  }
  return undefined;
};
