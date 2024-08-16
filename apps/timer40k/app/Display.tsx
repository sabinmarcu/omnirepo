'use client';

import Image from 'next/image.js';
import {
  useState,
  useEffect,
  type ComponentProps,
} from 'react';
import dayjs from 'dayjs';

export type DisplayProperties = {
  releasedImage: Partial<ComponentProps<typeof Image>>,
  earlyReleaseImage: Partial<ComponentProps<typeof Image>>,
  upcomingImage: Partial<ComponentProps<typeof Image>>,
  releaseDate: string,
  earlyReleaseDate: string,
};
export function Display({
  releasedImage,
  earlyReleaseImage,
  upcomingImage,
  releaseDate,
  earlyReleaseDate,
}: DisplayProperties) {
  const [
    time,
    setTime,
  ] = useState(Date.now());
  useEffect(
    () => {
      const interval = setInterval(
        () => setTime(Date.now()),
        100,
      );
      return () => { clearInterval(interval); };
    },
    [],
  );
  const releaseDiff = dayjs(time).diff(dayjs(releaseDate), 'day', true);
  const earlyReleaseDiff = earlyReleaseDate ? dayjs(time).diff(dayjs(earlyReleaseDate), 'day', true) : 0 - Infinity;
  const imageToRender = (
    (releaseDiff >= 0 && releasedImage)
    || (earlyReleaseDiff >= 0 && earlyReleaseImage)
    || upcomingImage
  ) as any;
  return (
    <>
      <div className="background">
        <Image {...imageToRender} alt="status-bg" />
      </div>
      <div className="foreground">
        <Image {...imageToRender} alt="status" />
        <h1>
          {releaseDiff >= 0
            ? String.raw`It's released, what are you doing here?`
            : `Releasing in ${Number.parseInt(`${0 - releaseDiff}`, 10)} days`}
        </h1>
        {earlyReleaseDate && (
          <h2>
            {earlyReleaseDiff >= 0
              ? String.raw`It's in early release. Go have fun, you wealthy git.`
              : `Early release in in ${Number.parseInt(`${0 - earlyReleaseDiff}`, 10)} days`}
          </h2>
        )}
      </div>
    </>
  );
}
