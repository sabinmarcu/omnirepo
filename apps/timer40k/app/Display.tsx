'use client';

import Image from 'next/image.js';
import {
  useState,
  useEffect,
  type ComponentProps,
} from 'react';
import dayjs from 'dayjs';

export type DisplayProperties = {
  yes: Partial<ComponentProps<typeof Image>>,
  no: Partial<ComponentProps<typeof Image>>,
  releaseDate: string,
};
export function Display({
  yes,
  no,
  releaseDate,
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
  const diff = dayjs(time).diff(dayjs(releaseDate), 'day', true);
  const toRender = (diff >= 0 ? yes : no) as any;
  return (
    <>
      <div className="background">
        <Image {...toRender} alt="status-bg" />
      </div>
      <div className="foreground">
        <Image {...toRender} alt="status" />
      </div>
    </>
  );
}