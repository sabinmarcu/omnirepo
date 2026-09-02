'use client';

import { variantSelector } from '@sabinmarcu/website-theme';
import type {
  PropsWithChildren,
} from 'react';
import {
  cookieName,
  isThemeSelection,
} from './ThemeSelector.constants';
import {
  selectionDataAttribute,
} from './ThemeSelector.css';

export namespace ThemeSelectorRuntime {
  export type Props = PropsWithChildren;
}

const apply = (event: MouseEvent) => {
  const option = (event.target as Element).closest<HTMLButtonElement>(
    `button[${CSS.escape(selectionDataAttribute)}]`,
  );
  const nextSelection = option?.getAttribute(selectionDataAttribute);
  if (!(option instanceof HTMLButtonElement) || !isThemeSelection(nextSelection)) {
    return;
  }

  const root = document.documentElement;
  root.setAttribute(variantSelector, nextSelection);
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = `${cookieName}=${nextSelection};path=/;max-age=31536000;samesite=lax`;

  const form = event.currentTarget as HTMLFormElement;
  for (const button of form.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button === option));
  }
};

const bind = (form: HTMLFormElement | null) => {
  if (!form) {
    return undefined;
  }

  form.addEventListener('click', apply);
  return () => form.removeEventListener('click', apply);
};

export function ThemeSelectorRuntime({
  children,
}: ThemeSelectorRuntime.Props) {
  return (
    <form ref={bind}>
      {children}
    </form>
  );
}
