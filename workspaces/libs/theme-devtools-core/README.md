# @sabinmarcu/theme-devtools-core

A framework-free, browser-only modeless inspector for the live source allocations declared by `@sabinmarcu/theme-core`. It mounts a private UI into a connected container; it does not create, initialize, replace, reset, or otherwise own the application's theme runtime.

Module imports and private theme definition are DOM-free; call `createThemeDevtools` only after a real connected browser container exists. No custom-element class is created or registered at import time.

See [`@sabinmarcu/theme-core`](/api/theme-core) for manifests and inspection semantics and [`@sabinmarcu/theme-family`](/api/theme-family) for family manifests.

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
  presentation: 'window', // 'window' (default popover) or 'embedded' (fills the container)
  onClose() {
    // Invoked after the popover is hidden; application sources remain untouched.
  },
});

// Alternatively, inspect through a caller-owned ThemeInspection (see "Remote inspection").
createThemeDevtools(container, { inspection, presentation: 'embedded' });

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

`presentation: 'embedded'` renders the same inspector as a block that fills its container: no popover, dragging, close button, or Escape-to-close; the header keeps the refresh action and `onClose` is never called. Use it for dedicated surfaces such as a browser DevTools pane.

`inspection` replaces `manifests`/`inspectionDocument` (combining them throws). The controller reads, patches, refreshes, and subscribes through it but never disposes it; the caller owns its lifecycle and must dispose it after `destroy()`.

## What the inspector displays and edits

The inspector is a non-modal `popover="manual"` dialog with a translucent, blurred glass surface. Drag its header (not a control) to position it; its position is clamped to the visual viewport on dragging, resize, and viewport scroll. It opens near the viewport’s upper-right edge. The header provides refresh and close actions.

When several targets are inspectable, a target selector chooses one. Family manifests render a **Shared and static** tree plus one tab for each declared member, including `base`; direct manifests render one **Theme contract** tree. Every disclosure branch starts collapsed and retains user expansion/selection. Editable sources always precede read-only values within their category, including a category's own source and Light/Dark controls. Hidden family panes and collapsed branches defer live reads; known source notifications update only changed editors and transitively affected visible derived rows. Unknown structural/text-replacement notifications conservatively mark relevant rows dirty. Focused or dirty drafts are not overwritten, but their separate committed live values continue updating.

Source controls commit only valid decoded values:

- Number sources use a decimal number control (and display their declared unit).
- Text sources use a text field.
- JSON values use a textarea; JSON booleans use a checkbox. Objects and arrays are complete JSON replacements, not recursive editors.
- Color sources expose a color picker and an always-visible authored CSS text field. Expressions the picker cannot represent remain editable through CSS; choosing a picker color replaces that expression.
- Typing creates a dirty draft and validates it. A `change`, blur, or Enter commits a valid field (for JSON textarea, use Ctrl/Cmd+Enter); Escape discards a dirty draft. Invalid drafts stay visible with an error.

Every editable field displays its input, an always-visible read-only **committed live source value**, and a **Copy** button. Copy reads the latest committed value, not an uncommitted draft; clicking it preserves that draft. Numbers are copied without their codec's CSS unit, JSON/booleans as JSON, and color/text sources as their authored strings. Units remain identified beside the numeric input. Clipboard success/failure is reported per field.

The toolbar's **Color format** preference applies to every color source across all inspected targets and family tabs. Choose **Hex** (the default), **OKLCH**, **HSL**, or **RGB**. Both picker edits and literal CSS-field commits write the selected format into the application's owned stylesheet, so the CSS input, committed live value, raw JSON, copied values/JSON, and `exportInputs()` agree. Changing the preference alone does not rewrite existing sources or dirty drafts. Authored expressions (`var()`, `light-dark()`, `color-mix()`, relative colors, and context-dependent colors) stay intact when edited through CSS; choosing a picker color deliberately replaces them.

Formatting uses the mount document's native CSS color conversion and preserves alpha. OKLCH retains wide-gamut colors; Hex, HSL, and RGB clip to sRGB, and Hex quantizes channels/alpha to eight bits. The preference belongs to the inspector instance, survives target/family changes and refresh, and resets to Hex after destruction/remount; it is not stored across page loads.

Each family tree has floating top-right **Copy family JSON** and **Raw** buttons. They export that member's complete live input subtree (`exportInputs()[target].inputs.families[member]`), without shared inputs or other family members. The editor toolbar's **Copy setup JSON** and **Raw** buttons export the selected target's complete setup, including shared inputs and all families. These replace the bottom JSON disclosure. Raw opens a read-only, selectable JSON overlay over the relevant family tree or editor content, refreshed from live sources while open. Close or Escape dismisses only the overlay and restores focus; covered controls are temporarily inert, not removed. JSON is generated on copy/open and relevant live notifications, not retained as initialization state.

Family copy/raw buttons overlay the tree's top-right corner; they do not occupy a separate heading row or full-width toolbar background.

Clipboard actions use the owner document's Clipboard API, with a native copy-command fallback. If neither is available, an error is shown; JSON copy failures open the raw overlay for manual copying. These are current source inputs, not an editor-owned initialization state. Do not initialize your application in the inspector.

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

## Remote inspection

The inspector can run in a different realm from the inspected page (for example a browser-extension DevTools panel) through a small JSON message protocol over any `RemoteTransport` (`send(message)` plus `subscribe(listener)`):

```ts
import {
  createInspectionAgent,
  createRemoteInspection,
  createThemeDevtools,
} from '@sabinmarcu/theme-devtools-core';

// Page side: needs DOM access only (an isolated-world content script works).
const agent = createInspectionAgent(document, pageTransport); // optional { manifests }
agent.select(element);  // report targets whose allocation root contains `element`
agent.dispose();

// Inspector side: a synchronous ThemeInspection mirror.
const inspection = createRemoteInspection(inspectorTransport, {
  scope: 'all',               // or 'selection': only targets containing the agent's selection
  onError: (message) => {},   // catalog failures and rejected patches arrive asynchronously
});
const devtools = createThemeDevtools(container, { inspection, presentation: 'embedded' });
// Later: devtools.destroy(); inspection.dispose();
```

The agent owns one headless `createThemeInspection` (discovery by default) and pushes the catalog with complete values, then per-change source/output deltas. The mirror serves reads synchronously, validates patches with the same manifest codecs (`createManifestPatchDecoder` from theme-core), and applies them optimistically until the agent acknowledges them; a rejected patch is reported through `onError` and resynchronized from the page. Messages carry `protocol: 'sabinmarcu-theme-devtools'` and `version: 1`; anything else on the channel is ignored. The agent never touches the application's JavaScript realm and the mirror never renders UI, so neither needs the other's custom elements.

`apps/theme-devtools-extension` uses this protocol for its Chrome DevTools panel and Elements sidebar.

## Isolation, CSP, realms, and reloads

The UI has its own `devtools-theme` source/formula allocations on the outer host through a private `:host` sheet. Nested shadow editors inherit those tokens, with independent spacing/font defaults rather than application values or root-font-relative `rem` units. Immutable handwritten structural CSS is embedded in TypeScript and shared only within its owner document. With no nonce, constructable sheets are used when supported; a supplied nonce selects actual nonce-bearing style elements. Mutable private allocation sheets remain per instance. Pass `nonce` when the page's policy requires it; unavailable/CSP-rejected sheets throw and failed mounts clean up rather than showing a pretend unstyled editor.

Custom elements are registered in the container document’s realm, after that realm is known. Their element-registry protocol is version `4`; this is distinct from the theme manifest wire version `2`. A document that already has incompatible `sabinmarcu-theme-devtools` or `sabinmarcu-theme-source-editor` registrations throws rather than mixing implementations. That protects HMR/reload conflicts but does not make arbitrary mismatched reload bundles compatible. Create a fresh compatible page/realm when a prior registration conflicts.

## Support status

The application theme's native CSS feature floor is described by theme-core, including modern color and typed-property behavior. The inspector itself uses custom elements, Shadow DOM, manual popovers, pointer capture, backdrop blur/saturation, and structural-sheet fallback. Native color picker alpha/P3 support and appearance vary by browser; raw CSS input preserves authored expressions until a deliberate edit. Native shipping Safari on macOS/iOS remains unverified, and final latest-code cross-engine release acceptance is still pending. Current Chromium/manual evidence is not a release or Safari compatibility claim.

Shadow inspection, persistence, undo/history, reset-to-initial values, and a separate devtools override layer are not implemented. App edits persist only while the app's current allocation lifecycle preserves its sheet; a new page/server setup can materialize configured values again.

