import React, { type FC } from 'react';

import { Separator } from 'storybook/internal/components';

import { useGlobalTypes } from 'storybook/internal/manager-api';

import type { ToolbarArgType as ToolbarArgumentType } from '../types.js';
import { normalizeArgType as normalizeArgumentType } from '../utils/normalizeToolbarArgType.js';
import { ToolbarItemMenus } from './ToolbarItemMenus.js';
import { TOOLBAR_ID } from '../constants.js';

/** A smart component for handling manager-preview interactions. */
export const ToolbarManager: FC = () => {
  const globalTypes = useGlobalTypes();
  const globalIds = Object.keys(globalTypes).filter((id) => !!globalTypes[id][TOOLBAR_ID]);

  if (globalIds.length === 0) {
    return null;
  }

  return (
    <>
      <Separator />
      {globalIds.map((id) => {
        const normalizedArgumentType = normalizeArgumentType(
          id,
          globalTypes[id] as ToolbarArgumentType,
        );

        return <ToolbarItemMenus key={id} {...normalizedArgumentType} />;
      })}
    </>
  );
};
