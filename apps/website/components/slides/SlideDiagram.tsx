import { renderMermaidSVG } from 'beautiful-mermaid';
import { theme } from '@sabinmarcu/website-theme';
import { diagramStyle } from './SlideMdx.css';

export function SlideDiagram({ chart, label }: { chart: string, label?: string }) {
  const svg = renderMermaidSVG(chart, {
    bg: theme.colors.background.page,
    fg: theme.colors.background.text,
    line: theme.colors.primary.base,
    accent: theme.colors.primary.base,
    muted: theme.colors.background.text,
    surface: theme.colors.background.surface,
    border: theme.colors.primary.base,
    font: 'MonoLisaText',
    transparent: true,
    padding: 16,
    nodeSpacing: 24,
    layerSpacing: 32,
  // MonoLisa is served locally; the renderer otherwise inserts remote font imports.
  }).replaceAll(/^\s*@import url\('https:\/\/fonts\.googleapis\.com\/[^']+'\);/gm, '');

  return (
    <figure className={diagramStyle} aria-label={label ?? chart}>
      {/* Authored diagrams are rendered and escaped by beautiful-mermaid on the server. */}
      <div
        aria-hidden="true"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}
