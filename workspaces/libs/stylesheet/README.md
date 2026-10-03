# @sabinmarcu/stylesheet

Platform-only server serialization and browser CSSOM updates. The root entry point and its public types do not import React or Vanilla Extract. React SSR delivery is optional through `@sabinmarcu/stylesheet/react`.

```ts
import { createStylesheet } from '@sabinmarcu/stylesheet';

// Create server state per request; do not share mutable state across requests.
const stylesheet = createStylesheet({
  id: 'application-theme',
  debugId: 'themeValues',
  nonce: requestNonce,
  rules: [{ selector: ':root', layer: 'theme', rules: { '--theme-size': '8px' } }],
});

const html = stylesheet.raw; // Emit before first paint.
const live = stylesheet.mount(document); // Adopts SSR values, never resets them.
live.update([{ selector: ':root', layer: 'theme', rules: { '--theme-size': '12px' } }]);
live.read(':root', '--theme-size', 'theme'); // '12px'
live.snapshot(); // Current { css, html }, not construction-time contents.
const unsubscribe = live.subscribe((current) => console.log(current.css));
```

`id` is the ownership key (`data-stylesheet-id`), unique within each attachment `Document` or `ShadowRoot`. `debugId` supplies the observable `data-stylesheet` label; it is not used for lookup. Duplicate matching nodes and ambiguous matching selector/layer rules throw instead of updating an arbitrary match. Do not use the same ownership key for unrelated renderers.

`mount(root)` returns independently mutable browser state for that root. The server factory remains separate; browser callers update/read the mounted handle. Creation uses the supplied root's owner document and realm, not the global document. Private shadow allocation uses rules targeting `:host` and `mount(shadowRoot)`; document allocation uses its declared selector (normally `:root`). No mutable sheet is shared between hosts/documents.

Declaration names are CSS names (kebab-case or custom properties). Strings/numbers are serialized as supplied; no implicit units. `{ value, priority: 'important' }` expresses priority; `null` removes a declaration. Updates accept readonly arrays, preserve omitted declarations, and commit all supplied patches together. Server state owns structured rules; browser state uses current CSSOM, retaining unrelated descendant, media, keyframe, import, and layered rules. A failed browser batch restores the preceding sheet without notifying subscribers. Serialized node text is refreshed once per successful commit for text-based mirrors. CSSOM handles are reacquired after replacement. Subscriptions receive current owner state once after each nonempty commit, not a detached values object.

Browser subscriptions attach to the owned style element. Independently adopted handles and duplicated modules receive the same realm-correct `stylesheet:commit` event (exported as `stylesheetCommitEvent`) after a successful commit; each callback receives its own current handle. Unsubscription removes the element listener. Failed or empty batches emit no event. Server subscriptions remain local and request-isolated. This lets app and optional inspection consumers share one update path without a global runtime registry.

`readMany(selector, properties, layer?)` resolves ownership and the exact selector/layer rule once, returning current declarations for all requested properties (missing declarations are `undefined`). Layer-kind detection uses native rule identity, never `cssText` serialization. Selector canonicalization caches grammar only; CSSOM/value handles are not retained across text replacement.

Subscriptions receive `(current, change)`. `StylesheetChange.rules` contains immutable, deduplicated selector/layer/property-key records for the committed batch, including removed declarations; it contains no values. Browser `stylesheet:commit` is an owner-realm `CustomEvent` carrying the same detail. Writes still patch the original owned stylesheet, synchronize its current text, and retain existing rollback/mirroring behavior—no inline override layer is involved.

Nonces are carried into new browser nodes and SSR output. Adoption preserves the existing node's nonce and observable label. HTML attributes are escaped and style end-tag openers are CSS-escaped to prevent raw-text breakout without changing range-query operators. Inputs are authored CSS, not a sanitizer for untrusted CSS programs; source codecs must validate application inputs before constructing declarations. A CSP-blocked/unavailable stylesheet throws; a newly created unavailable node is removed, while an existing adopted node is left intact.

Optional React SSR:

```tsx
import { Stylesheet } from '@sabinmarcu/stylesheet/react';

<Stylesheet stylesheet={stylesheet} nonce={requestNonce} />;
```

## Migration

- `createStylesheet` requires `id`; use `debugId` only as an optional observable label.
- Replace `legacyRender(root)` with `mount(root)` and retain/use its returned handle for browser updates.
- Factory `.update()` updates server state only. Mounted `.update()` commits live browser state.
- Replace factory `.Component` with the optional `/react` `Stylesheet` wrapper. Arbitrary React children no longer replace CSS.
- `.raw` and `.snapshot()` always serialize the current state of their owner. Omitted nonces do not emit an `undefined` attribute.
