import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  createThemeManifest,
  defineTheme,
  gridGenerator,
  paletteGenerator,
  staticGenerator,
} from '@sabinmarcu/theme-core';
import { createThemeFamily } from '@sabinmarcu/theme-family';
import { createRemoteInspection } from './remote.js';
import type { RemoteInspectionOptions } from './remote.js';
import { envelope } from './remote-protocol.js';
import type {
  RemoteEvent,
  RemoteMessage,
  RemoteSelection,
  RemoteTargetValues,
} from './remote-protocol.js';

const manifest = createThemeManifest(defineTheme({
  spacing: gridGenerator({
    default: 8,
    unit: 'px',
    pairs: 1,
  }),
  primary: paletteGenerator({
    default: {
      light: '#005fcc',
      dark: '#80bfff',
    },
  }),
  queries: staticGenerator({ compact: '(width < 40rem)' }),
}, { prefix: 'remote' }), {
  id: 'remote',
  sheetId: 'remote-sheet',
});

const spacing = '--remote-source-spacing';
const spacingM = '--remote-spacing-m';

const values = (spacingValue = 8): RemoteTargetValues => ({
  targetId: 'remote',
  inputs: {
    spacing: spacingValue,
    primary: {
      light: '#005fcc',
      dark: '#80bfff',
    },
  },
  sources: {
    [spacing]: spacingValue,
    '--remote-source-primary-light': '#005fcc',
    '--remote-source-primary-dark': '#80bfff',
  },
  outputs: {
    [spacingM]: `${spacingValue}px`,
    '--remote-spacing-s': `${spacingValue / 2}px`,
    '--remote-spacing-l': `${spacingValue * 2}px`,
    '--remote-primary-base': '#005fcc',
    '--remote-primary-contrast': 'white',
    '--remote-primary-muted': '#335',
    '--remote-primary-emphasis': '#00f',
  },
});

const lastPatchId = (sent: readonly RemoteMessage[]): number => {
  const request = sent.at(-1);
  if (request?.type !== 'patch') throw new Error('Expected a patch request');
  return request.id;
};

const connect = (options?: RemoteInspectionOptions) => {
  const sent: RemoteMessage[] = [];
  let deliver: ((message: unknown) => void) | undefined;
  const inspection = createRemoteInspection({
    send: (message) => { sent.push(message); },
    subscribe: (listener) => {
      deliver = listener;
      return () => { deliver = undefined; };
    },
  }, options);
  const emit = (event: RemoteEvent) => deliver?.(envelope(event));
  const announce = (selection: readonly RemoteSelection[] | null = null) => emit({
    type: 'catalog',
    manifests: [structuredClone(manifest)],
    values: [values()],
    selection,
  });
  return {
    inspection,
    sent,
    emit,
    announce,
  };
};

describe('createRemoteInspection', () => {
  it('mirrors the agent catalog and forwards targeted changes', () => {
    const {
      inspection,
      sent,
      emit,
      announce,
    } = connect();
    const listener = vi.fn();
    inspection.subscribe(listener);
    expect(sent.map(({ type }) => type)).toEqual(['hello']);
    expect(inspection.targets).toEqual([]);

    announce();
    expect(listener).toHaveBeenLastCalledWith(undefined);
    const [target] = inspection.targets;
    expect(target!.manifest.id).toBe('remote');
    expect(target!.export()).toEqual(values().inputs);
    expect(target!.readOutputs([spacingM])).toEqual([{
      path: ['spacing', 'm'],
      value: '8px',
    }]);
    expect(target!.readOutputs()).toContainEqual({
      path: ['queries'],
      value: { compact: '(width < 40rem)' },
    });
    expect(() => target!.readSource('--remote-unknown')).toThrow('Undeclared theme source');

    const change = {
      targetId: 'remote',
      sources: [spacing],
      outputs: [spacingM],
    };
    emit({
      type: 'values',
      values: [{
        targetId: 'remote',
        inputs: values(10).inputs,
        sources: { [spacing]: 10 },
        outputs: { [spacingM]: '10px' },
      }],
      change,
    });
    expect(listener).toHaveBeenLastCalledWith(change);
    expect(target!.readSource(spacing)).toBe(10);
    expect(target!.readOutputs([spacingM])[0]!.value).toBe('10px');
    expect(inspection.targets[0]).toBe(target);
  });

  it('applies patches optimistically until the agent acknowledges them', () => {
    const {
      inspection,
      sent,
      emit,
      announce,
    } = connect();
    announce();
    const [target] = inspection.targets;

    target!.patch({ spacing: 12 });
    expect(target!.readSource(spacing)).toBe(12);
    expect(target!.read()).toMatchObject({ spacing: 12 });
    const request = sent.at(-1)!;
    expect(request).toMatchObject({
      type: 'patch',
      targetId: 'remote',
      input: { spacing: 12 },
    });

    // A commit echo from before this patch must not revert the in-flight edit.
    emit({
      type: 'values',
      values: [values(8)],
    });
    expect(target!.readSource(spacing)).toBe(12);
    expect(target!.read()).toMatchObject({ spacing: 12 });
    expect(target!.readOutputs([spacingM])[0]!.value).toBe('8px');

    emit({
      type: 'result',
      id: lastPatchId(sent),
    });
    emit({
      type: 'values',
      values: [values(20)],
    });
    expect(target!.readSource(spacing)).toBe(20);
  });

  it('rejects invalid patches synchronously without contacting the agent', () => {
    const {
      inspection,
      sent,
      announce,
    } = connect();
    announce();
    const [target] = inspection.targets;
    const requests = sent.length;

    expect(() => target!.patch({ spacing: 'wide' })).toThrow();
    expect(() => target!.patch({ queries: { compact: '(width < 1px)' } })).toThrow();
    expect(sent).toHaveLength(requests);
    expect(target!.readSource(spacing)).toBe(8);
  });

  it('reports rejected patches and resynchronizes from the agent', () => {
    const onError = vi.fn();
    const {
      inspection,
      sent,
      emit,
      announce,
    } = connect({ onError });
    announce();
    const [target] = inspection.targets;
    target!.patch({ spacing: 12 });
    const id = lastPatchId(sent);

    emit({
      type: 'result',
      id,
      error: 'Replaced theme inspection allocation',
    });
    emit({
      type: 'values',
      values: [values(8)],
    });
    expect(onError).toHaveBeenCalledWith('Replaced theme inspection allocation');
    expect(target!.readSource(spacing)).toBe(8);
  });

  it('surfaces per-target read failures until the agent recovers', () => {
    const {
      inspection,
      emit,
      announce,
    } = connect();
    announce();
    const [target] = inspection.targets;

    emit({
      type: 'values',
      values: [{
        targetId: 'remote',
        error: 'Ambiguous or missing theme stylesheet: remote',
      }],
    });
    expect(() => target!.read()).toThrow('Ambiguous or missing theme stylesheet');
    expect(() => target!.patch({ spacing: 4 })).toThrow('Ambiguous or missing theme stylesheet');

    emit({
      type: 'values',
      values: [values(6)],
    });
    expect(target!.readSource(spacing)).toBe(6);
  });

  it('limits selection-scoped mirrors to targets containing the selected element', () => {
    const {
      inspection,
      emit,
      announce,
    } = connect({ scope: 'selection' });
    const listener = vi.fn();
    inspection.subscribe(listener);
    announce(null);
    expect(inspection.targets).toEqual([]);

    emit({
      type: 'selection',
      selection: [{ targetId: 'remote' }],
    });
    expect(inspection.targets.map(({ manifest: { id } }) => id)).toEqual(['remote']);
    const notifications = listener.mock.calls.length;

    emit({
      type: 'selection',
      selection: [{ targetId: 'remote' }],
    });
    expect(listener).toHaveBeenCalledTimes(notifications);

    emit({
      type: 'selection',
      selection: [],
    });
    expect(inspection.targets).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(notifications + 1);
  });

  it('projects selection-scoped family targets onto the members applied to the element', () => {
    const family = createThemeFamily(defineTheme({
      spacing: gridGenerator({
        default: 8,
        unit: 'px',
        pairs: 1,
      }),
      tint: paletteGenerator({
        default: {
          light: '#005fcc',
          dark: '#80bfff',
        },
      }),
    }), {
      id: 'demo',
      families: ['night', 'ocean'],
    }).manifest();
    const sent: RemoteMessage[] = [];
    let deliver: ((message: unknown) => void) | undefined;
    const inspection = createRemoteInspection({
      send: (message) => { sent.push(message); },
      subscribe: (listener) => {
        deliver = listener;
        return () => { deliver = undefined; };
      },
    }, { scope: 'selection' });
    const emit = (event: RemoteEvent) => deliver?.(envelope(event));
    const nightTint = '--theme-family-demo-families-night-source-tint-light';
    emit({
      type: 'catalog',
      manifests: [family],
      values: [{
        targetId: 'demo',
        inputs: {},
        sources: Object.fromEntries(family.sources.map((source) => [
          source.name,
          source.codec.kind === 'number' ? 8 : '#000000',
        ])),
        outputs: {},
      }],
      selection: [{
        targetId: 'demo',
        members: ['night'],
      }],
    });

    const [night] = inspection.targets;
    expect(night!.manifest.families).toEqual(['night']);
    expect(new Set(night!.manifest.sources.map(({ member }) => member)))
      .toEqual(new Set([undefined, 'night']));
    expect(night!.manifest.outputs.every((output) => output.role === 'static'
      || output.path[0] !== 'families' || output.path[1] === 'night')).toBe(true);
    expect(night!.manifest.groups).not.toContainEqual(['families', 'ocean']);

    // The projection only narrows the view; edits and reads use the complete target.
    night!.patch({ families: { night: { tint: { light: '#ffffff' } } } });
    expect(night!.readSource(nightTint)).toBe('#ffffff');
    expect(sent.at(-1)).toMatchObject({
      type: 'patch',
      targetId: 'demo',
    });

    emit({
      type: 'selection',
      selection: [{
        targetId: 'demo',
        members: ['night'],
      }],
    });
    expect(inspection.targets[0]).toBe(night);

    emit({
      type: 'selection',
      selection: [{
        targetId: 'demo',
        members: ['base', 'ocean'],
      }],
    });
    expect(inspection.targets[0]!.manifest.families).toEqual(['base', 'ocean']);
    expect(inspection.targets[0]!.readSource(nightTint)).toBe('#ffffff');
  });
});
