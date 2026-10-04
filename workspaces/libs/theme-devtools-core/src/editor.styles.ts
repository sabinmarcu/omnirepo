import { copyButtonStyles } from './copy-button.styles.js';
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
  align-items: start;
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
  display: grid;
  grid-template-columns: minmax(7em, 1fr) minmax(7em, 1fr) auto;
  align-items: start;
  gap: calc(${uiTheme.spacing.m} / 2);
  min-inline-size: 0;
}

.input-row {
  display: flex;
  align-items: center;
  gap: calc(${uiTheme.spacing.m} / 2);
  min-inline-size: 0;
}

.control {
  flex: 1 1 auto;
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
  flex: 0 0 auto;
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

.live-value {
  display: block;
  min-inline-size: 0;
  min-block-size: calc(1lh + calc(${uiTheme.spacing.m} / 2));
  max-block-size: calc(${uiTheme.spacing.m} * 10);
  overflow: auto;
  padding: calc(${uiTheme.spacing.m} / 3) calc(${uiTheme.spacing.m} / 2);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 72%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 34%, transparent);
  color: ${uiTheme.colors.primary.muted};
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.copy-button {
  min-block-size: calc(1lh + calc(${uiTheme.spacing.m} / 2));
  padding: calc(${uiTheme.spacing.m} / 3) calc(${uiTheme.spacing.m} / 2);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 72%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 56%, transparent);
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.control:focus-visible, .picker:focus-visible, .copy-button:focus-visible {
  outline: 2px solid ${uiTheme.colors.primary.base};
  outline-offset: 2px;
}

.copy-status, .error {
  grid-column: 1 / -1;
  min-block-size: 1lh;
  font-size: calc(${uiTheme.typography.size} * 0.82);
  overflow-wrap: anywhere;
}

.copy-status { color: ${uiTheme.colors.primary.muted}; }
.copy-status:empty { display: none; }
.error, :host([data-copy-error]) .copy-status { color: ${uiTheme.colors.primary.emphasis}; }

:host([data-error]) .control, :host([data-error]) .picker {
  border-color: ${uiTheme.colors.primary.emphasis};
}

:host([data-color-unsupported]) .picker {
  border-color: ${uiTheme.colors.primary.emphasis};
}

@media (max-width: 420px) {
  .editor { grid-template-columns: minmax(0, 1fr) auto; }
  .field-row, .copy-status, .error { grid-column: 1 / -1; }
  .field-row { grid-template-columns: minmax(0, 1fr) auto; }
  .input-row, .live-value { grid-column: 1 / -1; }
}
${copyButtonStyles}`;
