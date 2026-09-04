import {
  Fragment,
  createElement,
} from 'react';
import {
  describe,
  expect,
  it,
} from 'vitest';
import { ProjectResource } from './ProjectResource';

describe('ProjectResource', () => {
  it('partitions its TOC at inline file sections', async () => {
    const project = ProjectResource.from({});
    Object.assign(project, {
      title: Promise.resolve('Video Trimmer'),
      slug: Promise.resolve('video-trimmer'),
      metadata: Promise.resolve({
        entryDepth: 2,
        maxDepth: 3,
      }),
      content: Promise.resolve({
        summary: {
          title: 'summary',
          children: 'Card summary',
        },
        file: [
          {
            title: 'Installing',
            children: 'Install',
            entrydepth: {
              title: 3,
              children: undefined,
            },
            maxdepth: {
              title: 4,
              children: undefined,
            },
          },
          {
            title: 'Usage',
            children: 'Use',
          },
        ],
        children: 'Introduction',
      }),
      rawMdxContent: Promise.resolve('Unused raw content'),
      toc: Promise.resolve([
        {
          depth: 1,
          value: 'Video Trimmer',
          attributes: { id: 'video-trimmer' },
          children: [
            {
              depth: 3,
              value: '!!file Installing',
              attributes: { id: 'file-installing' },
              children: [],
            },
          ],
        },
        {
          depth: 1,
          value: 'Installing',
          attributes: { id: 'installing' },
          children: [],
        },
        {
          depth: 3,
          value: '!!file Usage',
          attributes: { id: 'file-usage' },
          children: [],
        },
        {
          depth: 1,
          value: 'Usage',
          attributes: { id: 'usage' },
          children: [],
        },
      ]),
    });

    await expect(project.subpages).resolves.toEqual([
      { slug: 'installing' },
      { slug: 'usage' },
    ]);
    await expect(project.getPage('video-trimmer')).resolves.toMatchObject({
      toc: [expect.objectContaining({ value: 'Video Trimmer' })],
      entryDepth: 2,
      maxDepth: 3,
    });
    await expect(project.getPage('installing')).resolves.toMatchObject({
      toc: [expect.objectContaining({ value: 'Installing' })],
      entryDepth: 3,
      maxDepth: 4,
    });
    await expect(project.getPage('usage')).resolves.toMatchObject({
      entryDepth: 2,
      maxDepth: 3,
    });
    await expect(project.summary).resolves.toBe('Card summary');
  });

  it('uses slug annotation content when the file annotation body is empty', async () => {
    const project = ProjectResource.from({});
    Object.assign(project, {
      title: Promise.resolve('Current Website'),
      slug: Promise.resolve('current-website'),
      metadata: Promise.resolve({ maxDepth: 3 }),
      content: Promise.resolve({
        file: [
          {
            title: 'Typography',
            children: createElement(Fragment),
            slug: {
              title: 'typography',
              children: 'Rendered typography content',
            },
          },
        ],
        children: 'Overview',
      }),
      rawMdxContent: Promise.resolve('Unused raw content'),
      toc: Promise.resolve([
        {
          depth: 1,
          value: '!!file Typography',
          attributes: { id: 'file-typography' },
          children: [],
        },
        {
          depth: 2,
          value: 'Heading Two',
          attributes: { id: 'heading-two' },
          children: [],
        },
      ]),
    });

    await expect(project.getPage('typography')).resolves.toMatchObject({
      content: 'Rendered typography content',
      toc: [expect.objectContaining({ value: 'Heading Two' })],
      maxDepth: 3,
    });
  });

  it('uses unary depth annotation content when the file annotation body is empty', async () => {
    const project = ProjectResource.from({});
    Object.assign(project, {
      title: Promise.resolve('Current Website'),
      slug: Promise.resolve('current-website'),
      metadata: Promise.resolve({}),
      content: Promise.resolve({
        file: [{
          title: 'Annotations',
          children: createElement(Fragment),
          entrydepth: {
            title: 2,
            children: 'Rendered annotations content',
          },
        }],
        children: 'Overview',
      }),
      rawMdxContent: Promise.resolve('Unused raw content'),
      toc: Promise.resolve([]),
    });

    await expect(project.getPage('annotations')).resolves.toMatchObject({
      content: 'Rendered annotations content',
      entryDepth: 2,
    });
  });

  it('uses raw MDX content when the project has no sections', async () => {
    const project = ProjectResource.from({});
    Object.assign(project, {
      title: Promise.resolve('Single page'),
      slug: Promise.resolve('single-page'),
      metadata: Promise.resolve({}),
      content: Promise.resolve({
        children: undefined,
      }),
      rawMdxContent: Promise.resolve('Single-page content'),
      toc: Promise.resolve([]),
    });

    await expect(project.subpages).resolves.toEqual([]);
    await expect(project.getPage('single-page')).resolves.toMatchObject({
      content: 'Single-page content',
    });
  });

  it('uses parsed root content when a trailing summary is present', async () => {
    const project = ProjectResource.from({});
    Object.assign(project, {
      title: Promise.resolve('Summary'),
      slug: Promise.resolve('summary'),
      metadata: Promise.resolve({}),
      content: Promise.resolve({
        summary: {
          title: 'summary',
          children: 'Card summary',
        },
        children: 'Page content',
      }),
      rawMdxContent: Promise.resolve('Page content and summary'),
      toc: Promise.resolve([]),
    });

    await expect(project.getPage('summary')).resolves.toMatchObject({
      content: 'Page content',
    });
    await expect(project.summary).resolves.toBe('Card summary');
  });
});
