/// <reference types="chrome" />

export {};

declare global {
  /**
   * Content-script world function the Elements sidebar calls with `$0` through
   * `inspectedWindow.eval(..., { useContentScriptContext: true })`.
   */
  // eslint-disable-next-line vars-on-top -- only `var` declarations extend `globalThis`
  var sabinmarcuThemeDevtoolsSelect: ((element: unknown) => void) | undefined;
}
