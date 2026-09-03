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
      content: Promise.resolve({
        summary: {
          title: 'summary',
          children: 'Card summary',
        },
        file: [
          {
            title: 'Installing',
            children: 'Install',
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
    });
    await expect(project.getPage('installing')).resolves.toMatchObject({
      toc: [expect.objectContaining({ value: 'Installing' })],
    });
    await expect(project.summary).resolves.toBe('Card summary');
  });

  it('uses raw MDX content when the project has no sections', async () => {
    const project = ProjectResource.from({});
    Object.assign(project, {
      title: Promise.resolve('Single page'),
      slug: Promise.resolve('single-page'),
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
