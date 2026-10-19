import type { DeckSlide } from './DeckRead';
import {
  deckPrintCountStyle,
  deckPrintInstructionsStyle,
  deckPrintRootStyle,
  deckPrintSlideStyle,
  deckPrintSlidesStyle,
  deckPrintTitleStyle,
} from './DeckPrint.css';

export namespace DeckPrint {
  export type Props = {
    instructions: string,
    slides: DeckSlide[],
    title: string,
  };
}
export function DeckPrint({
  instructions, slides, title,
}: DeckPrint.Props) {
  return (
    <article className={deckPrintRootStyle}>
      <style>{'@media print { @page { size: 16in 9in; margin: 0; } }'}</style>
      <header className={deckPrintInstructionsStyle}>
        <h1 className={deckPrintTitleStyle}>{title}</h1>
        <p>{instructions}</p>
      </header>
      <div className={deckPrintSlidesStyle}>
        {slides.map((slide, index) => (
          <section key={slide.id} id={slide.id} className={deckPrintSlideStyle}>
            <p className={deckPrintCountStyle}>
              {index + 1}
              {' '}
              /
              {' '}
              {slides.length}
            </p>
            <h2>{slide.title}</h2>
            {slide.children}
          </section>
        ))}
      </div>
    </article>
  );
}
