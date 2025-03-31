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
  Ident,
  NormalizedToolbarItemList,
} from '../types.js';
import {
  getSelectedIcon,
  getSelectedTitle,
} from '../utils/getSelected.js';
import { getGlobalIdent } from '../utils/ident.js';
import { ToolbarMenuButton } from './ToolbarMenuButton.js';
import { ToolbarMenuListItem } from './ToolbarMenuListItem.js';

export namespace ToolbarMenuList {
  export type ChangeHandler = (ident: Ident, value: string | undefined) => void;
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

  const currentValue = getGlobalIdent(globals, ident);
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
          .filter(({ type }) => {
            let shouldReturn = true;

            if (type === 'reset' && !currentValue) {
              shouldReturn = false;
            }

            return shouldReturn;
          })
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
      {
        <ToolbarMenuButton
          active={isTooltipVisible || hasGlobalValue}
          disabled={isOverridden}
          description={description || ''}
          icon={icon}
          title={title || ''}
        />
      }
    </WithTooltip>
  );
}
