// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __TypeError__ = Symbol('TypeError');

export type TypeError<Message extends string> = { [__TypeError__]: Message };
