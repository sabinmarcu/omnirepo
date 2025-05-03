import React from 'react';
import type { TooltipLinkListLink } from 'storybook/internal/components';
import {
  Icons,
} from 'storybook/internal/components';

import type { ToolbarItem } from '../types.js';

export type ToolbarMenuListItemProps = {
  currentValue: string | undefined;
  onClick: () => void;
  disabled?: boolean;
} & ToolbarItem;

export const ToolbarMenuListItem = ({
  title,
  value,
  icon,
  hideIcon,
  onClick,
  disabled,
  currentValue,
}: ToolbarMenuListItemProps) => {
  const Icon = icon && (
    <Icons style={{ opacity: 1 }} icon={icon} __suppressDeprecationWarning={true} />
  );

  const Item: TooltipLinkListLink = {
    id: value ?? '_reset',
    active: currentValue === value,
    title,
    disabled,
    onClick,
  };

  if (icon && !hideIcon) {
    Item.icon = Icon;
  }

  return Item as any;
};
