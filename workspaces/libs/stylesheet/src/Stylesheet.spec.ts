import {
  describe,
  expect,
  it,
} from 'vitest';
import { createStylesheet } from './Stylesheet.js';

describe('createStylesheet server state', () => {
  it('owns caller rules and merges duplicate initial selector/layer rules in first position', () => {
    const rules: Array<{
      selector: string;
      layer?: string;
      rules: Record<string, string | number>;
    }> = [
      {
        selector: '.shared',
        rules: { color: 'red' },
      },
      {
        selector: '.following',
        rules: { display: 'block' },
      },
      {
        selector: '.shared',
        rules: { padding: '1rem' },
      },
      {
        selector: '.shared',
        layer: 'utilities',
        rules: { color: 'green' },
      },
      {
        selector: '.shared',
        layer: 'utilities',
        rules: { margin: 0 },
      },
    ];

    const stylesheet = createStylesheet({
      id: 'owned-rules',
      rules,
    });
    rules[0]!.rules.color = 'changed-by-caller';

    expect(stylesheet.read('.shared', 'color')).toBe('red');
    expect(stylesheet.read('.shared', 'padding')).toBe('1rem');
    expect(stylesheet.read('.shared', 'color', 'utilities')).toBe('green');
    expect(stylesheet.read('.shared', 'margin', 'utilities')).toBe('0');
    expect(stylesheet.css.indexOf('.shared {')).toBeLessThan(
      stylesheet.css.indexOf('.following {'),
    );
  });

  it('reads requested declarations from one selector and layer including missing values', () => {
    const stylesheet = createStylesheet({
      id: 'batch-read',
      rules: [{
        selector: '.shared',
        rules: { color: 'red' },
      }, {
        selector: '.shared',
        layer: 'utilities',
        rules: {
          color: 'green',
          padding: '1rem',
        },
      }],
    });

    const declarations = stylesheet.readMany('.shared', ['color', 'margin', 'padding'], 'utilities');

    expect(declarations.color).toBe('green');
    expect(declarations.margin).toBeUndefined();
    expect(declarations.padding).toBe('1rem');
    expect(Object.keys(declarations)).toEqual(['color', 'margin', 'padding']);
  });

  it('preserves selectors, layers, and omitted declarations across repeated patches without mutating the caller array', () => {
    const stylesheet = createStylesheet({
      id: 'patches',
      rules: [
        {
          selector: '.card',
          rules: {
            color: 'red',
            margin: 0,
          },
        },
        {
          selector: '.card',
          layer: 'utilities',
          rules: {
            color: 'black',
            '--spacing': '0.5rem',
          },
        },
      ],
    });
    const patches = [
      {
        selector: '.card',
        rules: {
          color: {
            value: 'blue',
            priority: 'important' as const,
          },
        },
      },
      {
        selector: '.card',
        layer: 'utilities',
        rules: { '--spacing': '1rem' },
      },
      {
        selector: '.card',
        rules: { padding: '2rem' },
      },
    ];

    stylesheet.update(patches);

    expect(patches).toEqual([
      {
        selector: '.card',
        rules: {
          color: {
            value: 'blue',
            priority: 'important',
          },
        },
      },
      {
        selector: '.card',
        layer: 'utilities',
        rules: { '--spacing': '1rem' },
      },
      {
        selector: '.card',
        rules: { padding: '2rem' },
      },
    ]);
    expect(stylesheet.read('.card', 'margin')).toBe('0');
    expect(stylesheet.read('.card', 'padding')).toBe('2rem');
    expect(stylesheet.read('.card', 'color', 'utilities')).toBe('black');
    expect(stylesheet.read('.card', '--spacing', 'utilities')).toBe('1rem');
    expect(stylesheet.css).toMatch(/color:\s*blue\s*!important;/);
  });

  it('removes declarations set to null without affecting the remaining rule', () => {
    const stylesheet = createStylesheet({
      id: 'removal',
      rules: [
        {
          selector: '.notice',
          rules: {
            color: 'red',
            margin: '1rem',
          },
        },
      ],
    });

    stylesheet.update([
      {
        selector: '.notice',
        rules: { margin: null },
      },
    ]);

    expect(stylesheet.read('.notice', 'margin')).toBeUndefined();
    expect(stylesheet.read('.notice', 'color')).toBe('red');
    expect(stylesheet.css).not.toMatch(/margin\s*:/);
  });

  it('keeps css, raw output, and snapshots current after updates', () => {
    const stylesheet = createStylesheet({
      id: 'live-output',
      rules: [{
        selector: '.status',
        rules: { color: 'red' },
      }],
    });
    const before = stylesheet.snapshot();
    const rawBefore = stylesheet.raw;

    stylesheet.update([
      {
        selector: '.status',
        rules: { color: 'green' },
      },
    ]);
    const after = stylesheet.snapshot();

    expect(stylesheet.css).toContain('green');
    expect(stylesheet.raw).toContain('green');
    expect(stylesheet.raw).not.toBe(rawBefore);
    expect(after.css).toContain('green');
    expect(after.html).toContain('green');
    expect(before.css).toContain('red');
    expect(before.html).toContain('red');
  });

  it('keeps SSR state isolated between stylesheet instances', () => {
    const first = createStylesheet({
      id: 'request-owned',
      rules: [{
        selector: '.shared',
        rules: { color: 'red' },
      }],
    });
    const second = createStylesheet({
      id: 'request-owned',
      rules: [{
        selector: '.shared',
        rules: { color: 'blue' },
      }],
    });

    first.update([{
      selector: '.shared',
      rules: { color: 'green' },
    }]);

    expect(first.read('.shared', 'color')).toBe('green');
    expect(second.read('.shared', 'color')).toBe('blue');
    expect(second.snapshot().html).toContain('blue');
    expect(second.snapshot().html).not.toContain('green');
  });

  it('serializes nonce and attributes without allowing style-tag or attribute injection', () => {
    const stylesheet = createStylesheet({
      id: 'server" data-injected="id',
      debugId: 'label" data-injected="label',
      nonce: 'nonce" data-injected="nonce',
      rules: [
        {
          selector: '.safe',
          rules: {
            content: '"</style><script data-injected="script">run()</script>"',
          },
        },
      ],
    });
    const defaultHtml = stylesheet.snapshot().html;
    const { html } = stylesheet.snapshot('override" data-injected="override');

    expect(defaultHtml).toContain('nonce="nonce&quot; data-injected=&quot;nonce"');
    expect(html).toContain('data-stylesheet-id="server&quot; data-injected=&quot;id"');
    expect(html).toContain('data-stylesheet="label&quot; data-injected=&quot;label"');
    expect(html).toContain('nonce="override&quot; data-injected=&quot;override"');
    expect(html).not.toContain(' data-injected="id"');
    expect(html).not.toContain(' data-injected="label"');
    expect(html).not.toContain(' data-injected="override"');
    expect(defaultHtml).not.toContain(' data-injected="nonce"');
    expect(html.match(/<\/style>/g)).toHaveLength(1);
    expect(html.endsWith('</style>')).toBe(true);
  });

  it('notifies once after a commit with immutable declaration keys and supports unsubscribe', () => {
    const stylesheet = createStylesheet({
      id: 'subscription',
      rules: [{
        selector: '.value',
        rules: {
          color: 'red',
          margin: '1rem',
        },
      }],
    });
    let notifications = 0;
    let observedColor: string | undefined;
    let observedChange: Parameters<Parameters<typeof stylesheet.subscribe>[0]>[1] | undefined;
    const unsubscribe = stylesheet.subscribe((current, change) => {
      notifications += 1;
      observedColor = current.read('.value', 'color');
      observedChange = change;
    });

    stylesheet.update([]);
    expect(notifications).toBe(0);

    stylesheet.update([{
      selector: '.value',
      rules: {
        color: 'green',
        margin: null,
      },
    }, {
      selector: '.value',
      rules: {
        padding: '2rem',
        color: 'blue',
      },
    }, {
      selector: '.value',
      layer: 'utilities',
      rules: { color: 'black' },
    }]);

    expect(notifications).toBe(1);
    expect(observedColor).toBe('blue');
    const change = observedChange!;
    expect(change).toEqual({
      rules: [{
        selector: '.value',
        properties: ['color', 'margin', 'padding'],
      }, {
        selector: '.value',
        layer: 'utilities',
        properties: ['color'],
      }],
    });
    expect(Object.isFrozen(change)).toBe(true);
    expect(Object.isFrozen(change.rules)).toBe(true);
    expect(Object.isFrozen(change.rules[0]!.properties)).toBe(true);

    unsubscribe();
    stylesheet.update([{
      selector: '.value',
      rules: { color: 'purple' },
    }]);

    expect(notifications).toBe(1);
  });
});
