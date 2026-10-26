import {
  describe,
  expect,
  it,
} from 'vitest';
import { VFile } from 'vfile';
import remarkZoomableImageMarker from './remarkZoomableImageMarker.mjs';
import remarkZoomableImage from './remarkZoomableImage.mjs';

function paragraph(...children) {
  return {
    type: 'root',
    children: [{
      type: 'paragraph',
      children,
    }],
  };
}

function claim(tree) {
  remarkZoomableImage()(tree, new VFile());
  const [result] = tree.children;
  return result;
}

describe('zoom image marker', () => {
  it.each([
    ['!zoom A diagram', null, 'A diagram', '!zoom-image'],
    ['  !zoom A diagram  ', 'Figure 1', 'A diagram', '!zoom-image Figure 1'],
    ['!zoom', null, '', '!zoom-image'],
  ])('claims %s without leaving CodeHike image data', (alt, title, expectedAlt, expectedTitle) => {
    const image = {
      type: 'image',
      alt,
      title,
      url: './a.png',
    };
    remarkZoomableImageMarker()(paragraph(image));
    expect(image.alt).toBe(expectedAlt);
    expect(image.title).toBe(expectedTitle);
    expect(image.alt.startsWith('!')).toBe(false);
  });

  it.each(['A diagram', '!zoomed in'])('leaves %s unchanged', (alt) => {
    const image = {
      type: 'image',
      alt,
      title: 'Caption',
      url: './a.png',
    };
    const before = structuredClone(image);
    remarkZoomableImageMarker()(paragraph(image));
    expect(image).toEqual(before);
  });
});

describe('zoom image rendering', () => {
  it('preserves a local static import expression and removes the sentinel', () => {
    const source = {
      type: 'mdxJsxAttribute',
      name: 'src',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: 'image0',
        data: { estree: {} },
      },
    };
    const alt = {
      type: 'mdxJsxAttribute',
      name: 'alt',
      value: 'A',
    };
    const result = claim(paragraph({
      type: 'mdxJsxTextElement',
      name: 'img',
      attributes: [alt, source, {
        type: 'mdxJsxAttribute',
        name: 'title',
        value: '!zoom-image',
      }],
    }));
    expect(result.type).toBe('mdxJsxFlowElement');
    expect(result.name).toBe('ZoomableImage');
    expect(result.attributes).toEqual([alt, source]);
    expect(result.attributes[1]).toBe(source);
  });

  it.each([
    ['!zoom-image', []],
    ['!zoom-image Figure 1', [{
      type: 'mdxJsxAttribute',
      name: 'title',
      value: 'Figure 1',
    }]],
  ])('renders remote images with title %s', (title, extra) => {
    const result = claim(paragraph({
      type: 'image',
      url: 'https://example.com/a.png',
      alt: 'A',
      title,
    }));
    expect(result.name).toBe('ZoomableImage');
    expect(result.attributes).toEqual([
      {
        type: 'mdxJsxAttribute',
        name: 'src',
        value: 'https://example.com/a.png',
      },
      {
        type: 'mdxJsxAttribute',
        name: 'alt',
        value: 'A',
      },
      ...extra,
    ]);
  });

  it.each(['A caption', null])('leaves ordinary images with title %s unchanged', (title) => {
    const tree = paragraph({
      type: 'image',
      url: './a.png',
      alt: 'A',
      title,
    });
    const before = structuredClone(tree);
    claim(tree);
    expect(tree).toEqual(before);
  });

  it('rejects prose alongside a zoom image', () => {
    expect(() => claim(paragraph({
      type: 'text',
      value: 'text ',
    }, {
      type: 'image',
      url: './a.png',
      alt: 'A',
      title: '!zoom-image',
    })))
      .toThrow('A "!zoom" image must be the only content of its paragraph.');
  });

  it('rejects multiple zoom images in one paragraph', () => {
    expect(() => claim(paragraph(...['a', 'b'].map((alt) => ({
      type: 'image',
      url: './a.png',
      alt,
      title: '!zoom-image',
    })))))
      .toThrow('A "!zoom" image must be the only content of its paragraph.');
  });

  it('allows whitespace siblings and preserves the paragraph source position', () => {
    const tree = paragraph({
      type: 'text',
      value: ' \n ',
    }, {
      type: 'image',
      url: './a.png',
      alt: '',
      title: '!zoom-image',
    });
    const position = {
      start: {
        line: 2,
        column: 1,
      },
      end: {
        line: 2,
        column: 30,
      },
    };
    const [node] = tree.children;
    node.position = position;
    const result = claim(tree);
    expect(result.name).toBe('ZoomableImage');
    expect(result.position).toBe(position);
    expect(result.attributes.find((attribute) => attribute.name === 'alt').value).toBe('');
  });
});
