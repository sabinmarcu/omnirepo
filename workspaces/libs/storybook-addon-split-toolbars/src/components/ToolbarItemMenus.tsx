import React from 'react';

import { useGlobals } from 'storybook/internal/manager-api';

import type { ToolbarMenuProps } from '../types.js';
import { TOOLBAR_ID } from '../constants.js';
import { ToolbarMenuList } from './ToolbarMenuList.js';
import { setGlobalIdent } from '../utils/ident.js';

export namespace ToolbarItemMenus {
  export type Props<Data extends unknown = unknown> = (
    & ToolbarMenuProps<Data>
  );
}

type ChangeHandler = ToolbarMenuList.ChangeHandler;
export function ToolbarItemMenus({
  id,
  [TOOLBAR_ID]: {
    items,
  },
}: ToolbarItemMenus.Props) {
  const [,updateGlobals] = useGlobals();

  const onChange = ((
    ident,
    value,
  ) => {
    const update = !value
      ? {}
      : setGlobalIdent(ident, value);

    updateGlobals({ [id]: update });
  }) satisfies ChangeHandler;

  return (
    <>
      {Object.entries(items).map(([key, set]) => (
        <ToolbarMenuList key={key} {...set} onChange={onChange} />
      ))}
    </>
  );
}
