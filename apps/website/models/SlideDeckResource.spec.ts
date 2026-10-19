import { evaluate } from '@mdx-js/mdx';
import {
  recmaCodeHike,
  remarkCodeHike,
  type CodeHikeConfig,
} from 'codehike/mdx';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  Fragment,
  jsx,
  jsxs,
} from 'react/jsx-runtime';
import remarkHeadingId from '@/mdx-plugins/remarkHeadingId.js';
import remarkMdxToc from '@/mdx-plugins/remarkMdxToc.js';
import { SlideDeckResource } from './SlideDeckResource';

vi.mock('@/components/slides/SlideMdx', () => ({
  getSlideMdxComponents: () => ({}),
}));

const codeHikeConfig: CodeHikeConfig = {
  components: {
    code: 'CodehikeCode',
    inlineCode: 'CodehikeInlineCode',
  },
};

type CompiledTocEntry = {
  attributes: { id: string },
  children: CompiledTocEntry[],
  depth: number,
  value: string,
};

type CompiledDeck = Awaited<ReturnType<typeof evaluate>> & {
  toc: CompiledTocEntry[],
};

const metadata = `
export const title = 'Fixture deck'
export const slug = 'fixture-deck'
export const description = 'A compiled deck fixture.'
export const tags = ['topics:frontend']
export const createdAt = '19.10.2026'
export const modifiedAt = '19.10.2026'
`;

async function compileDeck(
  body: string,
  fixtureMetadata: string = metadata,
): Promise<CompiledDeck> {
  return evaluate(`${fixtureMetadata}\n${body}`, {
    Fragment,
    format: 'mdx',
    jsx: jsx as never,
    jsxs: jsxs as never,
    recmaPlugins: [[recmaCodeHike, codeHikeConfig]],
    remarkPlugins: [
      remarkHeadingId,
      [remarkMdxToc, { name: 'toc' }],
      [remarkCodeHike, codeHikeConfig],
    ],
  }) as Promise<CompiledDeck>;
}

function resourceFrom(module: CompiledDeck) {
  return SlideDeckResource.from(module);
}

describe('SlideDeckResource', () => {
  it('associates repeated slide titles with their emitted IDs in document order', async () => {
    const resource = resourceFrom(await compileDeck(`
# !!slide Same title

First body.

# !!slide Same title

Second body.

# !!slide Explicit identity \\{#literal-anchor\\}

Third body.

## !notes

Presenter-only context.
`));

    const [slides, presentSlides, printSlides] = await Promise.all([
      resource.slides,
      resource.presentSlides,
      resource.printSlides,
    ]);

    expect(slides).toMatchObject([
      {
        id: 'slide-same-title',
        title: 'Same title',
      },
      {
        id: 'slide-same-title-2',
        title: 'Same title',
      },
      {
        id: 'literal-anchor',
        title: 'Explicit identity',
      },
    ]);
    expect(presentSlides).toMatchObject([
      {
        id: 'slide-same-title',
        title: 'Same title',
      },
      {
        id: 'slide-same-title-2',
        title: 'Same title',
      },
      {
        id: 'literal-anchor',
        notes: expect.anything(),
      },
    ]);
    expect(printSlides).toMatchObject([
      {
        id: 'slide-same-title',
        title: 'Same title',
      },
      {
        id: 'slide-same-title-2',
        title: 'Same title',
      },
      {
        id: 'literal-anchor',
        title: 'Explicit identity',
      },
    ]);
    expect(slides[2]).not.toHaveProperty('notes');
    expect(printSlides[2]).not.toHaveProperty('notes');
  });

  it('preserves emitted heading IDs in the sidebar and excludes presenter notes', async () => {
    const resource = resourceFrom(await compileDeck(`
# !!slide First slide \\{#first-anchor\\}

## Reader heading \\{#reader-anchor\\}

Content.

## !notes

Presenter-only context.
`));

    await expect(resource.readerToc).resolves.toEqual([
      {
        attributes: { id: 'first-anchor' },
        children: [
          {
            attributes: { id: 'reader-anchor' },
            children: [],
            depth: 2,
            value: 'Reader heading',
          },
        ],
        depth: 1,
        value: 'First slide',
      },
    ]);
  });

  it('accepts slides without optional notes', async () => {
    const resource = resourceFrom(await compileDeck(`
# !!slide Unannotated \\{#unannotated\\}

This slide has no notes.
`));

    const [slides, presentSlides, printSlides] = await Promise.all([
      resource.slides,
      resource.presentSlides,
      resource.printSlides,
    ]);

    expect(slides[0]).not.toHaveProperty('notes');
    expect(presentSlides[0]).not.toHaveProperty('notes');
    expect(printSlides[0]).not.toHaveProperty('notes');
  });

  it('rejects slide annotations without a title', async () => {
    const resource = resourceFrom(await compileDeck(`
# !!slide

Body.
`));

    await expect(resource.slides).rejects.toThrow('Every `!!slide` annotation needs a title.');
  });

  it('rejects a slide/TOC count mismatch from compiled content', async () => {
    const compiled = await compileDeck(`
# !!slide First \\{#first\\}

First body.

# !!slide Second \\{#second\\}

Second body.
`);
    const resource = resourceFrom({
      ...compiled,
      toc: compiled.toc.slice(0, 1),
    });

    await expect(resource.slides).rejects.toThrow(
      'Found 2 parsed `!!slide` blocks but 1 matching depth-one TOC entries.',
    );
  });

  it('rejects missing IDs and duplicate explicit IDs emitted in the compiled TOC', async () => {
    const compiled = await compileDeck(`
# !!slide First \\{#shared\\}

First body.

# !!slide Second \\{#shared\\}

Second body.
`);
    const missingId = resourceFrom({
      ...compiled,
      toc: [{
        ...compiled.toc[0],
        attributes: {} as typeof compiled.toc[number]['attributes'],
      }, compiled.toc[1]],
    });
    const duplicateId = resourceFrom(compiled);

    await expect(missingId.slides).rejects.toThrow('has no emitted TOC ID');
    await expect(duplicateId.slides).rejects.toThrow('duplicate slide ID "shared"');
  });

  it('rejects compiled decks without a non-empty description', async () => {
    const body = `
# !!slide Fixture \\{#fixture\\}

Body.
`;
    const missingDescription = resourceFrom(await compileDeck(
      body,
      metadata.replace('export const description = \'A compiled deck fixture.\'\n', ''),
    ));
    const emptyDescription = resourceFrom(await compileDeck(
      body,
      metadata.replace('\'A compiled deck fixture.\'', '\'\''),
    ));

    await expect(missingDescription.description).rejects.toThrow('description');
    await expect(emptyDescription.description).rejects.toThrow('non-empty description');
  });

  it('uses each localized compiled deck and falls back through inherited discovery', async () => {
    const english = resourceFrom(await compileDeck(`
# !!slide English \\{#english-slide\\}

English body.
`));
    const romanianModule = await compileDeck(`
# !!slide Română \\{#romanian-slide\\}

Conținut românesc.
`);
    const romanian = resourceFrom({
      ...romanianModule,
      slug: 'fixture-deck',
    });

    Object.assign(english, {
      id: Promise.resolve('fixture-deck'),
      locale: Promise.resolve('en'),
    });
    Object.assign(romanian, {
      id: Promise.resolve('fixture-deck'),
      locale: Promise.resolve('ro'),
    });

    const ResourceWithFixtures = {
      getList: async () => [english, romanian],
    };
    const localized = await Reflect.apply(
      SlideDeckResource.getLocalizedList,
      ResourceWithFixtures,
      ['ro'],
    );
    const selected = await Reflect.apply(
      SlideDeckResource.fromSlug,
      ResourceWithFixtures,
      ['fixture-deck', 'ro'],
    );
    const fallback = await Reflect.apply(
      SlideDeckResource.fromId,
      { getList: async () => [english] },
      ['fixture-deck', 'ro'],
    );

    await expect(localized[0].slides).resolves.toMatchObject([{ id: 'romanian-slide' }]);
    await expect(selected?.slides).resolves.toMatchObject([{ id: 'romanian-slide' }]);
    await expect(fallback?.locale).resolves.toBe('en');
  });
});
