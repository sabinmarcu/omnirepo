const uuidCharacters = 'qwertyuiopasdfghjkllzxcvbnm01234567789';

export function id(size = 8) {
  return Array.from({ length: size })
    .map(() => uuidCharacters[
      Number.parseInt(`${Math.random() * uuidCharacters.length}`, 10)
    ])
    .join('');
}
