import { uiTheme } from './ui-theme.js';

export const jsonOverlayStyles = `
.theme-devtools-json-overlay-container {
  position: relative;
}

.theme-devtools-json-overlay {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: calc(${uiTheme.spacing.m} / 2);
  min-inline-size: 0;
  min-block-size: 0;
  padding: ${uiTheme.spacing.m};
  overflow: hidden;
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 74%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 2);
  background: color-mix(in srgb, ${uiTheme.colors.background.surface} 94%, transparent);
  color: ${uiTheme.colors.background.text};
  box-shadow: 0 8px 24px color-mix(in srgb, ${uiTheme.colors.background.text} 18%, transparent);
}

.theme-devtools-json-overlay[hidden] { display: none; }

.theme-devtools-json-overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${uiTheme.spacing.m};
}

.theme-devtools-json-overlay-heading {
  min-inline-size: 0;
  margin: 0;
  overflow: hidden;
  font: inherit;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theme-devtools-json-overlay-close {
  flex: none;
  padding: calc(${uiTheme.spacing.m} / 3) calc(${uiTheme.spacing.m} / 2);
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 72%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: color-mix(in srgb, ${uiTheme.colors.background.raised} 58%, transparent);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.theme-devtools-json-overlay-close:hover {
  background: color-mix(in srgb, ${uiTheme.colors.primary.base} 16%, ${uiTheme.colors.background.raised});
}

.theme-devtools-json-overlay-text {
  grid-row: 3;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 0;
  block-size: 100%;
  padding: calc(${uiTheme.spacing.m} / 2);
  resize: none;
  border: 1px solid color-mix(in srgb, ${uiTheme.colors.background.raised} 72%, transparent);
  border-radius: calc(${uiTheme.spacing.m} / 3);
  background: color-mix(in srgb, ${uiTheme.colors.background.page} 45%, transparent);
  color: inherit;
  font: 0.9em/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  overflow: auto;
  white-space: pre;
}

.theme-devtools-json-overlay-error {
  margin: 0;
  color: ${uiTheme.colors.primary.emphasis};
  font-size: calc(${uiTheme.typography.size} * 0.86);
  overflow-wrap: anywhere;
}

.theme-devtools-json-overlay-error[hidden] { display: none; }

.theme-devtools-json-overlay-close:focus-visible,
.theme-devtools-json-overlay-text:focus-visible {
  outline: 2px solid ${uiTheme.colors.primary.base};
  outline-offset: 2px;
}
`;
