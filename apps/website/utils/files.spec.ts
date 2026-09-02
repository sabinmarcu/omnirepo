import {
  describe,
  expect,
  it,
} from 'vitest';
import { explainFile } from './files';

describe('explainFile', () => {
  it('uses the default locale and filename base for unsuffixed content', () => {
    expect(explainFile('snippets/crt-screen.mdx')).toMatchObject({
      dirname: 'snippets',
      extension: 'mdx',
      filename: 'crt-screen.mdx',
      id: 'crt-screen',
      locale: 'en',
    });
  });

  it('parses a locale-suffixed sibling without changing its stable id', () => {
    expect(explainFile('snippets/crt-screen.ro.mdx')).toMatchObject({
      dirname: 'snippets',
      extension: 'mdx',
      filename: 'crt-screen.ro.mdx',
      id: 'crt-screen',
      locale: 'ro',
    });
  });
});
