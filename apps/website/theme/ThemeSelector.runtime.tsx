'use client';

import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
} from 'react';
import {
  getSelection,
  updateDOM,
} from './ThemeSelector.core.runtime';
import {
  getNextSelection,
  themeSelectionsMap,
  type ThemeSelection,
} from './ThemeSelector.core';

export namespace ThemeSelectorButton {
  export type Props = (
    & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
    & { onClick: (selection: ThemeSelection) => Promise<void> }
  );
}

export function ThemeSelectorButton({ onClick, ...props }: ThemeSelectorButton.Props) {
  'use client';

  const [selection, setSelection] = useState<ThemeSelection>(getSelection() ?? 'system');

  const ownOnClick = async () => {
    const nextSelection = getNextSelection(
      selection,
    );
    setSelection(nextSelection);
  };

  useEffect(
    () => {
      const updater = async () => {
        updateDOM(selection);
        await onClick?.(selection);
      };
      updater();
    },
    [selection],
  );

  return (
    <button
      {...props}
      aria-label={`Change theme. Currently: ${themeSelectionsMap[selection]}`}
      onClick={ownOnClick}
    />
  );
}

export default ThemeSelectorButton;

