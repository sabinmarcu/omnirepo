import {
  createRemoteInspection,
  createThemeDevtools,
} from '@sabinmarcu/theme-devtools-core';
import type {
  RemoteInspection,
  RemoteTransport,
  ThemeDevtools,
  UIThemeInput,
} from '@sabinmarcu/theme-devtools-core';
import {
  portName,
  selectFunction,
} from './constants.js';

type Session = {
  readonly port: chrome.runtime.Port;
  inspection?: RemoteInspection;
  devtools?: ThemeDevtools;
  received: boolean;
};

const scope = document.documentElement.dataset.scope === 'selection' ? 'selection' : 'all';
const { tabId } = chrome.devtools.inspectedWindow;
const container = document.querySelector<HTMLElement>('#inspector')!;
const status = document.querySelector<HTMLElement>('#status')!;
const reconnect = document.querySelector<HTMLButtonElement>('#reconnect')!;
const dark = chrome.devtools.panels.themeName === 'dark';
document.documentElement.dataset.theme = dark ? 'dark' : 'light';
// The private inspector UI renders its light variant; match DevTools' dark chrome when active.
const ui: UIThemeInput | undefined = dark
  ? {
    colors: {
      background: {
        light: '#202124',
        dark: '#202124',
      },
      primary: {
        light: '#8ab4f8',
        dark: '#8ab4f8',
      },
    },
  }
  : undefined;

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));
const setStatus = (message: string, error = false) => {
  status.textContent = message;
  if (error) status.dataset.error = '';
  else Reflect.deleteProperty(status.dataset, 'error');
};

let session: Session | undefined;
let retry: ReturnType<typeof setTimeout> | undefined;

const teardown = () => {
  const current = session;
  session = undefined;
  if (!current) return;
  try {
    current.devtools?.destroy();
  } finally {
    current.inspection?.dispose();
    current.port.disconnect();
  }
};

const pushSelection = () => {
  if (scope !== 'selection') return;
  chrome.devtools.inspectedWindow.eval(
    `globalThis.${selectFunction}?.($0)`,
    { useContentScriptContext: true },
  );
};

/** Pages opened before the extension loaded lack the static content script. */
const inject = async (): Promise<boolean> => {
  try {
    await chrome.scripting.executeScript({
      target: {
        tabId,
        frameIds: [0],
      },
      files: ['content.js'],
    });
    return true;
  } catch (error) {
    setStatus(`This page cannot be inspected: ${messageOf(error)}`, true);
    return false;
  }
};

function connect(injected = false): void {
  teardown();
  clearTimeout(retry);
  // Remote-debugging DevTools sessions (e.g. CDP-attached) have no inspected tab to message.
  if (typeof tabId !== 'number') {
    setStatus('This DevTools session is not attached to a browser tab', true);
    return;
  }
  setStatus('Connecting to the page…');
  const port = chrome.tabs.connect(tabId, {
    name: portName,
    frameId: 0,
  });
  const current: Session = {
    port,
    received: false,
  };
  const transport: RemoteTransport = {
    send: (message) => port.postMessage(message),
    subscribe: (listener) => {
      const receive = (message: unknown) => {
        if (!current.received) {
          current.received = true;
          setStatus(scope === 'selection'
            ? 'Themes whose root contains the selected element'
            : 'Connected');
          pushSelection();
        }
        listener(message);
      };
      port.onMessage.addListener(receive);
      return () => port.onMessage.removeListener(receive);
    },
  };
  const inspection = createRemoteInspection(transport, {
    scope,
    onError: (message) => setStatus(message, true),
  });
  current.inspection = inspection;
  session = current;
  port.onDisconnect.addListener(async () => {
    if (session !== current) return;
    // Reading lastError marks an expected "Receiving end does not exist" as handled.
    const failure = chrome.runtime.lastError?.message;
    const { received } = current;
    teardown();
    if (!received && !injected) {
      if (await inject()) connect(true);
      return;
    }
    setStatus(failure ? `Disconnected: ${failure}` : 'Disconnected from the page; retrying…', true);
    retry = setTimeout(() => connect(), 1000);
  });
  try {
    current.devtools = createThemeDevtools(container, {
      inspection,
      presentation: 'embedded',
      ui,
    });
  } catch (error) {
    setStatus(messageOf(error), true);
  }
}

reconnect.addEventListener('click', () => connect());
chrome.devtools.network.onNavigated.addListener(() => connect());
if (scope === 'selection') {
  chrome.devtools.panels.elements.onSelectionChanged.addListener(pushSelection);
}
connect();
