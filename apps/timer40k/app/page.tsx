import { Display } from './Display';

import { env as environment } from './env';

export default function Home() {
  return (
    <Display {...{
      releasedImage: {
        src: '/yes.jpg',
        width: '688',
        height: '1159',
      },
      upcomingImage: {
        src: '/no.jpg',
        width: '800',
        height: '518',
      },
      earlyReleaseImage: {
        src: '/maybe.png',
        width: '2062',
        height: '1798',
      },
      releaseDate: environment.TIMER_40K_RELEASE_DATE,
      earlyReleaseDate: environment.TIMER_40K_EARLY_RELEASE_DATE,
    }}
    />
  );
}
