import type { Metadata } from 'next';
import { homepageNavigation } from '@/navigation/home';
import { Navigation } from '@/layouts/Navigation';
import { ViewTransition } from 'react';
import { LandingCard } from './components/LandingCard';
import { LandingCardList } from './components/LandingCardList';
import { LandingLogo } from './components/LandingLogo';
import {
  landingPageWrapper,
} from './page.css';

export const metadata: Metadata = {
  title: 'Home Page | Sabin Marcu',
};

export default function Home() {
  return (
    <ViewTransition>
      <main className={landingPageWrapper}>
        <Navigation empty />
        <LandingLogo />
        <LandingCardList>
          {homepageNavigation.map(({
            text,
            id,
            ...props
          }) => (
            <ViewTransition
              key={id}
              name={`navigation-${id}`}
            >
              <LandingCard
                {...props as any}
              >
                <h1>{text}</h1>
              </LandingCard>
            </ViewTransition>
          ))}
        </LandingCardList>
      </main>
    </ViewTransition>
  );
}
