'use client';

import Image from 'next/image';
import {
  useState,
  useEffect,
  type ComponentProps,
} from 'react';
import dayjs from 'dayjs';
import style from './Display.css';

export type DisplayProperties = {
  releasedImage: Partial<ComponentProps<typeof Image>>,
  earlyReleaseImage: Partial<ComponentProps<typeof Image>>,
  upcomingImage: Partial<ComponentProps<typeof Image>>,
  releaseDate: string,
  earlyReleaseDate?: string,
};

const getNumber = (input: number) => Number.parseInt(`${Math.abs(input)}`, 10);

const computeDisplayDiff = (
  now: number,
  input: string,
) => {
  let current = dayjs(now);
  const target = dayjs(input);
  const days = current.diff(target, 'day');
  current = current.add(Math.abs(days), 'day');
  const hours = current.diff(target, 'hour');
  current = current.add(Math.abs(hours), 'hour');
  const minutes = current.diff(target, 'minute');
  return [
    (days && `${getNumber(days)} days`),
    (hours && `${getNumber(hours)} hours`),
    (minutes && `${getNumber(minutes)} minutes`),
  ].filter(Boolean).join(', ');
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
  const releaseText = computeDisplayDiff(time, releaseDate);
  const earlyReleaseText = earlyReleaseDate
    ? computeDisplayDiff(time, earlyReleaseDate)
    : undefined;
  return (
    <>
      <div className={style.background}>
        <Image {...imageToRender} alt="status-bg" className={ style.backgroundImage }/>
      </div>
      <div className={ style.foreground }>
        <Image {...imageToRender} alt="status" className={style.foregroundImage} />
        <h1 className={style.releaseText}>
          {releaseDiff >= 0
            ? String.raw`It's released, what are you doing here?`
            : `Releasing in ${releaseText}`}
        </h1>
        {earlyReleaseDate && (
          <h2 className={style.earlyReleaseText}>
            {earlyReleaseDiff >= 0
              ? String.raw`It's in early release. Go have fun, you wealthy git.`
              : `Early release in in ${earlyReleaseText}`}
          </h2>
        )}
      </div>
    </>
  );
}
