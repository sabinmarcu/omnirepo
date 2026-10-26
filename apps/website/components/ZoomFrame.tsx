'use client';

import {
  type PointerEvent,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  identityZoom,
  isDefaultZoom,
  panBy,
  wheelFactor,
  zoomAt,
} from './ZoomFrame.utils';
import {
  zoomFrameStyle,
  zoomRailStyle,
  zoomResetIconStyle,
  zoomResetStyle,
  zoomStageStyle,
} from './ZoomFrame.css';

export namespace ZoomFrame {
  export type Props = PropsWithChildren<{ className?: string }>;
}

function localPosition(frame: HTMLDivElement, clientX: number, clientY: number) {
  const rect = frame.getBoundingClientRect();
  const ratio = rect.width ? frame.offsetWidth / rect.width : 1;
  return {
    x: (clientX - rect.left) * ratio,
    y: (clientY - rect.top) * ratio,
  };
}

export function ZoomFrame({ children, className }: ZoomFrame.Props) {
  const frameReference = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number, y: number }>());
  const [state, setState] = useState(identityZoom);

  useEffect(() => {
    const frame = frameReference.current;
    if (!frame) return undefined;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const position = localPosition(frame, event.clientX, event.clientY);
      setState((current) => zoomAt(
        current,
        wheelFactor(event.deltaY, event.deltaMode),
        position.x,
        position.y,
        frame.offsetWidth,
        frame.offsetHeight,
      ));
    };
    frame.addEventListener('wheel', handleWheel, { passive: false });
    return () => frame.removeEventListener('wheel', handleWheel);
  }, []);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    // Capturing the reset button's pointer would retarget its click to the frame.
    if (event.target instanceof Element && event.target.closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const position = localPosition(event.currentTarget, event.clientX, event.clientY);
    pointers.current.set(event.pointerId, position);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    event.stopPropagation();
    const frame = event.currentTarget;
    const position = localPosition(frame, event.clientX, event.clientY);
    const width = frame.offsetWidth;
    const height = frame.offsetHeight;
    if (pointers.current.size === 1) {
      pointers.current.set(event.pointerId, position);
      setState((current) => panBy(
        current,
        position.x - previous.x,
        position.y - previous.y,
        width,
        height,
      ));
      return;
    }
    const [beforeA, beforeB] = pointers.current.values();
    pointers.current.set(event.pointerId, position);
    const [afterA, afterB] = pointers.current.values();
    const previousDistance = Math.hypot(beforeB.x - beforeA.x, beforeB.y - beforeA.y);
    if (previousDistance === 0) return;
    const distance = Math.hypot(afterB.x - afterA.x, afterB.y - afterA.y);
    const midpointX = (afterA.x + afterB.x) / 2;
    const midpointY = (afterA.y + afterB.y) / 2;
    const deltaX = midpointX - (beforeA.x + beforeB.x) / 2;
    const deltaY = midpointY - (beforeA.y + beforeB.y) / 2;
    setState((current) => panBy(
      zoomAt(current, distance / previousDistance, midpointX, midpointY, width, height),
      deltaX,
      deltaY,
      width,
      height,
    ));
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.delete(event.pointerId)) return;
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      ref={frameReference}
      className={[zoomFrameStyle, className].filter(Boolean).join(' ')}
      data-prevent-swipe=""
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className={zoomStageStyle} style={{ transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})` }}>
        {children}
      </div>
      <div className={zoomRailStyle}>
        <button
          type="button"
          className={zoomResetStyle}
          disabled={isDefaultZoom(state)}
          aria-label="Reset zoom"
          title="Reset zoom"
          onClick={() => setState(identityZoom)}
        >
          <span className={zoomResetIconStyle} aria-hidden="true">⟲</span>
        </button>
      </div>
    </div>
  );
}
