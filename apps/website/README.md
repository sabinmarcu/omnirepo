This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Content Model Types

`MdxResource.variants` has an explicit `Lazy<MdxResource[]>` type so project, snippet, and tool metadata callbacks can use each variant's `locale` and `slug` without route-level casts. Preserve this type boundary when changing locale discovery.

## Content Cards

`components/ContentCard.tsx` owns the shared Projects-style structure: title/kind header, metadata and optional badge rows, summary, and tag footer. `ProjectCard`, the Slides list, and `SearchResultCard` pass their resolved content into those slots instead of recreating the layout. Resource loading, localized date labels, project status/deprecation badges, and search navigation callbacks remain in the callers.

Shared layout styles live in `ContentCard.css.ts`; `ProjectCard.css.ts` only owns project-specific status appearance. Tag footers wrap with a `theme.grid.m` gap. The deck Read-page metadata tags use a wrapping row with a `theme.grid.s` gap.

## Slides

The localized `/slides` section uses the existing MDX and CodeHike pipeline. The initial deck is `/slides/website-slides-demo`, with an English source and a Romanian sibling under `content/slides/`.

| URL | Behavior |
| --- | --- |
| `/slides` | Discover decks by title, description, dates, and tags |
| `/slides/[slug]` | Canonical, server-rendered reading view with slide anchors and the existing TOC sidebar; no inline Contents or back-to-list link |
| `/slides/[slug]/present` | Server-rendered slide content enhanced by route-local reveal.js, without a navigation-hint banner |
| `/slides/[slug]/print` | Static handout and print CSS; use browser Print/Save as PDF |

All paths use the existing locale/domain routing. Present and Print canonicalize to Read; only listing and Read pages are indexed. There are no generated PDF downloads, export tasks, or publishing-time assets.

The Slides listing renders only cards, without a separate heading or intro. Projects, Slides, and search results share `ContentCard` structure and the Projects showcase grid. The search page uses the full available width; global quick-search results use the same shared `SearchResultCard` in a responsive single-column dropdown.

The Read overview is ordered as slide count, title, localized created/updated dates, wrapping tags in a full-width `PageLayout.Inset`, description, Present/Print button-style links, and the slides. The navigation links retain presentation prefetching disabled; the existing TOC sidebar is retained.

### Authoring a deck

Add flat `content/slides/<name>.mdx` and optional `<name>.ro.mdx` files. Export the normal published-content metadata plus a non-empty `description`. Keep the deck slug unchanged across locales; maintain `createdAt`/`modifiedAt` in `DD.MM.YYYY` format.

```mdx
export const title = 'A technical talk'
export const slug = 'technical-talk'
export const description = 'What this presentation explains.'
export const tags = ['topics:frontend']
export const createdAt = '19.10.2026'
export const modifiedAt = '19.10.2026'

# !!slide The first idea

Normal Markdown, fenced code, images, and MDX components go here.

## !notes

Presenter context, omitted from Read and Print.

# !!slide The next idea

The next slide's content.
```

`SlideDeckResource` associates the compiled TOC's depth-one `!!slide` entries with CodeHike blocks in document order. It consumes `attributes.id` verbatim: do not author a per-slide `!slug`, re-slug titles, or strip annotation markers from IDs. The heading adapter deduplicates generated IDs in slide documents while preserving explicit heading IDs and leaving other collections unchanged. Renaming or translating headings can change anchors; explicit duplicate IDs are rejected.

### Rendering policies and components

- Read and Print render code on the server, expand folds, and show all code-tab and package-manager variants as labeled blocks. They do not require reveal.js, browser syntax highlighting, or diagram rendering to display content. The Next.js application shell still ships its normal JavaScript.
- Present enables code controls, fragments, notes (`S`), overview (`Esc`), fullscreen (`F`, where the browser supports it), and keyboard/touch navigation. It stays in slide mode at narrow widths rather than switching to reveal.js's scroll view. Its controller enhances the demonstration counter; that interaction is not needed to read the static example.
- Existing `CodeWithTabs` and `!package` fences remain the authoring API. Present renders them with the shared `CodeTabs`/`Code` primitives inside a slide-local wrapper, not the article `PageLayout.Inset` subgrid. Use a real supported `install` or `exec` operation; no separate highlighter or Markdown parser is introduced.
- `SlideFragment` reveals its children incrementally in Present and displays them immediately in Read/Print. `SlideColumns` provides a responsive two-column layout. `SlideSwatches` displays actual theme tokens.
- `SlideInteractiveDemo` accepts `label` and `staticLabel`; only Present supplies its interactive controls. Essential information must also have a static explanation.
- `SlideDiagram` accepts a `chart` string and descriptive `label`. It renders inline SVG on the server with `beautiful-mermaid`, using existing CSS theme variables and locally served website fonts, without remote font imports. Mermaid fences use that same slide renderer. Supported syntax is the library's flowchart, state, sequence, class, ER, and XY chart subset; use a newline after the diagram header. Invalid/unsupported diagrams fail rendering rather than falling back to a browser engine. Other website collections keep their existing Mermaid component.

The `slides` family uses its configured red-family accents and the existing root-owned light/dark/system setup. CodeHike retains its CSS-driven light/dark syntax palettes; those colors are not derived from the section primary. Slide styles are scoped to this section.

### Local verification

Run `yarn vitest --run --project @sabinmarcu/website`, `yarn moon run website:build`, and `yarn eslint --fix` for edited source files. The current website Moon configuration does not expose inherited lint/test tasks.

For browser verification, check both locales and JavaScript-disabled Read/Print. Read retains `TOCLayout` and its sidebar, without a duplicate inline Contents block or Back to slides link. Present has no navigation-hint banner; verify named code tabs and package-manager tabs, fragments, keyboard/touch navigation, and teardown after returning to Read. Check light/dark/system selection and the shared Projects grid on Slides, search pages, and quick-search results.

Browser Print/Save as PDF should produce one 16:9 page per slide, with all static code variants visible and speaker notes/controls excluded. Chromium checks do not establish Safari/WebKit compatibility; confirm iPadOS behavior on the actual device.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
