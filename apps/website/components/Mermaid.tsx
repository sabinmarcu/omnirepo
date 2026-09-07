'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import {
  mermaidFallbackStyle,
  mermaidStyle,
} from './Mermaid.css';
import { mermaidThemeCss } from './Mermaid.theme';

// Mermaid keys a temporary DOM node off the render id, so concurrent renders must
// not share one. `useId` is stable across effect re-runs, which made them collide.
let renderSequence = 0;

export namespace Mermaid {
  export type Props = {
    chart: string,
  };
}

export function Mermaid({ chart }: Mermaid.Props) {
  const containerReference = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerReference.current;

    if (!container) {
      return undefined;
    }

    let cancelled = false;

    renderSequence += 1;
    const id = `mermaid-${renderSequence}`;

    const render = async () => {
      try {
        const { default: mermaid } = await import('mermaid');

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          themeCSS: mermaidThemeCss,
          fontFamily: 'inherit',
        });

        const { svg } = await mermaid.render(id, chart, container);

        if (!cancelled) {
          // Mermaid output is sanitized by its own `securityLevel: 'strict'` pass.
          container.innerHTML = svg;
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <PageLayout.Inset>
      <div ref={containerReference} className={mermaidStyle} />
      {failed ? <pre className={mermaidFallbackStyle}>{chart}</pre> : undefined}
    </PageLayout.Inset>
  );
}
