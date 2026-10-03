# @sabinmarcu/theme-family

Generic family composition over `@sabinmarcu/theme-core`. No concrete schema, React, or Vanilla Extract production dependency. Generator descriptors decide shared/contextual scope; applications choose names and values, not a `vary` list.

```ts
import { defineTheme, gridGenerator, paletteGenerator } from '@sabinmarcu/theme-core';
import { createThemeFamily } from '@sabinmarcu/theme-family';

const theme = defineTheme({
  scene: { tint: paletteGenerator(), density: gridGenerator() },
});
const family = createThemeFamily(theme, {
  id: 'demo',
  families: ['night', 'ocean'],
  nonce: requestNonce,
});

family({
  shared: { scene: { density: 16 } },
  families: {
    base: { scene: { tint: '#0cf' } },
    night: { scene: { tint: { light: '#eee', dark: '#222' } } },
  },
}); // Returns theme.contract itself. Ocean uses its own descriptor defaults.
family.pick('night'); // Select the default root mapping without editing member sources.
const html = family.stylesheet.raw; // SSR delivery before first paint.

const live = createThemeFamily(theme, { id: 'demo', families: ['night', 'ocean'] })
  .mount(document); // Adopt current SSR values, mappings, and nonce.
live.update({ families: { night: { scene: { tint: { dark: '#f0c' } } } } });
const currentInputs = live.read(); // Complete { shared, families: { base, night, ocean } }.
```

## Scope and defaults

Scope partitions are derived per variable descriptor, including mixed nested branches. Static descriptors are excluded from all source inputs and private member graphs, but remain accessible through the original public contract and member views before rendering.

- `shared` contains shared-scope sources allocated once outside all members.
- `families.<member>` contains only that member's contextual sources/formulas.
- `base` is built in and ordinary: it does not provide defaults or current values to any other member.
- Each member resolves missing initial fields from its own descriptor defaults. Required sources without defaults must be supplied for every member, even inactive members.
- Later setup calls and `update` patch only supplied fields. Scalar light/dark shorthand edits both bindings; partial variant edits preserve the other current variant. Opaque codec inputs remain complete replacements.
- Shared/contextual/static/derived payload placement is validated at runtime and by compiler-derived input types. Null groups, unknown members, and unknown containers are not treated as omissions.

Names and configuration IDs are validated lowercase kebab namespaces. User-supplied `base`, duplicate names, `constructor`, `prototype`, and `__proto__` are rejected. Members named `shared` or `families` are legal because values have explicit containers. Flattened allocation collisions are rejected even when individual names are otherwise valid.

## Rendering and selection

The family layer partitions existing compiled definitions, rebases input/output paths and symbolic dependencies, then binds private allocations under `--<prefix>-family-<id>-*`. It never reruns generators, recompiles their formulas, or rewrites authored CSS strings. Sources and formulas for all members are co-located at the harness's designated root.

Shared public references map once to the shared graph. Complete contextual public output trees map to the selected root-allocated member graph; scoped selections map both source-facing and derived public outputs. A descendant does not override a private source and hope an inherited formula rebinds. This preserves independently computed outputs for nested family/variant sections.

Default selection is `base`. `pick(member, selector?)` updates only public contextual aliases at the declared selector (the harness allocation root by default); source values never change. Explicit `data-theme-family` scopes select their own member and override the default root mapping by normal CSS specificity. `data-theme-variant="light"`/`"dark"` and system attribute removal retain core variant behavior. Shared edits intentionally affect all scopes; a contextual edit affects only its own member/variant, selected or inactive.

Setup, updates, picks, SSR serialization, browser adoption, document realms, shadow-host delivery, nonces, current reads, and notifications use the same core/stylesheet backend. Initial structural mappings are committed together with all source/formula allocations; updates commit all supplied source edits once. No input cache, devtools values store, or inspection manifest controls normal rendering.

`mount(Document | ShadowRoot)` returns independent mutable state. Use an explicit document allocation selector when needed, or `:host` for private shadow rendering. Configurations qualify private names by ID; public aliases also participate in root ownership, so two unrelated configurations cannot compete for the same public contract on one allocation root. Independent roots/hosts may reuse a prefix safely.

## Public views and optional source inspection

- `contract`: the original `theme.contract`, unchanged by setup or selection.
- `families`: immutable member list including built-in `base`.
- `selectors`: member-specific `[data-theme-family="..."]` selectors.
- `themes[member]`: plain mixed contract view with private contextual references, original shared references, and static output. It is not another live theme/value store. Assign variable-only subtrees with Vanilla Extract helpers, not whole views that include static queries.
- `stylesheet` / `selector`: the current owned sheet and allocation selector for this harness.
- `bindings`: immutable JSON-safe source records with `name`, complete `inputPath` (including variant leaf when applicable), intrinsic `scope`, contextual `member`, `variant`, and `generatorPath`. Paths follow `shared.*` and `families.<member>.*`. They contain no current/default values or executable codecs; derived/static outputs are absent.
- `FamilyInput`, `FamilyPatch`, `ResolvedFamilyInput`, and `ScopeSchema`: descriptor-derived scope and source projections; no blanket recursive partial promises.
- `manifest()`: version-2 JSON-safe root/sheet, source codec/editor, family/variant, and public read-only output metadata. It projects the actual private allocation graph plus the original public namespace/static configuration; no current/default source values are stored.

`family.manifest()` feeds `embedThemeManifests` or `createThemeInspection` from theme-core. Both delivery paths share validation and light-DOM-only access; neither authorizes private UI or shadow inspection. Inspection exports complete `{ shared, families }` inputs, including empty source containers and inactive members. Source patches preserve omitted current members/variants and never borrow `base` values. Catalog replacement/disposal leaves app allocations and edits intact. Core and concrete theme code never import this package; family projection owns rebased naming and member metadata.

For optional editor integration, use the [native devtools guide](../theme-devtools-core/README.md) or [React devtools guide](../theme-devtools-react/README.md); the editor receives only the declared manifest access boundary.

## Release boundary

Native Safari/macOS/iOS and latest-code cross-engine release acceptance remain open. This package does not imply support beyond the browser features required by its core and stylesheet dependencies.

