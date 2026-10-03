import { uiTheme } from './ui-theme.js';

export const viewStyles = `
:host {
  box-sizing: border-box;
  display: block;
  color-scheme: light dark;
  color: ${uiTheme.colors.background.text} !important;
  font-family: ${uiTheme.typography.family} !important;
  font-size: ${uiTheme.typography.size} !important;
  line-height: ${uiTheme.typography.lineHeight} !important;
}

*, *::before, *::after { box-sizing: inherit; }

.panel, .targets, .target-panel, .source-group, .family-section, .family-panes {
  display: grid;
  gap: calc(${uiTheme.spacing.m} * 0.75);
  min-inline-size: 0;
}

.panel { padding: ${uiTheme.spacing.m}; }
.target-panel { padding-block-end: calc(${uiTheme.spacing.m} / 2); }
h2, p { margin: 0; }
h2 { font-size: calc(${uiTheme.typography.size} * 0.93); font-weight: 700; }

.metadata, .empty, .message, .status, .readonly-value {
  color: ${uiTheme.colors.primary.muted};
  overflow-wrap: anywhere;
}

.message, .empty {
  padding: calc(${uiTheme.spacing.m} * 0.75);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 70%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 2);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 45%, transparent);
}

.status[aria-live] { min-block-size: 1lh; font-size: calc(${uiTheme.typography.size} * 0.86); }
.status[data-error], .message { color: ${uiTheme.colors.primary.emphasis}; }

.shared-group {
  padding-block-end: calc(${uiTheme.spacing.m} * 0.25);
  border-block-end: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 70%, transparent);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: calc(${uiTheme.spacing.m} / 2);
  padding-block-end: calc(${uiTheme.spacing.m} / 2);
  border-block-end: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 70%, transparent);
}

.tab, .tool-button, .target-select {
  min-block-size: calc(${uiTheme.spacing.m} * 3.5);
  padding: calc(${uiTheme.spacing.m} / 2) ${uiTheme.spacing.m};
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 90%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 2);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 48%, transparent);
  color: inherit;
  font: inherit;
}

.tab, .tool-button { cursor: pointer; }
.tab[aria-selected="true"] {
  border-color: ${uiTheme.colors.primary.base};
  background: color-mix(in srgb, ${uiTheme.colors.primary.base} 20%, transparent);
  color: ${uiTheme.colors.primary.emphasis};
  font-weight: 700;
}

.tab:focus-visible, .tool-button:focus-visible, .target-select:focus-visible,
summary:focus-visible, .export:focus-visible {
  outline: 2px solid ${uiTheme.colors.primary.base};
  outline-offset: 2px;
}

.tree {
  display: grid;
  gap: 2px;
  min-inline-size: 0;
}

.tree .tree {
  margin-inline-start: calc(${uiTheme.spacing.m} * 0.75);
  padding-inline-start: calc(${uiTheme.spacing.m} * 0.75);
  border-inline-start: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 68%, transparent);
}

.tree-branch, .tree-leaf { min-inline-size: 0; }
.branch > summary {
  display: flex;
  align-items: center;
  min-block-size: calc(${uiTheme.spacing.m} * 2.75);
  cursor: pointer;
  font-weight: 650;
  user-select: none;
}
.branch > summary::before { content: '›'; inline-size: 16px; opacity: .55; transition: transform .12s ease; }
.branch[open] > summary::before { transform: rotate(90deg); }

.tree-row, .readonly-row {
  display: grid;
  grid-template-columns: minmax(5em, 0.55fr) minmax(0, 1.45fr);
  align-items: center;
  gap: calc(${uiTheme.spacing.m} * 0.75);
  min-inline-size: 0;
  padding: calc(${uiTheme.spacing.m} * 0.35) calc(${uiTheme.spacing.m} / 2);
  border-radius: calc(${uiTheme.spacing.m} / 3);
}

.tree-value {
  min-inline-size: 0;
  padding: calc(${uiTheme.spacing.m} * 0.35) calc(${uiTheme.spacing.m} / 2);
  border-radius: calc(${uiTheme.spacing.m} / 3);
}

.tree-row:hover, .tree-value:hover, .readonly-row:hover {
  background: color-mix(in srgb, ${uiTheme.colors.background.raised} 35%, transparent);
}

.tree-key {
  min-inline-size: 0;
  color: ${uiTheme.colors.primary.muted};
  font-size: calc(${uiTheme.typography.size} * 0.9);
  overflow-wrap: anywhere;
}

sabinmarcu-theme-source-editor { min-inline-size: 0; }
.readonly-value {
  display: block;
  min-inline-size: 0;
  padding: calc(${uiTheme.spacing.m} * 0.35) calc(${uiTheme.spacing.m} / 2);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 65%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 32%, transparent);
  font: inherit;
  white-space: pre-wrap;
}

.export-details {
  border-block-start: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 70%, transparent);
  padding-block-start: calc(${uiTheme.spacing.m} * 0.75);
}
.export-details > summary { cursor: pointer; color: ${uiTheme.colors.primary.muted}; }
.export {
  inline-size: 100%;
  min-block-size: calc(${uiTheme.spacing.m} * 9);
  margin-block-start: calc(${uiTheme.spacing.m} * 0.75);
  padding: calc(${uiTheme.spacing.m} / 2);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 85%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 2);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 35%, transparent);
  color: inherit;
  font: inherit;
  resize: vertical;
}

@media (max-width: 440px) {
  .tree-row, .tree-value, .readonly-row { grid-template-columns: 1fr; gap: calc(${uiTheme.spacing.m} / 3); }
}
`;
