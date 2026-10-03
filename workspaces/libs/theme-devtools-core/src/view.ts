import type {
  InspectedTheme,
  InspectionChange,
  ManifestOutput,
  ManifestSource,
} from '@sabinmarcu/theme-core';
import {
  readInputPath,
  sourcePatch,
} from './inputs.js';
import { attachStyles } from './styles.js';
import type {
  DevtoolsView,
  DevtoolsViewOptions,
  SourceEditorElement,
} from './types.js';
import { viewStyles } from './view.styles.js';
import { createInspectorWindow } from './window.js';

const sourceEditorTag = 'sabinmarcu-theme-source-editor';

const createElement = <Name extends keyof HTMLElementTagNameMap>(
  document: Document,
  name: Name,
): HTMLElementTagNameMap[Name] => document.createElement(name);

const pathKey = (path: readonly string[]): string => JSON.stringify(path);

const textValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  try {
    const formatted = JSON.stringify(value, null, 2);
    return formatted ?? String(value);
  } catch {
    return String(value);
  }
};

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
);

const leafLabel = (source: ManifestSource, path: readonly string[]): string => {
  if (source.variant === 'light') return 'Light';
  if (source.variant === 'dark') return 'Dark';
  return path.at(-1) ?? 'value';
};

const sourceDisplayPath = (target: InspectedTheme, source: ManifestSource): readonly string[] => {
  if (target.manifest.kind !== 'family') return source.inputPath;
  if (source.scope === 'shared') return source.inputPath.slice(1);
  if (source.member) return source.inputPath.slice(2);
  return source.inputPath;
};

type EditorRecord = {
  readonly editor: SourceEditorElement;
  readonly source: ManifestSource;
  readonly label: string;
  readonly accessibleLabel: string;
};

type ReadonlyRecord = {
  readonly value: HTMLElement;
  readonly outputPath?: readonly string[];
  readonly outputName?: string;
};

type TreeNode = {
  readonly children: Map<string, TreeNode>;
  editor?: EditorRecord;
  readonlyLeaf?: ReadonlyRecord;
};

type FamilyPane = {
  readonly member?: string;
  readonly tab?: HTMLButtonElement;
  readonly element: HTMLElement;
};

type TargetPanel = {
  readonly target: InspectedTheme;
  readonly id: string;
  readonly element: HTMLElement;
  readonly editors: readonly EditorRecord[];
  readonly readonlys: readonly ReadonlyRecord[];
  readonly exportDetails: HTMLDetailsElement;
  readonly exportArea: HTMLTextAreaElement;
  readonly status: HTMLElement;
  readonly exportListener: () => void;
  readonly panes: readonly FamilyPane[];
  readonly dirtySources: Set<string>;
  readonly dirtyOutputs: Set<string>;
};

const newNode = (): TreeNode => ({ children: new Map() });

const nodeAt = (root: TreeNode, path: readonly string[]): TreeNode => {
  let node = root;
  for (const segment of path) {
    let child = node.children.get(segment);
    if (!child) {
      child = newNode();
      node.children.set(segment, child);
    }
    node = child;
  }
  return node;
};

const outputDisplayPath = (output: ManifestOutput): readonly string[] => {
  if (output.role === 'static') return output.path;
  if (output.scope === 'shared' && output.path[0] === 'shared') return output.path.slice(1);
  if (output.scope === 'contextual' && output.path[0] === 'families') return output.path.slice(2);
  return output.path;
};

/** Avoid layout reads: hidden families and closed branches do not need live output computation. */
const isVisibleRow = (element: HTMLElement): boolean => {
  if (!element.isConnected) return false;
  for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
    if (parent.hidden || (parent.localName === 'details' && !parent.hasAttribute('open'))) return false;
  }
  return true;
};

const expansionKey = (targetId: string, scope: string, path: readonly string[]): string => (
  `${targetId}\u{0}${scope}\u{0}${pathKey(path)}`
);
const sourceBelongsToMember = (source: ManifestSource, member: string): boolean => (
  source.scope === 'contextual' && source.member === member
);
const outputBelongsToMember = (output: ManifestOutput, member: string): boolean => (
  output.role === 'derived'
      && output.scope === 'contextual'
      && output.path[0] === 'families'
      && output.path[1] === member
);
/** Builds the framework-free devtools panel inside its already-owned shadow root. */
export function createDevtoolsView(
  root: ShadowRoot,
  options: DevtoolsViewOptions,
): DevtoolsView {
  const document = root.ownerDocument;
  const window = createInspectorWindow(root, {
    nonce: options.nonce,
    close: options.close,
    refresh: options.refresh,
  });
  window.title.textContent = 'Theme inspector';

  const panel = createElement(document, 'section');
  panel.className = 'panel';
  panel.setAttribute('aria-label', 'Theme inspector');
  const message = createElement(document, 'div');
  message.className = 'message';
  message.setAttribute('role', 'alert');
  message.hidden = true;
  const targetsElement = createElement(document, 'div');
  targetsElement.className = 'targets';
  panel.append(message, targetsElement);
  window.content.append(panel);

  const styleDispose = attachStyles(root, 'panel', viewStyles, options.nonce);
  let targets: readonly InspectedTheme[] = [];
  let panels: TargetPanel[] = [];
  let selectedTargetId: string | undefined;
  const selectedFamilies = new Map<string, string>();
  const expanded = new Map<string, boolean>();
  let disposed = false;

  const targetSelect = createElement(document, 'select');
  targetSelect.className = 'target-select';
  targetSelect.setAttribute('aria-label', 'Inspected theme');
  targetSelect.hidden = true;
  const copyButton = createElement(document, 'button');
  copyButton.type = 'button';
  copyButton.className = 'tool-button';
  copyButton.textContent = 'Copy inputs';
  copyButton.hidden = true;
  window.tools.append(targetSelect, copyButton);

  const setMessage = (error?: string): void => {
    message.textContent = error ?? '';
    message.hidden = !error;
  };

  const setStatus = (panelForTarget: TargetPanel, status?: string, error = false): void => {
    const output = panelForTarget.status;
    output.textContent = status ?? '';
    if (error) output.dataset.error = '';
    else Reflect.deleteProperty(output.dataset, 'error');
  };

  function flushVisible(): void {
    if (disposed) return;
    for (const activePanel of panels.filter((candidate) => !candidate.element.hidden)) {
      try {
        const sourceRows = activePanel.editors.filter((record) => (
          activePanel.dirtySources.has(record.source.name) && isVisibleRow(record.editor)
        ));
        if (sourceRows.length > 0) {
          const values = activePanel.target.readSources(
            sourceRows.map((record) => record.source.name),
          );
          for (const record of sourceRows) {
            record.editor.sync(values[record.source.name]);
            activePanel.dirtySources.delete(record.source.name);
          }
        }
        const outputRows = activePanel.readonlys.filter((record) => (
          record.outputName && activePanel.dirtyOutputs.has(record.outputName)
            && isVisibleRow(record.value)
        ));
        if (outputRows.length > 0) {
          const values = new Map(activePanel.target.readOutputs(
            outputRows.map((record) => record.outputName!),
          ).map((output) => [pathKey(output.path), output.value]));
          for (const record of outputRows) {
            const value = textValue(values.get(pathKey(record.outputPath!)));
            if (record.value.textContent !== value) record.value.textContent = value;
            activePanel.dirtyOutputs.delete(record.outputName!);
          }
        }
        setStatus(activePanel);
      } catch (error) {
        setStatus(activePanel, error instanceof Error ? error.message : String(error), true);
      }
    }
  }
  const renderTree = (
    tree: TreeNode,
    targetId: string,
    scope: string,
    path: readonly string[] = [],
  ): HTMLElement => {
    const list = createElement(document, 'div');
    list.className = 'tree';

    const orderedChildren: [string, TreeNode][] = [];
    for (const entry of tree.children) if (!entry[1].editor) orderedChildren.push(entry);
    for (const entry of tree.children) if (entry[1].editor) orderedChildren.push(entry);
    for (const [name, node] of orderedChildren) {
      const branchPath = [...path, name];
      const isBranch = node.children.size > 0;
      const item = createElement(document, 'div');
      item.className = isBranch ? 'tree-branch' : 'tree-leaf';

      if (isBranch) {
        const details = createElement(document, 'details');
        details.className = 'branch';
        const key = expansionKey(targetId, scope, branchPath);
        details.open = expanded.get(key) ?? path.length === 0;
        const summary = createElement(document, 'summary');
        summary.textContent = name;
        summary.setAttribute('aria-label', `${details.open ? 'Collapse' : 'Expand'} ${branchPath.join('.')}`);
        details.addEventListener('toggle', () => {
          expanded.set(key, details.open);
          summary.setAttribute('aria-label', `${details.open ? 'Collapse' : 'Expand'} ${branchPath.join('.')}`);
          if (details.open) flushVisible();
        });
        details.append(summary);

        if (node.readonlyLeaf) {
          const readonlyRow = createElement(document, 'div');
          readonlyRow.className = 'readonly-row';
          const keyLabel = createElement(document, 'span');
          keyLabel.className = 'tree-key';
          keyLabel.textContent = 'Computed';
          readonlyRow.append(keyLabel, node.readonlyLeaf.value);
          details.append(readonlyRow);
        }
        details.append(renderTree(node, targetId, scope, branchPath));
        if (node.editor) {
          const valueRow = createElement(document, 'div');
          valueRow.className = 'tree-value';
          valueRow.append(node.editor.editor);
          details.append(valueRow);
        }
        item.append(details);
      } else {
        if (node.readonlyLeaf) {
          const row = createElement(document, 'div');
          row.className = 'tree-row';
          const keyLabel = createElement(document, 'span');
          keyLabel.className = 'tree-key';
          keyLabel.textContent = node.editor ? 'Computed' : name;
          row.append(keyLabel, node.readonlyLeaf.value);
          item.append(row);
        }
        if (node.editor) item.append(node.editor.editor);
      }
      list.append(item);
    }
    return list;
  };

  const addStaticLeaves = (
    rootNode: TreeNode,
    path: readonly string[],
    value: unknown,
    readonlys: ReadonlyRecord[],
  ): void => {
    if (isRecord(value) && Object.keys(value).length > 0) {
      for (const [key, nested] of Object.entries(value)) {
        addStaticLeaves(rootNode, [...path, key], nested, readonlys);
      }
      return;
    }
    const leaf = nodeAt(rootNode, path);
    const code = createElement(document, 'code');
    code.className = 'readonly-value';
    code.textContent = textValue(value);
    const record = { value: code };
    leaf.readonlyLeaf = record;
    readonlys.push(record);
  };

  const createEditor = (
    target: InspectedTheme,
    source: ManifestSource,
    displayPath: readonly string[],
    label: string,
    editors: EditorRecord[],
  ): EditorRecord => {
    const editor = document.createElement(sourceEditorTag) as SourceEditorElement;
    const family = source.scope === 'shared' ? 'Shared' : source.member ?? 'Direct';
    const readablePath = displayPath.join('.') || 'value';
    const record = {
      editor,
      source,
      label,
      accessibleLabel: `${target.manifest.id}, ${family}, ${readablePath}`,
    };
    editors.push(record);
    return record;
  };

  const addReadonlyOutput = (
    rootNode: TreeNode,
    output: ManifestOutput,
    readonlys: ReadonlyRecord[],
  ): void => {
    if (output.role === 'static') {
      addStaticLeaves(rootNode, output.path, output.value, readonlys);
      return;
    }
    const leaf = nodeAt(rootNode, outputDisplayPath(output));
    const code = createElement(document, 'code');
    code.className = 'readonly-value';
    code.textContent = '—';
    const record = {
      value: code,
      outputPath: output.path,
      outputName: output.name,
    };
    leaf.readonlyLeaf = record;
    readonlys.push(record);
  };

  const updateFamilyPanels = (): void => {
    const activePanel = panels.find((candidate) => candidate.id === selectedTargetId);
    if (!activePanel || activePanel.panes.length === 0) return;
    const fallback = activePanel.panes.find(
      (pane) => pane.member === selectedFamilies.get(activePanel.id),
    ) ?? activePanel.panes[0]!;
    selectedFamilies.set(activePanel.id, fallback.member!);
    for (const pane of activePanel.panes) {
      const active = pane === fallback;
      pane.element.hidden = !active;
      pane.tab!.setAttribute('aria-selected', String(active));
      pane.tab!.tabIndex = active ? 0 : -1;
    }
    flushVisible();
  };

  const createTargetPanel = (target: InspectedTheme): TargetPanel => {
    const element = createElement(document, 'section');
    element.className = 'target-panel';
    element.hidden = true;
    element.dataset.targetId = target.manifest.id;
    const metadata = createElement(document, 'p');
    metadata.className = 'metadata';
    metadata.textContent = `${target.manifest.root.selector} · ${target.manifest.root.sheetId}`;
    const status = createElement(document, 'p');
    status.className = 'status';
    status.setAttribute('aria-live', 'polite');

    const editors: EditorRecord[] = [];
    const readonlys: ReadonlyRecord[] = [];
    const sharedTree = newNode();
    for (const output of target.manifest.outputs) {
      if (target.manifest.kind === 'direct'
        || output.role === 'static'
        || (output.role === 'derived' && output.scope === 'shared')) {
        addReadonlyOutput(sharedTree, output, readonlys);
      }
    }
    const addSource = (source: ManifestSource): void => {
      const displayPath = sourceDisplayPath(target, source);
      const node = nodeAt(sharedTree, displayPath);
      const label = node.children.size > 0 ? 'value' : leafLabel(source, displayPath);
      node.editor = createEditor(target, source, displayPath, label, editors);
    };
    for (const source of target.manifest.sources) {
      if (target.manifest.kind === 'direct' || source.scope === 'shared') addSource(source);
    }

    const sharedSection = createElement(document, 'section');
    sharedSection.className = 'source-group shared-group';
    const sharedHeading = createElement(document, 'h2');
    sharedHeading.textContent = target.manifest.kind === 'family'
      ? 'Shared and static'
      : 'Theme contract';
    sharedSection.append(sharedHeading);
    if (sharedTree.children.size > 0) {
      sharedSection.append(renderTree(sharedTree, target.manifest.id, 'shared'));
    } else {
      const emptyShared = createElement(document, 'p');
      emptyShared.className = 'empty';
      emptyShared.textContent = target.manifest.kind === 'family'
        ? 'No shared sources or static contract values.'
        : 'No inspectable sources or contract values.';
      sharedSection.append(emptyShared);
    }

    const panes: FamilyPane[] = [];
    const familySection = createElement(document, 'section');
    familySection.className = 'family-section';
    if (target.manifest.kind === 'family') {
      const tabList = createElement(document, 'div');
      tabList.className = 'tabs';
      tabList.setAttribute('role', 'tablist');
      tabList.setAttribute('aria-label', `${target.manifest.id} families`);
      const paneHost = createElement(document, 'div');
      paneHost.className = 'family-panes';
      const members = target.manifest.families ?? [];

      for (const member of members) {
        const tab = createElement(document, 'button');
        tab.type = 'button';
        tab.className = 'tab';
        tab.setAttribute('role', 'tab');
        tab.id = `theme-tab-${target.manifest.id}-${member}`;
        tab.textContent = member;
        const pane = createElement(document, 'section');
        pane.className = 'family-pane';
        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-labelledby', tab.id);
        pane.hidden = true;
        tab.setAttribute('aria-controls', `${tab.id}-panel`);
        pane.id = `${tab.id}-panel`;
        const tree = newNode();

        for (const output of target.manifest.outputs) {
          if (outputBelongsToMember(output, member)) addReadonlyOutput(tree, output, readonlys);
        }
        for (const source of target.manifest.sources.filter(
          (candidate) => sourceBelongsToMember(candidate, member),
        )) {
          const displayPath = sourceDisplayPath(target, source);
          const node = nodeAt(tree, displayPath);
          const label = node.children.size > 0 ? 'value' : leafLabel(source, displayPath);
          node.editor = createEditor(target, source, displayPath, label, editors);
        }
        if (tree.children.size > 0) pane.append(renderTree(tree, target.manifest.id, `family:${member}`));
        else {
          const empty = createElement(document, 'p');
          empty.className = 'empty';
          empty.textContent = `No sources or contract values for ${member}.`;
          pane.append(empty);
        }
        const paneRecord = {
          member,
          tab,
          element: pane,
        };
        panes.push(paneRecord);
        tab.addEventListener('click', () => {
          selectedFamilies.set(target.manifest.id, member);
          updateFamilyPanels();
          tab.focus();
        });
        tabList.append(tab);
        paneHost.append(pane);
      }

      const tabKeydown = (event: KeyboardEvent): void => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const active = Math.max(0, panes.findIndex(
          (pane) => pane.member === selectedFamilies.get(target.manifest.id),
        ));
        let nextIndex: number;
        if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = panes.length - 1;
        else {
          const step = event.key === 'ArrowRight' ? 1 : panes.length - 1;
          nextIndex = (active + step) % panes.length;
        }
        event.preventDefault();
        const next = panes[nextIndex]!;
        selectedFamilies.set(target.manifest.id, next.member!);
        updateFamilyPanels();
        next.tab!.focus();
      };
      tabList.addEventListener('keydown', tabKeydown);
      familySection.append(tabList, paneHost);
    } else {
      familySection.hidden = true;
    }
    const exportDetails = createElement(document, 'details');
    exportDetails.className = 'export-details';
    const exportSummary = createElement(document, 'summary');
    exportSummary.textContent = 'Live setup JSON';
    const exportArea = createElement(document, 'textarea');
    exportArea.className = 'export';
    exportArea.readOnly = true;
    exportArea.spellcheck = false;
    exportArea.setAttribute('aria-label', `Setup JSON for ${target.manifest.id}`);
    exportDetails.append(exportSummary, exportArea);
    const exportListener = (): void => {
      if (!exportDetails.open) return;
      try {
        exportArea.value = textValue(target.export());
      } catch (error) {
        status.textContent = error instanceof Error ? error.message : 'Unable to export inputs';
        status.dataset.error = '';
      }
    };
    exportDetails.addEventListener('toggle', exportListener);

    element.append(metadata, sharedSection, familySection, exportDetails, status);
    const targetPanel: TargetPanel = {
      target,
      id: target.manifest.id,
      element,
      editors,
      readonlys,
      exportDetails,
      exportArea,
      status,
      exportListener,
      panes,
      dirtySources: new Set(),
      dirtyOutputs: new Set(readonlys.flatMap(
        (record) => (record.outputName ? [record.outputName] : []),
      )),
    };
    return targetPanel;
  };

  const selectedPanel = (): TargetPanel | undefined => panels.find((panelForTarget) => (
    panelForTarget.id === selectedTargetId
  ));

  const updateSelection = (): void => {
    const selected = selectedPanel();
    for (const panelForTarget of panels) {
      panelForTarget.element.hidden = panelForTarget !== selected;
    }
    copyButton.hidden = selected === undefined;
    updateFamilyPanels();
    flushVisible();
  };

  const syncPanel = (activePanel: TargetPanel, change?: InspectionChange): void => {
    const sources = change?.sources ?? activePanel.editors.map((record) => record.source.name);
    const outputs = change?.outputs ?? activePanel.readonlys.flatMap(
      (record) => (record.outputName ? [record.outputName] : []),
    );
    for (const name of sources) activePanel.dirtySources.add(name);
    for (const name of outputs) activePanel.dirtyOutputs.add(name);
    if (activePanel.exportDetails.open && !activePanel.element.hidden) {
      try {
        const value = textValue(activePanel.target.export());
        const output = activePanel.exportArea;
        if (output.value !== value) output.value = value;
      } catch (error) {
        setStatus(activePanel, error instanceof Error ? error.message : String(error), true);
      }
    }
  };

  const clearPanels = (): void => {
    for (const panelForTarget of panels) {
      panelForTarget.exportDetails.removeEventListener('toggle', panelForTarget.exportListener);
      for (const { editor } of panelForTarget.editors) editor.dispose();
      panelForTarget.element.remove();
    }
    panels = [];
  };

  const selectionListener = (): void => {
    selectedTargetId = targetSelect.value;
    updateSelection();
  };
  targetSelect.addEventListener('change', selectionListener);

  const copyListener = async (): Promise<void> => {
    const panelForTarget = selectedPanel();
    if (!panelForTarget) return;
    try {
      panelForTarget.exportArea.value = textValue(panelForTarget.target.export());
      await options.copy(panelForTarget.target, panelForTarget.exportArea);
      if (!disposed) setStatus(panelForTarget, 'Copied.');
    } catch (error) {
      if (disposed) return;
      panelForTarget.exportArea.focus();
      panelForTarget.exportArea.select();
      setStatus(panelForTarget, error instanceof Error ? error.message : 'Copy unavailable; text selected.', true);
    }
  };
  copyButton.addEventListener('click', copyListener);

  return {
    setTargets(nextTargets): void {
      if (disposed) return;
      const bindingChanged = nextTargets.length !== targets.length
        || nextTargets.some((target, index) => target !== targets[index]);
      targets = nextTargets;
      if (!bindingChanged) {
        for (const panelForTarget of panels) syncPanel(panelForTarget);
        flushVisible();
        return;
      }
      const priorTargetId = selectedTargetId;
      clearPanels();
      targetsElement.replaceChildren();
      targetSelect.replaceChildren();
      if (targets.length === 0) {
        selectedTargetId = undefined;
        targetSelect.hidden = true;
        copyButton.hidden = true;
        const empty = createElement(document, 'p');
        empty.className = 'empty';
        empty.textContent = 'No inspectable themes.';
        targetsElement.append(empty);
        return;
      }
      panels = targets.map(createTargetPanel);
      for (const panelForTarget of panels) {
        targetsElement.append(panelForTarget.element);
        let input: Readonly<Record<string, unknown>> | undefined;
        try { input = panelForTarget.target.read(); } catch (error) {
          setStatus(panelForTarget, error instanceof Error ? error.message : String(error), true);
        }
        for (const record of panelForTarget.editors) {
          record.editor.configure({
            source: record.source,
            label: record.label,
            accessibleLabel: record.accessibleLabel,
            nonce: options.nonce,
            read: () => panelForTarget.target.readSource(record.source.name),
            commit: (value) => {
              panelForTarget.target.patch(sourcePatch(record.source.inputPath, value));
            },
          }, input === undefined ? undefined : readInputPath(input, record.source.inputPath));
        }
      }
      for (const panelForTarget of panels) {
        const option = createElement(document, 'option');
        option.value = panelForTarget.id;
        option.textContent = `${panelForTarget.id} · ${panelForTarget.target.manifest.root.selector}`;
        targetSelect.append(option);
      }
      selectedTargetId = panels.find((candidate) => candidate.id === priorTargetId)?.id
        ?? panels[0]!.id;
      targetSelect.value = selectedTargetId;
      targetSelect.hidden = panels.length < 2;
      updateSelection();
    },
    sync(change): void {
      if (disposed) return;
      for (const activePanel of panels) {
        if (change === undefined || activePanel.id === change.targetId) {
          syncPanel(activePanel, change);
        }
      }
      flushVisible();
    },
    setError(error?: string): void {
      if (!disposed) setMessage(error);
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      targetSelect.removeEventListener('change', selectionListener);
      copyButton.removeEventListener('click', copyListener);
      clearPanels();
      styleDispose();
      window.dispose();
    },
  };
}
