import type {
  InspectedTheme,
  InspectionChange,
  ManifestSource,
  ThemeManifest,
} from '@sabinmarcu/theme-core';
import type {
  UIThemeInput,
  UIThemePatch,
} from './ui-theme.js';

export type ThemeDevtoolsOptions = {
  readonly manifests?: readonly ThemeManifest[];
  /** Defaults to the mount container's owner document; UI placement is not inspection scope. */
  readonly inspectionDocument?: Document;
  readonly nonce?: string;
  readonly shadowMode?: ShadowRootMode;
  readonly ui?: UIThemeInput;
  /** Called after the modeless inspector is closed; application sources are untouched. */
  readonly onClose?: () => void;
};

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
  refresh(): void;
  close(): void;
};
