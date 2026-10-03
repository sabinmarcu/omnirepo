'use client';

import { ThemeDevtools } from '@sabinmarcu/theme-devtools-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { themeDevtoolsLauncherStyle } from './ThemeDevtools.css';

export namespace WebsiteThemeDevtools {
  export type Props = {
    readonly manifests: ComponentProps<typeof ThemeDevtools>['manifests'];
  };
}

export function WebsiteThemeDevtools({ manifests }: WebsiteThemeDevtools.Props) {
  const translate = useTranslations('themeDevtools');
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={themeDevtoolsLauncherStyle}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {translate(open ? 'close' : 'open')}
      </button>
      {open ? <ThemeDevtools manifests={manifests} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
