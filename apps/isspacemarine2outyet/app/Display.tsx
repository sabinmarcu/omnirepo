'use client';

import Image from 'next/image';
import {
  useState,
  useEffect,
} from 'react';
import dayjs from 'dayjs';

export type DisplayProperties = {
  yes: string,
  no: string,
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
  const toRender = diff >= 0 ? yes : no;
  return (
    <>
      <div className="background">
        <Image src={toRender} alt="status-bg" />
      </div>
      <div className="foreground">
        <Image src={toRender} alt="status" />
      </div>
    </>
  );
}
