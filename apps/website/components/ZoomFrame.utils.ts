export type ZoomState = { scale: number, x: number, y: number };

export const minZoomScale = 1;
export const maxZoomScale = 8;
export const identityZoom: ZoomState = {
  scale: minZoomScale,
  x: 0,
  y: 0,
};

export function isDefaultZoom(state: ZoomState): boolean {
  return state.scale === minZoomScale && state.x === 0 && state.y === 0;
}

export function clampZoom(state: ZoomState, width: number, height: number): ZoomState {
  const scale = Math.max(minZoomScale, Math.min(maxZoomScale, state.scale));
  if (scale <= minZoomScale) return identityZoom;
  return {
    scale,
    x: Math.max(width - width * scale, Math.min(0, state.x)),
    y: Math.max(height - height * scale, Math.min(0, state.y)),
  };
}

export function zoomAt(
  state: ZoomState,
  factor: number,
  pointerX: number,
  pointerY: number,
  width: number,
  height: number,
): ZoomState {
  const scale = Math.max(minZoomScale, Math.min(maxZoomScale, state.scale * factor));
  const ratio = scale / state.scale;
  return clampZoom({
    scale,
    x: pointerX - (pointerX - state.x) * ratio,
    y: pointerY - (pointerY - state.y) * ratio,
  }, width, height);
}

export function panBy(
  state: ZoomState,
  deltaX: number,
  deltaY: number,
  width: number,
  height: number,
): ZoomState {
  return clampZoom({
    ...state,
    x: state.x + deltaX,
    y: state.y + deltaY,
  }, width, height);
}

export function wheelFactor(deltaY: number, deltaMode: number): number {
  let normalized = deltaY;
  if (deltaMode === 1) normalized *= 16;
  if (deltaMode === 2) normalized *= 100;
  return Math.max(0.2, Math.min(5, Math.exp(-normalized * 0.0015)));
}
