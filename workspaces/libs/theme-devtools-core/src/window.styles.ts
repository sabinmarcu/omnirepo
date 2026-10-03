import { uiTheme } from './ui-theme.js';

export const windowStyles = `
:host {
  box-sizing: border-box !important;
  position: fixed !important;
  transition: none !important;
  animation: none !important;
  transform: none !important;
  inset: auto !important;
  left: var(--devtools-theme-window-position-x, 24px) !important;
  top: var(--devtools-theme-window-position-y, 80px) !important;
  margin: 0 !important;
  inline-size: min(720px, calc(100dvw - 24px)) !important;
  block-size: min(650px, calc(100dvh - 24px)) !important;
  max-inline-size: calc(100dvw - 24px) !important;
  max-block-size: calc(100dvh - 24px) !important;
  padding: 0 !important;
  border: 1px solid color-mix(in srgb, white 46%, transparent) !important;
  border-radius: 22px !important;
  overflow: hidden !important;
  background: color-mix(in srgb, ${uiTheme.colors.background.page} 68%, transparent) !important;
  backdrop-filter: blur(24px) saturate(165%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(165%) !important;
  box-shadow: 0 24px 80px rgb(0 0 0 / .23), 0 6px 24px rgb(0 0 0 / .1),
    inset 0 1px 0 rgb(255 255 255 / .65) !important;
  color: ${uiTheme.colors.background.text} !important;
  font-family: ${uiTheme.typography.family} !important;
  font-size: ${uiTheme.typography.size} !important;
  line-height: ${uiTheme.typography.lineHeight} !important;
}
:host::backdrop { background: transparent; pointer-events: none; }
:host([data-dragging]) { cursor: grabbing !important; }
*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
.inspector-window {
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  block-size: 100%;
  min-block-size: 0;
  background: linear-gradient(145deg, rgb(255 255 255 / .18), transparent 52%);
}
.window-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  padding: 12px 14px 10px 16px;
  border-block-end: 1px solid color-mix(in srgb, ${uiTheme.colors.background.text} 9%, transparent);
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.window-grip { opacity: .35; font-size: 20px; line-height: 1; }
.window-title { flex: 1; margin: 0; font-size: 14px; font-weight: 650; letter-spacing: -.015em; }
.window-actions { display: flex; align-items: center; gap: 4px; }
.window-action {
  display: grid;
  place-items: center;
  inline-size: 30px;
  block-size: 30px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.window-action:hover { background: rgb(255 255 255 / .32); border-color: rgb(255 255 255 / .36); }
.window-close:hover { background: rgb(239 68 68 / .12); color: #b42318; }
.window-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 16px; }
.window-tools:empty { display: none; }
.window-content { flex: 1; min-block-size: 0; overflow: auto; padding: 0 14px 14px; scrollbar-width: thin; }
.window-failure { margin: 8px 0; padding: 8px 10px; color: #b42318; font-size: 12px; }
button, input, select, textarea { font: inherit; }
button, select { cursor: pointer; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible {
  outline: 2px solid ${uiTheme.colors.primary.base}; outline-offset: 2px;
}
@media (max-width: 560px) {
  :host { border-radius: 16px !important; }
  .window-header { padding: 10px 12px; }
  .window-content { padding-inline: 10px; }
}
`;
