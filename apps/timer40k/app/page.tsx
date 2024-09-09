import { Display } from './Display';

import { env as environment } from './env';

export default function Home() {
  return (
    <Display {...{
      yes: {
        src: '/yes.jpg',
        width: '688',
        height: '1159',
      },
      no: {
        src: '/no.jpg',
        width: '800',
        height: '518',
      },
      releaseDate: environment.TIMER_40K_RELEASE_DATE,
    }}
    />
  );
}