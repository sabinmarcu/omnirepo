/* eslint-disable no-continue */
import {
  memo,
  useEffect,
} from 'react';
import { config } from './config.js';

export const MirrorPreview = memo(() => {
  useEffect(
    () => {
      const loop = () => {
        const { config: list } = config;
        // Grab IFrame
        const iframe = document.querySelector('iframe');
        if (!iframe) return;

        // For each rule
        for (const { selector, id } of list) {
          // Try to get both nodes matching selector in IFrame
          const nodes = iframe.contentDocument?.querySelectorAll(selector);

          if (!nodes) continue;

          // Try to get matching nodes in current document
          const existingNodes = [
            ...document.querySelectorAll(selector) as unknown as HTMLElement[] | undefined
            ?? [],
          ];

          // For each node in IFrame
          for (const node of nodes as unknown as HTMLElement[]) {
            // Get its ID. Quit if one cannot be resolved
            const nodeId = node.getAttribute(id);
            if (!nodeId) continue;

            // Find existing node matching ID, or create one
            const existing = existingNodes.find(
              (existingNode) => existingNode.getAttribute(id) === nodeId,
            );
            let currentNode = existing!;
            if (!currentNode) {
              currentNode = node.cloneNode() as HTMLElement;
              document.head.append(currentNode);
            }

            // Update contents
            if (currentNode.innerHTML !== node.innerHTML) {
              currentNode.innerHTML = node.innerHTML;
            }
          }
        }
      };
      loop();
      const interval = setInterval(loop, 500);
      return () => clearInterval(interval);
    },
    [],
  );
  return null;
});
