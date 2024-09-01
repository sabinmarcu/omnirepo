export type ProxyExtras = Record<string, () => any>;

export type ProxyString<Extras extends ProxyExtras> =
& String
& {
  [Key in keyof Extras]: ReturnType<Extras[Key]>;
};

export type ProxyStringUtils = {
  equals: (value: string) => boolean;
  raw: string;
};

export type ProxyStringOf<
  T extends string,
  Extras extends ProxyExtras,
> = ProxyString<Extras> & ProxyStringUtils & T;
