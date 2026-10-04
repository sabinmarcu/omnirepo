import { uiTheme } from './ui-theme.js';

export const copyButtonStyles = `
.copy-action {
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  transition:
    background-color .18s ease,
    border-color .18s ease,
    color .18s ease,
    transform .12s ease;
}
.copy-action:hover:not([data-copy-state]) {
  border-color: color-mix(in srgb, ${uiTheme.colors.primary.base} 55%, transparent);
}
.copy-action:active { transform: scale(.94); }
.copy-label, .copy-feedback {
  grid-area: 1 / 1;
  transition: opacity .16s ease, transform .24s cubic-bezier(.2, .8, .3, 1.3);
}
.copy-feedback {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  opacity: 0;
  transform: translateY(80%);
  white-space: nowrap;
}
.copy-feedback::before { font-weight: 800; }
.copy-action[data-copy-state] > .copy-label { opacity: 0; transform: translateY(-80%); }
.copy-action[data-copy-state] > .copy-feedback { opacity: 1; transform: none; }
.copy-action[data-copy-state="copied"] {
  border-color: ${uiTheme.colors.success.base};
  background: color-mix(in srgb, ${uiTheme.colors.success.base} 22%, transparent);
  color: ${uiTheme.colors.success.emphasis};
  animation: copy-success .34s cubic-bezier(.2, .8, .3, 1.3);
}
.copy-action[data-copy-state="copied"] > .copy-feedback::before { content: '✓'; }
.copy-action[data-copy-state="failed"] {
  border-color: ${uiTheme.colors.danger.base};
  background: color-mix(in srgb, ${uiTheme.colors.danger.base} 18%, transparent);
  color: ${uiTheme.colors.danger.emphasis};
  animation: copy-failure .38s ease-in-out;
}
.copy-action[data-copy-state="failed"] > .copy-feedback::before { content: '✕'; }
@keyframes copy-success {
  0% { transform: scale(1); }
  40% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
@keyframes copy-failure {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}
@media (prefers-reduced-motion: reduce) {
  .copy-action, .copy-label, .copy-feedback { animation: none !important; transition: none; }
  .copy-action:active { transform: none; }
}
`;
