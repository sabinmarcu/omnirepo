---
name: Website Content Authoring
description: "Use when writing or editing website content: projects, tools, snippets, CV entries, tag descriptions, MDX metadata, CodeHike annotations, or cross-links between content types."
applyTo: "apps/website/content/**"
---

# Website Content Authoring

## Scope

Applies to authored content in [apps/website/content](../../../apps/website/content). Companion instructions:

- [website-content-translation.instructions.md](./website-content-translation.instructions.md) for locale variants.
- [website-models.instructions.md](./website-models.instructions.md) for how content is parsed into route data.
- [website.instructions.md](./website.instructions.md) for routing, i18n, and styling.

## How Files Become Pages

- One directory per collection: `projects`, `tools`, `snippets`, `tags`, `personal/cv`. Discovery is a non-recursive `readdir`; a nested folder needs its own resource type.
- The filename base is the resource `id` and joins locale variants: `example.mdx` and `example.ro.mdx` are the same resource.
- `export const slug` controls the URL segment. Keep it stable and never translate it.
- Non-`.mdx` siblings (`.tsx`, `.css.ts`, `.js`) are supporting sources, not pages. Colocate them beside the MDX that references them.

## MDX Rules

- Metadata is plain ESM: `export const title = '...'`. Do not add YAML frontmatter; it is not wired into the plugin chain and interacts badly with CodeHike.
- Structured data uses CodeHike annotation headings, not prose headings:
  - `# !name value` is a single-value annotation.
  - `# !!name value` opens a block that captures the content beneath it.
  - Child annotations use the next heading level beneath their parent, for example `## !slug annotations` inside `# !!file Annotations`.
- Annotation keywords are an English authoring contract. Never translate or rename them.
- Ordinary markdown headings feed the table of contents. Use them for real document structure only.
- Fenced code blocks render through CodeHike. Inline highlighted code uses `` _`code`_ ``; plain backticks stay unhighlighted but keep the pill styling.
- Wrap sibling code blocks in `<CodeWithTabs>` and mark each one with `` ```<lang> !!tabs <Label> `` to render them as one tabbed block. `CodeWithTabs` is registered globally, so it needs no import.
- Images colocate with their MDX and use plain markdown: `![alt](./shot.png)`. Local paths become optimized static imports; remote URLs pass through unchanged. Always write meaningful `alt`.
- Avoid `fill`-style images and animated GIFs through the optimizer; prefer sized images or `<video>` for motion.

## Common Metadata

Projects, tools, and snippets use these metadata exports in addition to their type-specific fields:

```mdx
export const title = 'Example'
export const slug = 'example'
export const tags = ['lang:typescript', 'tool:react']
export const createdAt = '04.09.2026'
export const modifiedAt = '04.09.2026'
```

- `tags` is an array of canonical, lower-case tag IDs. Use semantic namespaces such as `lang:typescript`, `tool:react`, `topics:frontend`, `project:kind:cli`, and `project:status:active`.
- `createdAt` and `modifiedAt` use `DD.MM.YYYY` calendar dates. Keep locale variants aligned with their source file.
- `!!skill` annotations are reserved for CV content. Do not use them in projects, tools, or snippets.

## Tags

- Tag description pages are taxonomy content: they represent a tag rather than carry tags themselves. They contain prose only, with no `title`, `slug`, `tags`, `createdAt`, or `modifiedAt` exports.
- Equivalences, aliases, implications, labels, and promoted tags live in [models/TagRegistry.data.ts](../../../apps/website/models/TagRegistry.data.ts), not in content. Add an alias there instead of renaming a skill in prose.
- Tag description pages live in `content/tags/` using flat dotted filenames: `skills.typescript.mdx` maps to `skills:typescript`. They contain prose only, no metadata exports.

## Projects

Location: `content/projects/<slug>.mdx`. Projects are prose articles that describe a body of work; code and screenshots are supporting evidence.

Required metadata:

```mdx
export const title = 'Forever Winter Mods'
export const slug = 'foreverwinter-mods'
export const kind = 'CLI'
export const status = 'active'
export const repo = 'https://github.com/sabinmarcu/foreverwinter-mods-cli'
export const tags = ['project:kind:cli', 'project:status:active', 'lang:typescript', 'tool:node-js']
export const createdAt = '03.09.2026'
export const modifiedAt = '04.09.2026'
```

Authoring rules:

- **Do not write a top-level `# Title`.** The route renders the metadata `title` as the `h1`, then a links section, then your content.
- Do not hand-write a repository link in prose. `repo` renders it.
- Body content starts at `##`.
- `kind` and `status` are short display values. Add matching `project:kind:*` and `project:status:*` values to `tags`.
- End the file with a trailing summary block used by cards and search excerpts:

```mdx
# !summary

One or two sentences describing the project.
```

- Optional subpages come from trailing `# !!file <Title>` blocks, each capturing the content beneath it. Add `## !slug <segment>` immediately inside the block to control the URL segment. Content before the first `!!file` belongs to the main page; there is no way to return to it afterwards.
- The main project overview does not start with an H1 because the route renders the metadata `title` as the page H1. Subpage content is rendered as authored, so after `# !!file` and its `## !slug` annotation, start the visible subpage content with `#`.
- A project with no `!!file` blocks renders as a single page with no secondary navigation. That is a supported, common case.

## Tools

Location: `content/tools/<name>.mdx`. A tool is a small running utility; the live component is the subject.

- Metadata: `title`, `slug`, `tags`, `createdAt`, `modifiedAt`.
- `### !showcase <file>.tsx` is the rendered component; `### !preview <file>.tsx` is the card preview.
- Keep the implementation in colocated `.tsx` / `.css.ts` files.

## Snippets

Location: `content/snippets/<name>.mdx`. A snippet is a case study where the code is the subject.

- Metadata: `title`, `slug`, `tags`, `createdAt`, `modifiedAt`, plus optional short intro prose.
- `### !showcase` and optional `### !preview` behave as in tools.
- Each source view is a `### !!file <Label>` block with:
  - `#### !source <file>` — the colocated file to render
  - `#### !slug <segment>` — subpage URL segment
  - `#### !lang <ext>` — when the language is not obvious
- Source files may use `#region` / `#endregion`, `#variant`, and `/** ... */` comments to split and annotate rendered sections.

## CV

Location: `content/personal/cv/`.

- `overview.mdx` holds identity and skills using `# !title`, `# !tagline`, `# !info` with `## !email`-style children, and `# !skills` with `## !!skill` entries.
- `workplace/<company>.mdx` holds one employer or grouping per file, with `export const company` and `export const location` (empty strings for personal work).
- Entries are `### !!experience <Title>` or `### !!project <Title>`, each with `####` annotations:
  - `!from`, `!to` (empty `!to` means present)
  - `!featured` to promote it
  - `!tag` for classification (`personal`, `opensource`, `academic`, `competition`, `extracurricular`)
  - `!link` for an external URL
  - `!!skill` per skill
- JSX is allowed in CV bodies (for example `Grid`, `TOCLink`) and must keep blank lines around block-level JSX.

## Linking Projects And CV

- When a CV project has a full project article, add `#### !canonical <project-slug>` to the CV entry.
- Effects of that single annotation:
  - The CV entry shows a **Full write-up** link to the project page.
  - The CV title links to the project's `repo`.
  - Search collapses both into one result, with the other location shown as an `Also in:` badge.
- Do not duplicate long prose between the CV entry and the project article. Keep the CV entry short and let the article carry the detail.

## Translations

Follow [website-content-translation.instructions.md](./website-content-translation.instructions.md). In short: `name.ro.mdx` beside `name.mdx`, same `slug`, untranslated annotation keywords, and Romanian diacritics.

## Validation

Content-only changes:

1. `yarn moon run website:build`

Changes that also touch models or routes:

1. `yarn moon run website:test`
2. `yarn moon run website:lint`
3. `yarn moon run website:build`

Note: `.mdx` files are outside the ESLint matcher; ESLint reporting them as ignored is expected.
