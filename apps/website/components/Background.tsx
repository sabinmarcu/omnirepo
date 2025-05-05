'use client';

import { Background as MeshBackground } from '@sabinmarcu/moving-mesh-background';
import {
  backgroundStyle,
  container,
} from './Background.css';

export function Background() {
  return (
    <div className={container}>
      <MeshBackground className={backgroundStyle} />
    </div>
  );
}