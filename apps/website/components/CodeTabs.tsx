'use client';

import {
  useId,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  codeTabsListStyle,
  codeTabsPanelStyle,
  codeTabsStyle,
  codeTabsTriggerStyle,
} from './CodeTabs.css';

export namespace CodeTabs {
  export type Tab = {
    label: string,
    content: ReactNode,
  };

  export type Props = {
    tabs: Tab[],
    syncStorageKey?: string,
    initialSyncedLabel?: string,
  };
}

const syncedLabels = new Map<string, string>();
const syncedLabelListeners = new Map<string, Set<() => void>>();

function subscribeToSyncedLabel(storageKey: string | undefined, listener: () => void) {
  if (!storageKey) {
    return () => {};
  }

  const listeners = syncedLabelListeners.get(storageKey) ?? new Set();
  listeners.add(listener);
  syncedLabelListeners.set(storageKey, listeners);

  return () => {
    listeners.delete(listener);
  };
}

function getSyncedLabel(
  storageKey: string | undefined,
  initialLabel: string | undefined,
) {
  return storageKey ? (syncedLabels.get(storageKey) ?? initialLabel) : undefined;
}

function notifySyncedLabelListeners(storageKey: string) {
  syncedLabelListeners.get(storageKey)?.forEach((listener) => listener());
}

function setSyncedLabel(storageKey: string, label: string) {
  syncedLabels.set(storageKey, label);
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = `${storageKey}=${encodeURIComponent(label)};path=/;max-age=31536000;samesite=lax`;
  notifySyncedLabelListeners(storageKey);
}

export function CodeTabs({
  tabs,
  syncStorageKey,
  initialSyncedLabel,
}: CodeTabs.Props) {
  const baseId = useId();
  const [uncontrolledActive, setUncontrolledActive] = useState(0);
  const syncedLabel = useSyncExternalStore(
    (listener) => subscribeToSyncedLabel(syncStorageKey, listener),
    () => getSyncedLabel(syncStorageKey, initialSyncedLabel),
    () => getSyncedLabel(syncStorageKey, initialSyncedLabel),
  );
  const syncedActive = syncedLabel === undefined
    ? undefined
    : tabs.findIndex((tab) => tab.label === syncedLabel);
  const active = syncedActive === undefined || syncedActive === -1
    ? uncontrolledActive
    : syncedActive;

  const selectTab = (index: number) => {
    if (syncStorageKey) {
      setSyncedLabel(syncStorageKey, tabs[index].label);
    } else {
      setUncontrolledActive(index);
    }
  };

  return (
    <div className={codeTabsStyle}>
      <div role="tablist" className={codeTabsListStyle}>
        {tabs.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-controls={`${baseId}-panel-${index}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            className={codeTabsTriggerStyle({ active: index === active })}
            onClick={() => selectTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {tabs.map(({
        label,
        content,
      }, index) => (
        <div
          key={label}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
          className={codeTabsPanelStyle}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
