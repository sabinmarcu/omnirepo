import type { StylesheetState } from './types.js';

export type StylesheetProps = {
  readonly stylesheet: StylesheetState;
  readonly nonce?: string;
};

/** Optional SSR delivery; the platform entry point never imports React. */
export function Stylesheet({ stylesheet, nonce }: StylesheetProps) {
  const { css } = stylesheet.snapshot(nonce);
  return (
    <style
      data-stylesheet-id={stylesheet.id}
      data-stylesheet={stylesheet.debugId}
      nonce={nonce ?? stylesheet.nonce}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
