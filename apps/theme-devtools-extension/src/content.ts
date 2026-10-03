import { createInspectionAgent } from '@sabinmarcu/theme-devtools-core';
import type { InspectionAgent } from '@sabinmarcu/theme-devtools-core';
import { portName } from './constants.js';

// Static and on-demand (`scripting.executeScript`) injection share this isolated world.
if (!globalThis.sabinmarcuThemeDevtoolsSelect) {
  const agents = new Set<InspectionAgent>();
  let selected: Element | null = null;
  // A global is the contract for `inspectedWindow.eval(..., { useContentScriptContext: true })`.
  // eslint-disable-next-line unicorn/no-global-object-property-assignment
  globalThis.sabinmarcuThemeDevtoolsSelect = (element: unknown) => {
    selected = element instanceof Element ? element : null;
    for (const agent of agents) agent.select(selected);
  };

  const ready = new Promise<void>((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    } else resolve();
  });

  chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== portName) return;
    // The inspector says hello immediately; hold requests until the document is parsed.
    const queued: unknown[] = [];
    let deliver: ((message: unknown) => void) | undefined;
    let agent: InspectionAgent | undefined;
    let open = true;
    const receive = (message: unknown) => {
      if (deliver) deliver(message);
      else queued.push(message);
    };
    port.onMessage.addListener(receive);
    port.onDisconnect.addListener(() => {
      open = false;
      port.onMessage.removeListener(receive);
      if (agent) {
        agents.delete(agent);
        agent.dispose();
      }
    });
    await ready;
    if (!open) return;
    agent = createInspectionAgent(document, {
      send: (message) => port.postMessage(message),
      subscribe: (listener) => {
        deliver = listener;
        for (const message of queued.splice(0)) listener(message);
        return () => { deliver = undefined; };
      },
    });
    agents.add(agent);
    agent.select(selected);
  });
}
