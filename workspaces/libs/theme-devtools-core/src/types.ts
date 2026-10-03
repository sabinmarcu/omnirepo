import type {
  InspectedTheme,
  InspectionChange,
  ManifestSource,
  ThemeInspection,
  ThemeManifest,
} from '@sabinmarcu/theme-core';
import type {
  DevtoolsMemory,
  ThemeDevtoolsPersistence,
} from './persistence.js';
import type {
  UIThemeInput,
  UIThemePatch,
} from './ui-theme.js';

/** `window`: modeless in-page popover. `embedded`: fills its container (e.g. a devtools pane). */
export type ThemeDevtoolsPresentation = 'window' | 'embedded';

type ThemeDevtoolsCommonOptions = {
  readonly nonce?: string;
  readonly shadowMode?: ShadowRootMode;
  readonly ui?: UIThemeInput;
  /** Defaults to `window`. */
  readonly presentation?: ThemeDevtoolsPresentation;
  /**
   * Where the inspector remembers its color format (across sessions) and expanded branches
   * (per session). Defaults to the UI document's `localStorage` / `sessionStorage`.
   */
  readonly persistence?: ThemeDevtoolsPersistence;
  /** Called after the modeless window closes; application sources are untouched. Window only. */
  readonly onClose?: () => void;
};

type LocalInspectionOptions = {
  readonly manifests?: readonly ThemeManifest[];
  /** Defaults to the mount container's owner document; UI placement is not inspection scope. */
  readonly inspectionDocument?: Document;
  readonly inspection?: undefined;
};

type SuppliedInspectionOptions = {
  /** Caller-owned inspection (for example a remote mirror); `destroy()` never disposes it. */
  readonly inspection: ThemeInspection;
  readonly manifests?: undefined;
  readonly inspectionDocument?: undefined;
};

export type ThemeDevtoolsOptions = ThemeDevtoolsCommonOptions
  & (LocalInspectionOptions | SuppliedInspectionOptions);

export type ThemeInputExport = {
  readonly id: string;
  readonly inputs: Readonly<Record<string, unknown>>;
};

export type ThemeDevtools = {
  readonly host: HTMLElement;
  setManifests(manifests?: readonly ThemeManifest[]): void;
  refresh(): void;
  exportInputs(): readonly ThemeInputExport[];
  updateUI(input: UIThemePatch): void;
  /** Source commits and catalog replacement; no UI-value or applied-input cache. */
  subscribe(listener: () => void): () => void;
  destroy(): void;
};

export type DevtoolsHostElement = HTMLElement & {
  initialize(mode: ShadowRootMode): ShadowRoot;
};

export type SourceEditorOptions = {
  readonly source: ManifestSource;
  readonly label: string;
  readonly accessibleLabel?: string;
  readonly nonce?: string;
  read(): unknown;
  formatColor(value: string): string;
  commit(value: unknown): void;
};

export type SourceEditorElement = HTMLElement & {
  configure(options: SourceEditorOptions, initialValue: unknown): void;
  sync(value: unknown): void;
  dispose(): void;
};

export type DevtoolsView = {
  setTargets(targets: readonly InspectedTheme[]): void;
  sync(change?: InspectionChange): void;
  setError(message?: string): void;
  dispose(): void;
};

export type DevtoolsViewOptions = {
  readonly nonce?: string;
  readonly presentation: ThemeDevtoolsPresentation;
  readonly memory: DevtoolsMemory;
  refresh(): void;
  close(): void;
};
