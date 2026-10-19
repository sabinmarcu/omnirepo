import type { DeckSlide } from './DeckRead';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { RevealDeck } from './RevealDeck.client';
import {
  deckPresentBackLinkStyle,
  deckPresentNoScriptStyle,
  deckPresentNotesStyle,
  deckPresentRootStyle,
  deckPresentSlideCountStyle,
  deckPresentSlideStyle,
  deckPresentSlidesStyle,
} from './DeckPresent.css';

export namespace DeckPresent {
  export type Props = {
    backToRead: string,
    noScript: string,
    readHref: string,
    slides: DeckSlide[],
  };
}

export function DeckPresent({
  backToRead, noScript, readHref, slides,
}: DeckPresent.Props) {
  return (
    <>
      <noscript>
        <p className={deckPresentNoScriptStyle}>
          {noScript}
          {' '}
          <ThemedLink href={readHref}>{backToRead}</ThemedLink>
        </p>
      </noscript>
      <RevealDeck className={`${deckPresentRootStyle} reveal`}>
        <div className={`${deckPresentSlidesStyle} slides`}>
          {slides.map((slide, index) => (
            <section key={slide.id} id={slide.id} className={deckPresentSlideStyle}>
              <p className={deckPresentSlideCountStyle}>
                {index + 1}
                {' '}
                /
                {' '}
                {slides.length}
              </p>
              <h1>{slide.title}</h1>
              {slide.children}
              {slide.notes ? <aside className={`${deckPresentNotesStyle} notes`}>{slide.notes}</aside> : null}
            </section>
          ))}
        </div>
      </RevealDeck>
      <ThemedLink className={deckPresentBackLinkStyle} href={readHref}>{backToRead}</ThemedLink>
    </>
  );
}
