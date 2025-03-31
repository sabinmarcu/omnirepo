const hashCharacters = [
  Array.from({ length: 26 }).map((_, index) => 65 + index),
  Array.from({ length: 26 }).map((_, index) => 97 + index),
  Array.from({ length: 10 }).map((_, index) => index),
].flat();

export const makeHash = (length = 12) => (
  Array.from({ length }).fill(() => hashCharacters[
    Math.floor(Math.random() * hashCharacters.length)
  ]).join('')
);
