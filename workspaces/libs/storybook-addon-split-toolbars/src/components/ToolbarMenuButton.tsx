import { type FC } from 'react';

import {
  IconButton,
  Icons,
  type IconsProps,
} from 'storybook/internal/components';

interface ToolbarMenuButtonProps {
  active: boolean;
  disabled?: boolean;
  title: string;
  icon?: IconsProps['icon'];
  description: string;
  onClick?: () => void;
}

export const ToolbarMenuButton: FC<ToolbarMenuButtonProps> = ({
  active,
  disabled,
  title,
  icon,
  description,
  onClick,
}) => (
    <IconButton
      active={active}
      title={description}
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
    >
      {icon && <Icons icon={icon} __suppressDeprecationWarning={true} />}
      {title ? `\u00A0${title}` : null}
    </IconButton>
);
