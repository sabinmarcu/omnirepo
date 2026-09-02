import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { getTranslations } from 'next-intl/server';
import { getHomepageNavigation } from '@/navigation/home';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { LandingCard } from '../components/LandingCard';
import { LandingCardList } from '../components/LandingCardList';
import { LandingLogo } from '../components/LandingLogo';
import {
  landingPageWrapper,
} from './page.css';

export async function generateMetadata(
  { params }: PageProps<'/[locale]'>,
): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Home Page | Sabin Marcu',
    ...await canonicalMetadata(locale, '/'),
  };
}

export default async function Home() {
  const translate = await getTranslations('home');
  const homepageNavigation = getHomepageNavigation(translate);
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
