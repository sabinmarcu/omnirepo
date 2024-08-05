import {
  canvasCSSProperty,
  defaultColor,
} from './constants';
import type {
  PointType,
  RendererProperties,
} from './types';

const wnd = typeof window === 'undefined' ? undefined : window;

export const makeRenderer = (
  reference: HTMLCanvasElement,
  properties: RendererProperties = {} as RendererProperties,
) => {
  let {
    every,
    variance,
    size,
    speed,
    tolerance,
  } = properties;
  const canvas = reference;

  const context = canvas.getContext('2d');
  let realSpeed: number;

  let points: PointType[];

  // Update Speed and Points
  const update = () => {
    const style = wnd?.getComputedStyle(canvas);
    if (!style) {
      return;
    }

    canvas.width = Number.parseInt(style.getPropertyValue('width'), 10);
    canvas.height = Number.parseInt(style.getPropertyValue('height'), 10);

    const col = Math.floor(canvas.width / every);
    const row = Math.floor(canvas.height / every);

    const colPad = canvas.width - (col - 1) * every;
    const rowPad = canvas.height - (row - 1) * every;

    realSpeed = Math.min(canvas.width, canvas.height) * (speed / 1000);

    points = Array.from({ length: col * row })
      .fill(0)
      .map((_, index) => ({
        x: Math.floor(index % col) * every + colPad / 2
          + Math.floor(Math.random() * variance * 2 - variance),
        y: Math.floor(index / col) * every + rowPad / 2
          + Math.floor(Math.random() * variance * 2 - variance),
        impulse: Math.random() * Math.PI * 2,
      }));
  };

  update();
  wnd?.addEventListener('resize', update);

  let isRendering = true;
  const render = () => {
    const color = wnd?.getComputedStyle(canvas)
      .getPropertyValue(canvasCSSProperty)
      ?? defaultColor;
    if (!isRendering || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.strokeStyle = color;

    points = points.map(({
      x, y, impulse,
    }) => {
      let newX = x + realSpeed * Math.cos(impulse);
      let newY = y + realSpeed * Math.sin(impulse);
      let newImpulse = impulse;
      if (
        x < -tolerance
        || x > canvas.width + tolerance
        || y < -tolerance
        || y > canvas.height + tolerance
      ) {
        newX = Math.min(canvas.width, Math.max(0, newX));
        newY = Math.min(canvas.height, Math.max(0, newY));
        newImpulse = (newImpulse + Math.PI) % (Math.PI * 2);
      }
      return {
        x: newX,
        y: newY,
        impulse: newImpulse,
      };
    });

    context.strokeStyle = color;
    for (const [
      index,
      {
        x, y,
      },
    ] of points.entries()) {
      for (const [
        index1,
        {
          x: x1, y: y1,
        },
      ] of points.entries()) {
        if (index !== index1) {
          const distribution = Math.hypot(
            (x - x1)
            , (y - y1),
          );
          if (distribution < every * 1.2) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x1, y1);
            context.stroke();
          }
        }
      }
    }

    for (const {
      x, y,
    } of points) {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(x, y, size * 2.5, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }

    requestAnimationFrame(render);
  };

  const updateProperties = (newProperties: RendererProperties) => {
    every = newProperties.every !== undefined ? newProperties.every : every;
    variance = newProperties.variance !== undefined ? newProperties.variance : variance;
    size = newProperties.size !== undefined ? newProperties.size : size;
    speed = newProperties.speed !== undefined ? newProperties.speed : speed;
    tolerance = newProperties.tolerance !== undefined ? newProperties.tolerance : tolerance;
  };

  return {
    update: updateProperties,
    start: () => {
      isRendering = true;
      render();
    },
    stop: () => {
      isRendering = false;
    },
    renderOnce: () => {
      isRendering = true;
      render();
      isRendering = false;
    },
    canvas,
  };
};
