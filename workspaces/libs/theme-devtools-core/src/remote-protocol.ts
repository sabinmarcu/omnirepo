import type {
  InspectionChange,
  ThemeManifest,
} from '@sabinmarcu/theme-core';

export const remoteProtocol = 'sabinmarcu-theme-devtools';
export const remoteProtocolVersion = 2;

/** A target whose allocation root contains the agent's selected element. */
export type RemoteSelection = {
  readonly targetId: string;
  /** Family targets only: the members whose mappings apply to the selected element. */
  readonly members?: readonly string[];
};

/** Current values of one inspected target; `error` replaces every value when unreadable. */
export type RemoteTargetValues = {
  readonly targetId: string;
  /** Complete setup-compatible inputs (`InspectedTheme.export()`). */
  readonly inputs?: Readonly<Record<string, unknown>>;
  /** Decoded source values keyed by source allocation name. */
  readonly sources?: Readonly<Record<string, unknown>>;
  /** Computed derived output values keyed by output allocation name. */
  readonly outputs?: Readonly<Record<string, unknown>>;
  readonly error?: string;
};

/** Inspector → page agent. */
export type RemoteRequest =
  | { readonly type: 'hello' }
  | { readonly type: 'refresh' }
  | { readonly type: 'setManifests'; readonly manifests?: readonly unknown[] }
  | {
    readonly type: 'patch';
    readonly id: number;
    readonly targetId: string;
    readonly input: Readonly<Record<string, unknown>>;
  };

/** Page agent → inspector. */
export type RemoteEvent =
  | {
    /** Authoritative catalog replacement with complete values. */
    readonly type: 'catalog';
    readonly manifests: readonly ThemeManifest[];
    readonly values: readonly RemoteTargetValues[];
    readonly selection: readonly RemoteSelection[] | null;
    readonly error?: string;
  }
  | {
    /** Partial values for `change`, or complete values for every listed target without one. */
    readonly type: 'values';
    readonly values: readonly RemoteTargetValues[];
    readonly change?: NonNullable<InspectionChange>;
  }
  | { readonly type: 'result'; readonly id: number; readonly error?: string }
  | { readonly type: 'error'; readonly message: string }
  | { readonly type: 'selection'; readonly selection: readonly RemoteSelection[] | null };

export type RemoteMessage = (RemoteRequest | RemoteEvent) & {
  readonly protocol: typeof remoteProtocol;
  readonly version: typeof remoteProtocolVersion;
};

/**
 * JSON-safe message channel between a page agent and a remote inspector
 * (for example a browser-extension port or `postMessage` bridge).
 */
export type RemoteTransport = {
  send(message: RemoteMessage): void;
  subscribe(listener: (message: unknown) => void): () => void;
};

export const envelope = (message: RemoteRequest | RemoteEvent): RemoteMessage => ({
  ...message,
  protocol: remoteProtocol,
  version: remoteProtocolVersion,
});

/** Accept only this protocol version; anything else on a shared channel is ignored. */
export const readMessage = (value: unknown): RemoteMessage | undefined => {
  if (value === null || typeof value !== 'object') return undefined;
  const candidate = value as Partial<RemoteMessage>;
  return candidate.protocol === remoteProtocol
    && candidate.version === remoteProtocolVersion
    && typeof candidate.type === 'string'
    ? candidate as RemoteMessage
    : undefined;
};

export const messageOf = (error: unknown): string => (
  error instanceof Error ? error.message : String(error)
);
