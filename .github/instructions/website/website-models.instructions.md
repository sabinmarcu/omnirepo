---
name: Website Content Models
description: "Use when editing apps/website/models, adding content types, MDX or source resource classes, Zod content schemas, CodeHike annotations, resource discovery, or slug/TOC generation."
applyTo: "apps/website/models/**"
---

# Website Content Models

## Scope

Applies to the resource model layer in [apps/website/models](../../../apps/website/models), which turns files under [apps/website/content](../../../apps/website/content) into route-ready data. See [website.instructions.md](./website.instructions.md) for app-wide rules and [website-content-translation.instructions.md](./website-content-translation.instructions.md) for authoring rules.

## Hierarchy

Two branches descend from `Resource`. Extend the most specialized (most derived) class that already provides the behavior you need; do not extend `Resource` or `GenericMdxResource` directly unless no subclass fits.

- MDX branch: `Resource` → `GenericMdxResource` → `MdxResource` → `ShowcaseResource` → `ToolResource` / `SnippetResource`
- Source branch: `Resource` → `SourceResource` (parses code files; deliberately separate from MDX concerns)
- Aggregate: `CVResource` extends `Resource` directly and composes `CVOverviewResource` and `CVWorkplaceResource` into a view model

| Layer | Adds |
|---|---|
| `Resource` | Discovery, locale variants, stable `id`, `locale`, `variants` |
| `GenericMdxResource` | MDX import, CodeHike `parse`, `metadataSchema` / `contentSchema` validation |
| `MdxResource` | `.mdx` filter, `slug`, static `slugs` / `fromSlug`, `title`, `toc` |
| `ShowcaseResource` | `preview` / `showcase` / `overview` composition into `SourceResource` instances |
| `SourceResource` | Code parsing, language metadata, section grouping, generated TOC |

## Adding A Content Type

1. Extend the most specialized sufficient class. Extend `ShowcaseResource` for preview/showcase pages, `MdxResource` for plain MDX collections.
2. Set `static resourceDirectory` to a path relative to the content root.
3. Narrow `static resourceFilter` when a directory holds more than one collection (see `CVOverviewResource`).
4. Assign `contentSchema` as an instance field, and `metadataSchema` only when the defaults do not fit.
5. Expose new derived data as `lazy` fields, not methods or eager properties.

## Discovery Rules

- Directory scanning goes through [readRawContentDirectory.ts](../../../apps/website/content/readRawContentDirectory.ts), which is a **non-recursive `fs.readdir`**. Nested collections need their own `resourceDirectory`; there is no global content walk.
- `resourceFilter` runs against the content-root-relative path and must exclude non-content siblings such as `.tsx` files.
- File identity comes from `explainFile` in [utils/files.ts](../../../apps/website/utils/files.ts): `id` is the filename base with the locale suffix stripped, `locale` is that suffix or the default locale.
- Use `getLocalizedList(locale)` and `fromId(id, locale)` for rendering. Use `getList()` only when every locale variant is genuinely needed.
- Set `static translatable = false` on collections that must not fall back across locales.

## Laziness And Caching

- Derived values use the `lazy` thenable from [lazy.ts](../../../apps/website/models/lazy.ts). It memoizes by default.
- **`lazy(..., { cached: false })` marks a getter with side effects. Do not treat those getters as plain data.** In [CVResource.ts](../../../apps/website/models/CVResource.ts) the uncached collection getters push entries into the page TOC as a side effect of being read. Reading them from new code silently corrupts the CV table of contents.
- For side-effect-free CV data, read `projects`, `experiences`, `degrees`, and `publications`. Avoid `featuredProjects`, `opensourceProjects`, `extendedExperiences`, and their siblings.
- Do not add new side-effecting getters. If new code needs TOC entries, extend the explicit `collectTOC()` / `tocSection()` flow instead.
- File imports are already memoized in [readRawContent.ts](../../../apps/website/content/readRawContent.ts) via `moize`. Do not add a second import cache.

## Schemas And CodeHike Annotations

- Build content schemas from the helpers in [utils/mdx.ts](../../../apps/website/utils/mdx.ts): `codehikeBlockAnnotationSchema`, `codehikeBlockArrayAnnotationSchema`, `codehikeBlockObjectAnnotationSchema`.
- Use Zod `.transform()` to flatten annotation noise into flat view-model shapes at the schema boundary, as `CV.schema.ts` does. Components should never destructure `{ title, children }` annotation wrappers.
- **`codehikeBlockArrayAnnotationSchema` returns `z.object({}).and(z.record(z.enum([key]), …))`, and a Zod record keyed by an enum requires every key.** It is not optional-friendly. Adding such an annotation to a schema whose content may omit it will fail parsing. Wrap it in an optional object field or add a dedicated optional helper, and test against a real file that omits the annotation.
- Keep annotation keywords English and stable; they are part of the authoring contract and are never translated.
- Prefer widening an existing schema over introducing a parallel one for the same content type.

## Route Integration Contract

Routes, metadata, navigation, and TOC layouts all depend on these staying stable:

- `title`, `slug`, and `toc` on MDX resources
- `Component` and `content` on `SourceResource`
- `slugs` / `fromSlug` for `generateStaticParams` and dynamic segments

Additional rules:

- Anchor generation for sub-document entries must reuse the `tocSlug` helpers in [utils/toc.ts](../../../apps/website/utils/toc.ts). Never reimplement anchor formatting; divergence produces broken deep links that no test catches.
- Keep model output render-safe for server components. `Component` payloads from `SourceResource` must stay unserialized React references, not plain data clones.
- Resource lookups are `async`. Await them in the route/layout, not inside render-time callbacks.

## Testing

- Colocate specs as `*.spec.ts` beside the model, following [Resource.spec.ts](../../../apps/website/models/Resource.spec.ts) and [MdxResource.spec.ts](../../../apps/website/models/MdxResource.spec.ts).
- Cover discovery, locale fallback, and schema parsing for every new resource type.
- Assert against real content fixtures where the parsing contract matters.

## Validation

This order overrides the app-wide order in [website.instructions.md](./website.instructions.md) for changes under [apps/website/models](../../../apps/website/models). Every resource type has colocated specs, so `website:test` always runs and runs first.

1. `yarn moon run website:test`
2. `yarn moon run website:lint`
3. `yarn moon run website:build`
