'use client';

import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { PageLayout } from '@/layouts/PageLayout';
import {
  defaults,
  showcaseRootStyles,
  imageSize,
  transformIntensity,
  shadowIntensity,
  perspective,
  showcaseRootContainerStyles,
} from './3d-showcase.css';
import { ShowcaseControl } from './3d-showcase.control';

export namespace ShowcaseControls {
  export type Props = HTMLAttributes<HTMLDivElement>;
}

export function ShowcaseControls({
  children, className, ...props
}: ShowcaseControls.Props) {
  const [imageSizeValue, setImageSize] = useState<string>(
    defaults[imageSize],
  );
  const [transformIntensityValue, setTransformIntensity] = useState<string>(
    defaults[transformIntensity],
  );
  const [shadowIntensityValue, setShadowIntensity] = useState<string>(
    defaults[shadowIntensity],
  );
  const [perspectiveValue, setPerspective] = useState<string>(
    defaults[perspective],
  );
  return (
    <main
      {...props}
      className={showcaseRootStyles}
      style={assignInlineVars({
        [imageSize]: imageSizeValue,
        [transformIntensity]: transformIntensityValue,
        [shadowIntensity]: shadowIntensityValue,
        [perspective]: perspectiveValue,
      })}>
      <PageLayout
        disableTransition
        disableFooter
        className={showcaseRootContainerStyles}
      >
        <ShowcaseControl
          label="Image Size"
          min={150}
          max={500}
          step={10}
          value={imageSizeValue}
          onChange={setImageSize}
        />
        <ShowcaseControl
          label="Transform Intensity"
          min={1}
          max={15}
          step={0.5}
          value={transformIntensityValue}
          onChange={setTransformIntensity}
        />
        <ShowcaseControl
          label="Shadow Intensity"
          min={0.1}
          max={0.5}
          step={0.01}
          value={shadowIntensityValue}
          onChange={setShadowIntensity}
        />
        <ShowcaseControl
          label="Perspective"
          min={100}
          max={500}
          step={25}
          value={perspectiveValue}
          onChange={setPerspective}
        />
      </PageLayout>
      {children}
    </main>
  );
}
