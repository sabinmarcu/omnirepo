---
name: Website Content Translation
description: "Use when creating or translating website MDX content, adding locale variants, or editing apps/website/content."
applyTo: "apps/website/content/**"
---

# Website Content Translation

- Create Romanian translations as locale-suffixed siblings: `example.ro.mdx` next to `example.mdx`.
- Keep the filename base stable. It is the resource `id` used to join locale variants.
- Do not translate `export const slug`; it is the stable join key for locale switching. A localized slug is an explicit future choice.
- Do not translate CodeHike annotation keywords or source references, including `!showcase`, `!source`, `!slug`, `!from`, and `!to`.
- Keep shared `.tsx` and `.list.tsx` source files beside the content. Do not duplicate them for a locale.
- Preserve every explicit heading ID from the English source. Translate the printed heading text, but retain its `{#english-derived-id}` anchor.
- In CV content, never translate experience titles, company names, project names, or tool names. Keep their English source text verbatim.
- Keep technical product names, programming-language names, file names, commands, API names, and code identifiers in English unless the surrounding text requires an established Romanian rendering.
- Use Romanian diacritics: `ă`, `â`, `î`, `ș`, and `ț`.

## Related

- [website.instructions.md](./website.instructions.md) for app-wide routing, i18n, and styling rules.
- [website-models.instructions.md](./website-models.instructions.md) for how content files are discovered and parsed.
