import { uiTheme } from './ui-theme.js';

export const editorStyles = `
:host {
  box-sizing: border-box;
  display: block;
  min-inline-size: 0;
  color: ${uiTheme.colors.background.text};
  font-family: ${uiTheme.typography.family};
  font-size: ${uiTheme.typography.size};
  line-height: ${uiTheme.typography.lineHeight};
}

*, *::before, *::after { box-sizing: inherit; }

.editor {
  display: grid;
  grid-template-columns: minmax(4em, 0.8fr) auto minmax(7em, 1.6fr);
  align-items: center;
  gap: calc(${uiTheme.spacing.m} / 2);
  min-inline-size: 0;
  padding-block: calc(${uiTheme.spacing.m} / 4);
  border-block-end: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 55%, transparent);
  background: transparent;
}

.label {
  min-inline-size: 0;
  overflow: hidden;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta, .unit {
  color: ${uiTheme.colors.primary.muted};
  font-size: calc(${uiTheme.typography.size} * 0.82);
  white-space: nowrap;
}

.field-row {
  display: flex;
  align-items: center;
  gap: calc(${uiTheme.spacing.m} / 2);
  min-inline-size: 0;
}

.control {
  min-inline-size: 0;
  inline-size: 100%;
  padding: calc(${uiTheme.spacing.m} / 3) calc(${uiTheme.spacing.m} / 2);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 72%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 56%, transparent);
  color: inherit;
  font: inherit;
}

input[type='checkbox'].control {
  inline-size: 1em;
  block-size: 1em;
  margin: 0;
  accent-color: ${uiTheme.colors.primary.base};
}

textarea.control {
  min-block-size: calc(${uiTheme.spacing.m} * 7);
  resize: vertical;
}

.picker {
  flex: 0 0 2em;
  inline-size: 2em;
  block-size: 1.75em;
  padding: 1px;
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 72%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: transparent;
  cursor: pointer;
}

.css-disclosure {
  flex: 1 1 auto;
  min-inline-size: 0;
}

.css-disclosure > summary {
  color: ${uiTheme.colors.primary.muted};
  cursor: pointer;
  font-size: calc(${uiTheme.typography.size} * 0.82);
  user-select: none;
}

.css-disclosure[open] > summary { margin-block-end: calc(${uiTheme.spacing.m} / 3); }

.control:focus-visible, .picker:focus-visible, .css-disclosure > summary:focus-visible {
  outline: 2px solid ${uiTheme.colors.primary.base};
  outline-offset: 2px;
}

.error {
  grid-column: 1 / -1;
  color: ${uiTheme.colors.primary.emphasis};
  font-size: calc(${uiTheme.typography.size} * 0.82);
  overflow-wrap: anywhere;
}

:host([data-error]) .control, :host([data-error]) .picker {
  border-color: ${uiTheme.colors.primary.emphasis};
}

:host([data-color-unsupported]) .css-disclosure > summary::after {
  content: ' (picker limited)';
}

@media (max-width: 420px) {
  .editor { grid-template-columns: minmax(0, 1fr) auto; }
  .field-row, .error { grid-column: 1 / -1; }
}
`;
