import type { PropsWithChildren } from 'react';
import { landingPageList } from './LandingCardList.css';

export async function LandingCardList({ children }: PropsWithChildren<{}>) {
  return (
      <section className={landingPageList}>
        {children}
      </section>
  );
}
