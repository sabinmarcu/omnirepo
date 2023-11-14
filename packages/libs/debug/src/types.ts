export type RawDebugRule = {
  path: string;
  namespace: string;
  channel: string;
  enabled: boolean;
};

export type DebugRule = Omit<RawDebugRule, 'enabled'>;
