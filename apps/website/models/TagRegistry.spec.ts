import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  canonicalTag,
  expandTags,
  tagKind,
  resolveTag,
  tagRegistry,
  validateRegistry,
  type TagRegistry,
} from './TagRegistry';
import { observedTags } from './tagInventory.generated';

describe('TagRegistry', () => {
  it('expands implied topics transitively', () => {
    expect(expandTags(['skills:react'])).toEqual([
      'lang:typescript',
      'skills:react',
      'topics:frontend',
    ]);
  });

  it('reports implication cycles with their chain', () => {
    const cyclicRegistry: TagRegistry = {
      alpha: { implies: ['beta'] },
      beta: { implies: ['alpha'] },
    };

    expect(() => expandTags(['alpha'], cyclicRegistry)).toThrow('alpha -> beta -> alpha');
  });

  it('resolves aliases while allowing unknown tags', () => {
    expect(resolveTag('skills', 'ReactJS')).toBe('skills:react');
    expect(resolveTag('skills', 'Some Unheard Of Thing')).toBe('skills:some-unheard-of-thing');
  });

  it('preserves direct tag IDs ahead of another tag\'s alias', () => {
    const registry: TagRegistry = {
      'skills:angular': { label: 'Angular' },
      'skills:angularjs': { aliases: ['angular'] },
    };

    expect(resolveTag('skills', 'Angular', registry)).toBe('skills:angular');
    expect(resolveTag('skills', 'AngularJS', registry)).toBe('skills:angularjs');
  });

  it('inherits kind from its namespace while allowing an override', () => {
    const registry: TagRegistry = {
      lang: { kind: 'language' },
      skills: { kind: 'skill' },
      topics: { kind: 'topic' },
      'lang:typescript': { kind: 'tag' },
    };

    expect(tagKind('lang:css', registry)).toBe('language');
    expect(tagKind('skills:react', registry)).toBe('skill');
    expect(tagKind('topics:frontend', registry)).toBe('topic');
    expect(tagKind('lang:typescript', registry)).toBe('tag');
    expect(tagKind('opensource', registry)).toBe('tag');
  });

  it('resolves canonical equivalents while retaining their direct override', () => {
    const registry: TagRegistry = {
      'skills:typescript': { canonical: 'lang:typescript' },
      'lang:typescript': { label: 'TypeScript' },
    };

    expect(canonicalTag('skills:typescript', registry)).toBe('lang:typescript');
    expect(expandTags(['skills:typescript'], registry)).toEqual(['lang:typescript']);
  });

  it('rejects invalid registry references and namespace collisions', () => {
    expect(() => validateRegistry([], {
      alpha: { implies: ['missing'] },
    })).toThrow('Unresolvable implied tag');
    expect(() => validateRegistry(['skills'], {})).toThrow('Bare tag collides with namespace');
    expect(() => validateRegistry([], {
      lang: { label: 'Language' },
    })).toThrow('Namespace definition cannot include tag metadata');
    expect(() => validateRegistry([], {
      'skills:typescript': { canonical: 'lang:typescript' },
    })).toThrow('Unresolvable canonical tag');
    expect(() => validateRegistry([], {
      alpha: { canonical: 'beta' },
      beta: { canonical: 'alpha' },
    })).toThrow('Tag canonical cycle');
  });

  it('accepts the application registry', () => {
    expect(() => validateRegistry(observedTags, tagRegistry)).not.toThrow();
  });
});
