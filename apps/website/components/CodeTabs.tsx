'use client';

import {
  useId,
  useState,
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
  };
}

export function CodeTabs({ tabs }: CodeTabs.Props) {
  const baseId = useId();
  const [active, setActive] = useState(0);

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
            onClick={() => setActive(index)}
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
