import { createRef } from 'react';
import { ThemeDevtools } from './index.js';
import type {
  ThemeDevtoolsHandle,
  ThemeDevtoolsProps,
  ThemeInputExport,
} from './index.js';

const reference = createRef<ThemeDevtoolsHandle | null>();
const manifests: ThemeDevtoolsProps['manifests'] = [];

const fixture = (
  <ThemeDevtools
    aria-label="Theme source editor"
    className="theme-devtools"
    manifests={manifests}
    nonce="theme-devtools"
    ref={reference}
    shadowMode="open"
    ui={{
      spacing: 12,
      typography: { size: 14 },
    }}
    onChange={(inputs) => {
      const current: readonly ThemeInputExport[] = inputs;
      return current;
    }}
    onReady={(controller) => {
      const current: ThemeDevtoolsHandle | null = controller;
      return current;
    }}
  />
);

export { fixture };
