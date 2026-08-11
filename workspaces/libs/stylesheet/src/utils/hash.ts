const hashCharacters = [
  Array.from({ length: 26 }, (_, index) => 65 + index),
  Array.from({ length: 26 }, (_, index) => 97 + index),
  Array.from({ length: 10 }, (_, index) => index),
].flat();

export const makeHash = (length = 12) => (
  Array.from(
    { length },
    () => hashCharacters[Math.floor(Math.random() * hashCharacters.length)],
  ).join('')
);
