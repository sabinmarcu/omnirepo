'use client';

import 'reveal.js/reveal.css';
import type { PropsWithChildren } from 'react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import type { RevealApi } from 'reveal.js';

export namespace RevealDeck {
  export type Props = PropsWithChildren<{
    className?: string,
  }>;
}

function shouldHandleKeyboard(event: KeyboardEvent): boolean {
  const { target } = event;
  return !(
    target instanceof HTMLElement
    && target.closest('input, textarea, select, button, a, [contenteditable]:not([contenteditable="false"]), [data-reveal-keyboard="ignore"]')
  );
}

export function RevealDeck({ children, className }: RevealDeck.Props) {
  const reference = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const element = reference.current;
    if (!element) return undefined;

    let active = true;
    let deck: RevealApi | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let imageCleanup = () => {};
    const refresh = () => deck?.layout();
    const incrementCounter = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button');
      const counter = button?.closest('[data-slide-counter]');
      const output = counter?.querySelector('output');
      if (output) output.value = String(Number(output.value) + 1);
    };
    element.addEventListener('click', incrementCounter);

    // reveal.js reaches browser globals; load it only after this client component mounts.
    const initialize = async () => {
      try {
        const [revealModule, notesModule] = await Promise.all([
          import('reveal.js'),
          import('reveal.js/plugin/notes'),
        ]);
        if (!active) return;

        const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const RevealRuntime = revealModule.default;
        const presentation = new RevealRuntime(element, {
          controls: true,
          controlsLayout: 'bottom-right',
          fragments: true,
          hash: true,
          keyboard: true,
          keyboardCondition: shouldHandleKeyboard,
          overview: true,
          plugins: [notesModule.default()],
          progress: true,
          scrollActivationWidth: 0,
          touch: true,
          transition: reducedMotion ? 'none' : 'fade',
          transitionSpeed: reducedMotion ? 'fast' : 'default',
          width: 1600,
          height: 900,
        });
        deck = presentation;
        await presentation.initialize();
        if (!active) {
          if (deck === presentation) {
            presentation.destroy();
            deck = undefined;
          }
          return;
        }

        resizeObserver = new ResizeObserver(refresh);
        resizeObserver.observe(element);
        window.addEventListener('resize', refresh);
        element.addEventListener('slides:resize', refresh);

        const images = [...element.querySelectorAll('img')];
        for (const image of images) {
          image.addEventListener('load', refresh);
          image.addEventListener('error', refresh);
        }
        imageCleanup = () => {
          for (const image of images) {
            image.removeEventListener('load', refresh);
            image.removeEventListener('error', refresh);
          }
        };

        await document.fonts?.ready;
        if (active) refresh();
      } catch (error_) {
        if (active) setError(error_ instanceof Error ? error_ : new Error(String(error_)));
      }
    };
    initialize();

    return () => {
      active = false;
      window.removeEventListener('resize', refresh);
      element.removeEventListener('slides:resize', refresh);
      element.removeEventListener('click', incrementCounter);
      imageCleanup();
      resizeObserver?.disconnect();
      deck?.destroy();
      deck = undefined;
    };
  }, []);

  if (error) throw error;
  return <div ref={reference} className={className}>{children}</div>;
}
