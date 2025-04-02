/* eslint-disable unicorn/prefer-global-this */
import type {
  CSSProperties,
  HTMLAttributes,
} from 'react';
import {
  useRef,
  useEffect,
  forwardRef,
} from 'react';
import { usePrefersReducedMotion } from '@sabinmarcu/use-prefers-reduced-motion';
import { useDuplicateRef } from '@sabinmarcu/use-duplicate-ref';
import type { Simplify } from '@sabinmarcu/types';
import { debounce } from './debounce.js';
import type {
  CanvasProperties,
  RendererProperties,
} from './types.js';
import {
  canvasCSSProperty,
} from './constants.js';
import { makeRenderer } from './renderer.js';

const wnd = typeof window === 'undefined' ? undefined : window;

export type BackgroundProperties = Simplify<
  & Partial<RendererProperties>
  & Partial<CanvasProperties>
  & HTMLAttributes<HTMLCanvasElement>
>;

export const Background = forwardRef<HTMLCanvasElement, BackgroundProperties>(
  (
    {
      every = 150,
      variance = 50,
      size = 4,
      speed = 1.5,
      tolerance = 50,
      color,
      ...rest
    },
    outerReference,
  ) => {
    const renderOnce = usePrefersReducedMotion();
    const renderer = useRef<ReturnType<typeof makeRenderer>>(null);
    const reference = useDuplicateRef(outerReference);

    // Do Render
    useEffect(
      () => {
        if (reference.current) {
          const newRenderer = makeRenderer(reference.current, {
            every,
            variance,
            size,
            speed,
            tolerance,
          });
          renderer.current = newRenderer;
          if (renderOnce) {
            newRenderer.renderOnce();
            return undefined;
          }
          newRenderer.start();
          return newRenderer.stop;
        }
        return undefined;
      },
      [
        reference,
        renderer,
        renderOnce,
        every,
        variance,
        size,
        speed,
        tolerance,
      ],
    );

    // Handle Resize (for reduced motion)
    useEffect(
      () => {
        if (!renderer.current || !renderOnce) {
          return undefined;
        }
        const renderFunction = debounce(renderer.current.renderOnce, 500);
        wnd?.addEventListener('resize', renderFunction);
        return () => wnd?.removeEventListener('resize', renderFunction);
      },
      [renderer, renderOnce],
    );

    // Render Once?
    useEffect(
      () => {
        if (!renderer.current || !renderOnce) {
          return undefined;
        }
        renderer.current.renderOnce();
        return undefined;
      },
      [
        renderer,
        renderOnce,
        color,
      ],
    );

    // Update Renderer on Props Change
    useEffect(
      () => {
        if (renderer.current) {
          renderer.current.update({
            every,
            variance,
            size,
            speed,
            tolerance,
          });
        }
      },
      [
        renderer,
        every,
        variance,
        size,
        speed,
        tolerance,
      ],
    );

    return (
      <canvas
        ref={reference}
        style={color ? { [canvasCSSProperty]: color } as CSSProperties : {}}
        {...rest}
      />
    );
  },
);

export default Background;
