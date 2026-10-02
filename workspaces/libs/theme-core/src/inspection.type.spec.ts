import {
  createThemeInspection,
  createThemeSetup,
  defineTheme,
  gridGenerator,
} from './index.js';
import type {
  ThemeManifest,
  ThemeInspection,
} from './index.js';

const theme = defineTheme({ grid: gridGenerator() });
const setup = createThemeSetup(theme, { id: 'typed-inspection' });
const metadata: ThemeManifest = setup.manifest();
const exactVersion: 1 = metadata.version;
const inspection: ThemeInspection = createThemeInspection(document, [metadata]);
inspection.setManifests([]);
inspection.setManifests(undefined);
inspection.refresh();
const target = inspection.targets[0]!;
target.patch({ grid: 24 });
const live: Readonly<Record<string, unknown>> = target.export();
// @ts-expect-error Inspection is document-only, not the renderer's shadow attachment API.
createThemeInspection(document.createElement('div').attachShadow({ mode: 'open' }), [metadata]);
// @ts-expect-error Metadata cannot carry applied source values.
metadata.values = { grid: 16 };
// @ts-expect-error Allocation metadata is immutable.
metadata.root.sheetId = 'other';
// @ts-expect-error Source editor metadata cannot be changed after projection.
metadata.sources[0]!.inputPath.push('derived');

export const inspectionAssertions = {
  exactVersion,
  live,
};
