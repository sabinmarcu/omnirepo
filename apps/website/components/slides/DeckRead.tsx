import type { ReactNode } from 'react';
import type { Slide } from '@/models/SlideDeckResource';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { PageLayout } from '@/layouts/PageLayout';
import {
  deckReadDatesStyle,
  deckReadDescriptionStyle,
  deckReadModeButtonStyle,
  deckReadHeaderStyle,
  deckReadMetaStyle,
  deckReadModeLinksStyle,
  deckReadSlideNumberStyle,
  deckReadSlideStyle,
  deckReadSlidesStyle,
  deckReadTitleStyle,
} from './DeckRead.css';

export type DeckSlide = Slide;

export namespace DeckRead {
  export type Props = {
    description: string,
    dates: string,
    metadata: ReactNode,
    modeLinks: {
      present: string,
      print: string,
    },
    modeLabels: {
      present: string,
      print: string,
    },
    slideCount: string,
    slides: DeckSlide[],
    title: string,
  };
}

export function DeckRead({
  description,
  dates,
  metadata,
  modeLabels,
  modeLinks,
  slideCount,
  slides,
  title,
}: DeckRead.Props) {
  return (
    <>
      <header className={deckReadHeaderStyle}>
        <p className={deckReadMetaStyle}>{slideCount}</p>
        <h1 className={deckReadTitleStyle}>{title}</h1>
      </header>
      <p className={deckReadDatesStyle}>{dates}</p>
      <PageLayout.Inset>{metadata}</PageLayout.Inset>
      <p className={deckReadDescriptionStyle}>{description}</p>
      <nav className={deckReadModeLinksStyle} aria-label={title}>
        <ThemedLink
          className={deckReadModeButtonStyle}
          decoration="none"
          href={modeLinks.present}
          prefetch={false}
        >
          {modeLabels.present}
        </ThemedLink>
        <ThemedLink
          className={deckReadModeButtonStyle}
          decoration="none"
          href={modeLinks.print}
          prefetch={false}
        >
          {modeLabels.print}
        </ThemedLink>
      </nav>
      <div className={deckReadSlidesStyle}>
        {slides.map((slide, index) => (
          <section key={slide.id} id={slide.id} className={deckReadSlideStyle}>
            <p className={deckReadSlideNumberStyle}>{index + 1}</p>
            <h2>{slide.title}</h2>
            {slide.children}
          </section>
        ))}
      </div>
    </>
  );
}
