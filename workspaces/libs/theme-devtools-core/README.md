# @sabinmarcu/theme-devtools-core

A framework-free, browser-only modeless inspector for the live source allocations declared by `@sabinmarcu/theme-core`. It mounts a private UI into a connected container; it does not create, initialize, replace, reset, or otherwise own the application's theme runtime.

Module imports and private theme definition are DOM-free; call `createThemeDevtools` only after a real connected browser container exists. No custom-element class is created or registered at import time.

See [`@sabinmarcu/theme-core`](../theme-core/README.md) for manifests and inspection semantics and [`@sabinmarcu/theme-family`](../theme-family/README.md) for family manifests.

```ts
import { createThemeDevtools } from '@sabinmarcu/theme-devtools-core';

const container = document.querySelector<HTMLElement>('#theme-devtools');
if (!container) throw new Error('Theme devtools container is missing');

const devtools = createThemeDevtools(container, {
  // This is metadata produced by your existing application setup, not a new theme.
  manifests: [applicationSetup.manifest()],
  nonce: requestNonce,
  onClose() {
    // Closing hides the inspector. Choose destruction if this UI is no longer wanted.
    devtools.destroy();
  },
});
```

The container **must** be connected, belong to an active browser document, and have at most one devtools root. `createThemeDevtools` appends `sabinmarcu-theme-devtools`, creates its shadow root, and opens the inspector. It returns a controller immediately. Plain ESM output needs no bundler, MUI, React, or Vanilla Extract; the application supplies normal package resolution or an import map.

## Options and controller API

```ts
const devtools = createThemeDevtools(container, {
  manifests,           // readonly ThemeManifest[]; optional
  inspectionDocument,  // Document to inspect; defaults to container.ownerDocument
  nonce,               // CSP nonce for UI/value style elements
  shadowMode: 'open',  // ShadowRootMode; defaults to 'open'
  ui,                  // initial UIThemeInput; omitted fields resolve private defaults
  onClose() {
    // Invoked after the popover is hidden; application sources remain untouched.
  },
});

const host = devtools.host;                   // mounted HTMLElement
const exports = devtools.exportInputs();      // readonly [{ id, inputs }]
devtools.setManifests(nextManifests);         // replace catalog; undefined resumes discovery
devtools.refresh();                           // revalidate; rediscover only in discovery mode
devtools.updateUI({ spacing: 10 });           // patch the inspector's private UI theme
const unsubscribe = devtools.subscribe(() => { /* source/catalog change */ });
unsubscribe();
devtools.destroy();                           // remove private UI and listeners; idempotent
```

`setManifests` is authoritative replacement, not a merge. `undefined` selects DOM discovery again; `[]` intentionally shows no targets. `refresh()` revalidates the current catalog, rediscovering DOM metadata only in discovery mode; it never unions an explicit list with embedded data. Invalid replacement leaves the previous valid catalog in place. `exportInputs()` reads current source declarations at call time and returns complete, setup-compatible exports keyed by manifest ID. There is no UI-value or applied-input cache.

The close button and Escape hide the manual popover and call `onClose`; they do **not** destroy the controller. Keep it and call `devtools.host.showPopover()` to reopen the existing native host, or call `destroy()` from `onClose` as above to release its UI, listeners, private sheets, and host. Escape inside a dirty input first discards only that uncommitted draft. Neither closing nor destruction removes or resets an applied application source.

## What the inspector displays and edits

The inspector is a non-modal `popover="manual"` dialog with a translucent, blurred glass surface. Drag its header (not a control) to position it; its position is clamped to the visual viewport on dragging, resize, and viewport scroll. It opens near the viewport’s upper-right edge. The header provides refresh and close actions.

When several targets are inspectable, a target selector chooses one. Family manifests render a **Shared and static** tree plus one tab for each declared member, including `base`; direct manifests render one **Theme contract** tree. Native disclosure branches are collapsible and retain expansion/selection. Generated read-only values precede editable source leaves, including Light/Dark controls, in compact key/type/value rows rather than per-input cards. Hidden family panes and collapsed branches defer live reads; known source notifications update only changed editors and transitively affected visible derived rows. Unknown structural/text-replacement notification conservatively marks relevant rows dirty. Focused or dirty drafts are not overwritten.

Source controls commit only valid decoded values:

- Number sources use a decimal number control (and display their declared unit).
- Text sources use a text field.
- JSON values use a textarea; JSON booleans use a checkbox. Objects and arrays are complete JSON replacements, not recursive editors.
- Color sources expose a color picker and a **CSS** disclosure with the authored CSS text field. Expressions the picker cannot represent remain editable through CSS; choosing a picker color replaces that expression.
- Typing creates a dirty draft and validates it. A `change`, blur, or Enter commits a valid field (for JSON textarea, use Ctrl/Cmd+Enter); Escape discards a dirty draft. Invalid drafts stay visible with an error.

**Live setup JSON** is read-only and generated from the selected target only while its disclosure is open. **Copy inputs** regenerates the selected target’s live export and copies it when clipboard access is available; otherwise it selects the text for manual copying. These are current source inputs, not an editor-owned initialization state. Do not initialize your application in the inspector.

## Supplying manifests and discovery

The inspector needs the same manifest that describes the existing live application allocation. Normally that comes from the application setup you already create:

```ts
import { createThemeSetup } from '@sabinmarcu/theme-core';

// Existing application lifecycle: initialize/mount independently of devtools.
const applicationSetup = createThemeSetup(applicationTheme, {
  id: 'application-theme',
  nonce: requestNonce,
});
applicationSetup(initialInputs); // Prepare server state for a new allocation only.
const liveApplication = applicationSetup.mount(document);
// An existing complete SSR sheet retains its current inputs during adoption.
// A programmatic catalog is authoritative for this inspector.
createThemeDevtools(container, {
  manifests: [liveApplication.manifest()],
});
```

For server-delivered discovery, use core’s existing `embedThemeManifests([applicationSetup.manifest()], { nonce })` alongside the application stylesheet. The resulting light-DOM inert JSON metadata is discovered by `createThemeDevtools(container)` when no `manifests` option is supplied. A supplied list takes precedence over embedded records and replaces—not combines with—the discovery list. Discovery and catalog changes are manual-refresh, not DOM observation.

Only version-2 manifests are accepted. Every `outputs` record with `role: 'derived'` includes a `sources` list of transitive **editable source allocation names**; those names are structural dependencies, not UI values. Inspection accepts declared, owned sources from one light-DOM allocation root and its owned light-DOM sheet. It does not inspect sheets inside open/closed shadow roots, arbitrary descendants, private UI allocations, or inherited declarations. Family sources use private names internally but remain declared application inspection targets. The original owned application stylesheet is authoritative: edits commit there through the inspection backend. The inspector adds no inline override layer.

## Isolation, CSP, realms, and reloads

The UI has its own `devtools-theme` source/formula allocations on the outer host through a private `:host` sheet. Nested shadow editors inherit those tokens, with independent spacing/font defaults rather than application values or root-font-relative `rem` units. Immutable handwritten structural CSS is embedded in TypeScript and shared only within its owner document. With no nonce, constructable sheets are used when supported; a supplied nonce selects actual nonce-bearing style elements. Mutable private allocation sheets remain per instance. Pass `nonce` when the page's policy requires it; unavailable/CSP-rejected sheets throw and failed mounts clean up rather than showing a pretend unstyled editor.

Custom elements are registered in the container document’s realm, after that realm is known. Their element-registry protocol is version `2`; this is distinct from the theme manifest wire version `2`. A document that already has incompatible `sabinmarcu-theme-devtools` or `sabinmarcu-theme-source-editor` registrations throws rather than mixing implementations. That protects HMR/reload conflicts but does not make arbitrary mismatched reload bundles compatible. Create a fresh compatible page/realm when a prior registration conflicts.

## Support status

The application theme's native CSS feature floor is described by theme-core, including modern color and typed-property behavior. The inspector itself uses custom elements, Shadow DOM, manual popovers, pointer capture, backdrop blur/saturation, and structural-sheet fallback. Native color picker alpha/P3 support and appearance vary by browser; raw CSS input preserves authored expressions until a deliberate edit. Native shipping Safari on macOS/iOS remains unverified, and final latest-code cross-engine release acceptance is still pending. Current Chromium/manual evidence is not a release or Safari compatibility claim.

Chrome extension/transport, shadow inspection, persistence, undo/history, reset-to-initial values, and a separate devtools override layer are not implemented. App edits persist only while the app's current allocation lifecycle preserves its sheet; a new page/server setup can materialize configured values again.

