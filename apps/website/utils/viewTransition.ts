const nonIdentifierCharacters = /[^\w-]+/g;

/**
 * `view-transition-name` must be a CSS `<custom-ident>`, but navigation ids fall back
 * to hrefs and link text. An invalid name makes React's generated
 * `::view-transition-group(...)` selector throw from `Element.animate`, which aborts
 * the transition and leaves passive effects in the committed tree unflushed.
 */
export function navigationViewTransitionName(id: string) {
  return `navigation-${id.replaceAll(nonIdentifierCharacters, '-')}`;
}
