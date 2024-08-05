export type Encoder<T = unknown> = {
  encode: (input: T) => string,
  decode: (input: string) => T,
};
