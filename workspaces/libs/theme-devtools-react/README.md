# @sabinmarcu/theme-devtools-react

React client wrapper for the native `@sabinmarcu/theme-devtools-core` inspector. It renders one host `<div>` and delegates all inspector UI, source editing, manifests, and lifecycle ownership to the native controller. It does not duplicate a source renderer or create an application theme runtime.

Read the [native API guide](/api/theme-devtools-core) for inspector behavior, [`@sabinmarcu/theme-core`](/api/theme-core) for manifest production, and [`@sabinmarcu/theme-family`](/api/theme-family) for family manifests.

`react` is a peer dependency. The core package is a normal dependency; no MUI, Vanilla Extract, or bundler integration is required beyond the consuming application’s React and package-resolution setup.

## Basic use

```tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import {
  ThemeDevtools,
  type ThemeDevtoolsHandle,
  type ThemeInputExport,
} from '@sabinmarcu/theme-devtools-react';

export function ThemeTools({ applicationSetup }: {
  // This comes from the application's existing mounted theme setup.
  readonly applicationSetup: { manifest(): import('@sabinmarcu/theme-core').ThemeManifest };
}) {
  const ref = useRef<ThemeDevtoolsHandle>(null);
  const manifests = useMemo(() => [applicationSetup.manifest()], [applicationSetup]);
  const [open, setOpen] = useState(true);
  if (!open) return <button onClick={() => setOpen(true)}>Open theme inspector</button>;

  return (
    <ThemeDevtools
      ref={ref}
      className="theme-devtools-host"
      manifests={manifests}
      onReady={(controller) => {
        // controller is the actual native controller, or null after cleanup.
      }}
      onChange={(exports: readonly ThemeInputExport[]) => {
        // Current complete exports, one entry per currently subscribed target.
        console.log(exports);
      }}
      onClose={() => setOpen(false)}
      onError={(error) => console.error('Theme devtools:', error)}
    />
  );
}
```

`ThemeDevtools` is a `'use client'` component. During SSR it contributes only its ordinary host `<div>` markup; native custom elements, shadow DOM, popover, and inspection are created in an effect on the client. Put it in a client boundary when using an RSC framework.

The manifest above is metadata emitted by the existing application setup (`applicationSetup.manifest()`), not input for a new editor-owned application setup. Mount and initialize the application independently, then pass its manifest or let the native inspector discover its embedded catalog. Never initialize the application from this component.

## Props and ref

`ThemeDevtoolsProps` combines ordinary `<div>` props (except `children`, `onChange`, and `onError`) with native `ThemeDevtoolsOptions`:

```ts
export type ThemeDevtoolsProps = {
  // Ordinary div attributes, such as id, className, style, data-*, and aria-*.

  manifests?: readonly ThemeManifest[];
  inspectionDocument?: Document;
  nonce?: string;
  shadowMode?: ShadowRootMode;
  ui?: UIThemeInput;
  onClose?: () => void;

  onReady?: (controller: ThemeDevtoolsHandle | null) => void;
  onChange?: (inputs: readonly ThemeInputExport[]) => void;
  onError?: (error: unknown) => void;
};

export type ThemeDevtoolsHandle = import('@sabinmarcu/theme-devtools-core').ThemeDevtools;
export type ThemeInputExport = {
  readonly id: string;
  readonly inputs: Readonly<Record<string, unknown>>;
};
```

The forwarded ref receives the real native controller, not a wrapper. Its API is `host`, `setManifests`, `refresh`, `exportInputs`, `updateUI`, `subscribe`, and `destroy`; see the native guide for exact semantics. It is `null` before a successful mount and after cleanup.

The structural mount options are `inspectionDocument`, `nonce`, and `shadowMode`. Changing one destroys the existing native instance and mounts a new one. `manifests` is a prop-only update: when its reference changes, the existing controller receives `setManifests(manifests)`. `ui` is also a prop-only patch: a new defined value calls `updateUI(ui)` on the existing controller. Passing `undefined` after an initial UI input does not reset the private UI theme.

Keep `manifests` and `ui` references stable (`useMemo` or stable caller-owned values) unless their intended catalog/UI patch changed. Fresh equivalent catalog arrays still request binding replacement, so source callbacks should not create a new list on every render. Do not treat copied export/display state as authoritative: the application's owned stylesheet remains the source of truth, and exports are live reads. Presentation-only export state is optional.

## Callbacks, errors, and cleanup

- `onReady(controller)` is called after successful native creation. `onReady(null)` is called when that instance cleans up.
- `onChange(exports)` is subscribed only while an `onChange` callback is present. It receives fresh `controller.exportInputs()` results after a source commit or successful catalog replacement; it is not an initial snapshot callback and is not subscribed when omitted.
- `onClose()` runs when the native close action hides its manual popover. It does not unmount the React component or alter application sources. Prefer letting the owning component stop rendering `ThemeDevtools`, as above; its effect cleanup then destroys the private instance and clears refs. Calling the native handle's `destroy()` manually while the component remains mounted leaves React referring to a destroyed controller until it unmounts or structurally remounts.
- `onError(error)` observes creation, update, subscription, or cleanup errors. Errors are also rendered as a `<p role="alert">` next to the host.

The initial alert remains visible when creation fails. Updating a structural mount option recreates the instance; changing `manifests` or `ui` after an initial creation failure schedules another creation attempt. A successful mount/update clears the alert. This is recovery behavior, not a fallback inspector or copied state.

Effects own native cleanup, including `destroy()`, ref clearing, and `onReady(null)`. This is intended to remain safe with React Strict Mode’s development setup/cleanup cycle. The native package validates its custom-element registrations in the document realm with its own version-4 protocol; incompatible HMR/reload registrations can still fail loudly rather than mixing implementations. Manifest wire version 2 is a separate protocol. Reload/HMR compatibility is not final cross-engine release acceptance.

## Inspection boundaries and support status

The wrapper has the same inspection boundary as the native controller: it edits declared version-2 manifest sources in the existing light-DOM application allocation/sheet, and reads live source declarations without a value cache. Explicit `manifests` replace discovery; omitted manifests allow native light-DOM catalog discovery. The UI remains private and does not create an inline application override layer.

The actual window is shared with the plain native integration: modeless header dragging, liquid-glass styling, one tab per family, separately identified shared/static values, and compact contract-tree controls. All branches start collapsed; editable fields always precede read-only values within each category. Every editable field has its input, an always-visible committed live value, and a Copy button that copies that committed value without overwriting a dirty draft. Native color pickers retain an always-visible authored-CSS path. No website modal wrapper, page-wide backdrop/focus trap, or React-rendered editor duplicate is needed.

The shared toolbar's **Color format** preference (Hex, OKLCH, HSL, or RGB) applies to picker and literal CSS-field edits across every target and family. Committed values reach live values, copied values/JSON, raw JSON overlays, controller exports, and `onChange` in that format. Existing sources and CSS expressions are not rewritten by changing the preference. OKLCH retains wide-gamut colors; the other formats clip to sRGB. The preference resets on remount.

Each family tree has floating **Copy family JSON** and **Raw** actions for that family's live input subtree. The toolbar's **Copy setup JSON** and **Raw** actions export the selected target's complete setup; there is no bottom JSON disclosure. Raw overlays update while open, cover only the corresponding tree/editor content, and close with Escape without closing the inspector. Granular source notifications refresh only changed controls and dependent visible values; collapsed/inactive rows are read when exposed. Full current setup inputs are read for JSON copy/open overlays or an explicit `onChange` callback. The wrapper does not perform those exports when neither is needed.


The application theme’s native CSS feature floor is defined by theme-core. Native Safari/macOS/iOS support remains unverified, and final latest-code cross-engine release acceptance remains pending. Do not treat local browser behavior, Strict Mode cleanup intent, or HMR conflict detection as that acceptance.
