import React, {
  useCallback,
  useState,
} from 'react';

import {
  TooltipLinkList,
  WithTooltip,
} from 'storybook/internal/components';

import { useGlobals } from 'storybook/internal/manager-api';

import type {
  Ident as Identifier,
  NormalizedToolbarItemList,
} from '../types.js';
import {
  getSelectedIcon,
  getSelectedTitle,
} from '../utils/getSelected.js';
import { getGlobalIdent as getGlobalIdentifier } from '../utils/ident.js';
import { ToolbarMenuButton } from './ToolbarMenuButton.js';
import { ToolbarMenuListItem } from './ToolbarMenuListItem.js';

export namespace ToolbarMenuList {
  export type ChangeHandler = (identifier: Identifier, value: string | undefined) => void;
  export type Props<Data extends unknown = unknown> = (
    & NormalizedToolbarItemList<Data>[string]
    & {
      onChange: ChangeHandler;
    }
  );
}

export function ToolbarMenuList<Data extends unknown = unknown>({
  ident,
  icon: _icon,
  title: _title,
  preventDynamicIcon,
  dynamicTitle,
  list: items,
  description,
  onChange,
}: ToolbarMenuList.Props<Data>) {
  const { id } = ident;
  const [globals, storyGlobals] = useGlobals();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const currentValue = getGlobalIdentifier(globals, ident);
  const hasGlobalValue = !!currentValue;
  const isOverridden = id in storyGlobals;

  let icon = _icon;
  let title = _title;

  if (!preventDynamicIcon) {
    icon = getSelectedIcon({
      currentValue,
      items,
    }) || icon;
  }

  if (dynamicTitle) {
    title = getSelectedTitle({
      currentValue,
      items,
    }) || title;
  }

  if (!title && !icon) {
    // eslint-disable-next-line no-console
    console.warn(`Toolbar '${id}' has no title or icon`);
  }

  const handleItemClick = useCallback(
    (value: string | undefined) => {
      onChange(ident, value);
    },
    [ident, onChange],
  );

  return (
    <WithTooltip
      placement="top"
      tooltip={({ onHide }) => {
        const links = items
          // Special case handling for various "type" variants
          .filter(({ type }) => !(type === 'reset' && !currentValue))
          .map((item) => {
            const listItem = ToolbarMenuListItem({
              ...item,
              currentValue,
              disabled: isOverridden,
              onClick: () => {
                handleItemClick(item.value);
                onHide();
              },
            });

            return listItem;
          });
        return <TooltipLinkList links={links} />;
      }}
      closeOnOutsideClick
      onVisibleChange={setIsTooltipVisible}
    >
      <ToolbarMenuButton
        active={isTooltipVisible || hasGlobalValue}
        disabled={isOverridden}
        description={description || ''}
        icon={icon}
        title={title || ''}
      />
    </WithTooltip>
  );
}
