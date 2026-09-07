import { theme } from '@sabinmarcu/website-theme';

const { colors } = theme;

/**
 * Appended after Mermaid's own rules inside the generated `<style>`, at equal
 * specificity, so colours resolve from theme custom properties at paint time.
 * Mermaid's JS theme pipeline cannot do this: it derives shades by parsing colour
 * values, and `var(...)` is opaque to it.
 *
 * Inline styles from author `style`/`classDef` statements still win, as intended.
 */
export const mermaidThemeCss = `
  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path,
  .label-container,
  rect.actor,
  .classGroup rect,
  .stateGroup rect,
  .entityBox {
    fill: ${colors.background.surface};
    stroke: ${colors.primary.base};
  }

  .cluster rect,
  .note {
    fill: ${colors.background.depressed};
    stroke: ${colors.primary.muted};
  }

  text,
  tspan,
  text.actor,
  .label,
  .nodeLabel,
  .edgeLabel,
  .cluster-label,
  .titleText,
  .noteText,
  .messageText,
  .loopText,
  .classText,
  .stateLabel {
    fill: ${colors.background.text};
    color: ${colors.background.text};
  }

  /* Composite states: "outer" is the whole box, "inner" the body under the title. */
  rect.outer {
    fill: ${colors.background.depressed};
    stroke: ${colors.primary.muted};
  }

  rect.inner,
  rect.divider,
  .statediagram-cluster.statediagram-cluster .inner,
  .statediagram-cluster.statediagram-cluster-alt .inner {
    fill: ${colors.background.recessed};
    stroke: ${colors.primary.muted};
  }

  .state-start,
  .state-end,
  .node circle.state-start,
  .node circle.state-end,
  .statediagram-state .start-state,
  .statediagram-state .end-state-outer,
  .statediagram-state .end-state-inner {
    fill: ${colors.primary.base};
    stroke: ${colors.primary.base};
  }

  /* Sequence diagrams paint the tspan rather than the text element. */
  text.actor > tspan,
  .messageText > tspan,
  .labelText > tspan,
  .loopText > tspan,
  .noteText > tspan,
  .sectionTitle > tspan {
    fill: ${colors.background.text};
  }

  .edgeLabel rect,
  .labelBkg,
  .edgeLabel .label-container {
    fill: ${colors.background.recessed};
    background-color: ${colors.background.recessed};
  }

  .edgePath .path,
  .flowchart-link,
  .relation,
  .transition,
  .messageLine0,
  .messageLine1,
  .actor-line,
  .loopLine,
  .divider {
    stroke: ${colors.primary.muted};
  }

  .marker,
  .arrowheadPath,
  marker path {
    fill: ${colors.primary.muted};
    stroke: ${colors.primary.muted};
  }

  .cluster span,
  .label text,
  .nodeLabel p,
  .edgeLabel p,
  span {
    color: ${colors.background.text};
  }

  /* Mermaid paints an opaque swatch behind edge labels so edges do not show
     through them; it has to match the inset the diagram sits on. */
  .edgeLabel p,
  .edgeLabel span,
  .edgeLabel foreignObject div {
    background-color: ${colors.background.recessed};
  }
`;
