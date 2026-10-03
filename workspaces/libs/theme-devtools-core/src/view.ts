import type {
  InspectedTheme,
  InspectionChange,
  ManifestOutput,
  ManifestSource,
} from '@sabinmarcu/theme-core';
import { copyText } from './clipboard.js';
import { createCopyButton } from './copy-button.js';
import type { CopyButton } from './copy-button.js';
import {
  createColorFormatter,
  type ColorFormat,
} from './colors.js';
import {
  readInputPath,
  sourcePatch,
} from './inputs.js';
import {
  createJSONOverlay,
  type JSONOverlay,
} from './json-overlay.js';
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
  editable: boolean;
};

type FamilyPane = {
  readonly member?: string;
  readonly tab?: HTMLButtonElement;
  readonly element: HTMLElement;
  overlay?: JSONOverlay;
};

type TargetPanel = {
  readonly target: InspectedTheme;
  readonly id: string;
  readonly element: HTMLElement;
  readonly editors: readonly EditorRecord[];
  readonly readonlys: readonly ReadonlyRecord[];
  readonly status: HTMLElement;
  readonly panes: readonly FamilyPane[];
  readonly dirtySources: Set<string>;
  readonly dirtyOutputs: Set<string>;
};

const newNode = (): TreeNode => ({
  children: new Map(),
  editable: false,
});

const nodeAt = (root: TreeNode, path: readonly string[], editable = false): TreeNode => {
  let node = root;
  if (editable) node.editable = true;
  for (const segment of path) {
    let child = node.children.get(segment);
    if (!child) {
      child = newNode();
      node.children.set(segment, child);
    }
    node = child;
    if (editable) node.editable = true;
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
    presentation: options.presentation,
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
  const { memory } = options;
  /** Rendered branches per expansion key; family panes share keys and must agree. */
  const branches = new Map<string, Set<HTMLDetailsElement>>();
  let disposed = false;

  const targetSelect = createElement(document, 'select');
  targetSelect.className = 'target-select';
  targetSelect.setAttribute('aria-label', 'Inspected theme');
  targetSelect.hidden = true;
  const setupCopy = createCopyButton(document, {
    label: 'Copy setup JSON',
    className: 'tool-button',
  });
  const copyButton = setupCopy.element;
  copyButton.hidden = true;
  const rawButton = createElement(document, 'button');
  rawButton.type = 'button';
  rawButton.className = 'tool-button';
  rawButton.textContent = 'Raw';
  rawButton.setAttribute('aria-label', 'Show raw setup JSON');
  rawButton.hidden = true;
  const setupTools = createElement(document, 'div');
  setupTools.className = 'json-tools setup-tools';
  setupTools.append(copyButton, rawButton);
  const colorFormatLabel = createElement(document, 'label');
  colorFormatLabel.className = 'color-format-label';
  colorFormatLabel.textContent = 'Color format';
  const colorFormatSelect = createElement(document, 'select');
  colorFormatSelect.className = 'target-select';
  colorFormatSelect.setAttribute('aria-label', 'Color format');
  colorFormatSelect.title = 'Output format for all color edits';
  for (const [value, label] of [['hex', 'Hex'], ['oklch', 'OKLCH'], ['hsl', 'HSL'], ['rgb', 'RGB']]) {
    const option = createElement(document, 'option');
    option.value = value!;
    option.textContent = label!;
    colorFormatSelect.append(option);
  }
  colorFormatSelect.value = memory.colorFormat() ?? 'hex';
  colorFormatLabel.append(colorFormatSelect);
  const colorFormatListener = (): void => {
    memory.setColorFormat(colorFormatSelect.value as ColorFormat);
  };
  colorFormatSelect.addEventListener('change', colorFormatListener);
  const formatColor = createColorFormatter(document);
  window.tools.append(targetSelect, colorFormatLabel, setupTools);

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

  const selectedPanel = (): TargetPanel | undefined => panels.find((panelForTarget) => (
    panelForTarget.id === selectedTargetId
  ));
  const setupOverlay = createJSONOverlay(window.surface, {
    label: 'Setup JSON',
    nonce: options.nonce,
    read() {
      const selected = selectedPanel();
      if (!selected) throw new Error('No inspected theme is selected');
      return selected.target.export();
    },
    onError: (error) => setMessage(error),
  });

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
    for (const entry of tree.children) if (entry[1].editor) orderedChildren.push(entry);
    for (const entry of tree.children) {
      if (!entry[1].editor && entry[1].editable) orderedChildren.push(entry);
    }
    for (const entry of tree.children) if (!entry[1].editable) orderedChildren.push(entry);
    for (const [name, node] of orderedChildren) {
      const branchPath = [...path, name];
      const isBranch = node.children.size > 0;
      const item = createElement(document, 'div');
      item.className = isBranch ? 'tree-branch' : 'tree-leaf';

      if (isBranch) {
        const details = createElement(document, 'details');
        details.className = 'branch';
        const key = expansionKey(targetId, scope, branchPath);
        details.open = memory.expanded(key) ?? false;
        const siblings = branches.get(key) ?? new Set<HTMLDetailsElement>();
        siblings.add(details);
        branches.set(key, siblings);
        const summary = createElement(document, 'summary');
        summary.textContent = name;
        summary.setAttribute('aria-label', `${details.open ? 'Collapse' : 'Expand'} ${branchPath.join('.')}`);
        details.addEventListener('toggle', () => {
          memory.setExpanded(key, details.open);
          for (const sibling of siblings) {
            if (sibling.open !== details.open) sibling.open = details.open;
          }
          summary.setAttribute('aria-label', `${details.open ? 'Collapse' : 'Expand'} ${branchPath.join('.')}`);
          if (details.open) flushVisible();
        });
        details.append(summary);

        if (node.editor) {
          const valueRow = createElement(document, 'div');
          valueRow.className = 'tree-value';
          valueRow.append(node.editor.editor);
          details.append(valueRow);
        }
        details.append(renderTree(node, targetId, scope, branchPath));
        if (node.readonlyLeaf) {
          const readonlyRow = createElement(document, 'div');
          readonlyRow.className = 'readonly-row';
          const keyLabel = createElement(document, 'span');
          keyLabel.className = 'tree-key';
          keyLabel.textContent = 'Computed';
          readonlyRow.append(keyLabel, node.readonlyLeaf.value);
          details.append(readonlyRow);
        }
        item.append(details);
      } else {
        if (node.editor) item.append(node.editor.editor);
        if (node.readonlyLeaf) {
          const row = createElement(document, 'div');
          row.className = 'tree-row';
          const keyLabel = createElement(document, 'span');
          keyLabel.className = 'tree-key';
          keyLabel.textContent = node.editor ? 'Computed' : name;
          row.append(keyLabel, node.readonlyLeaf.value);
          item.append(row);
        }
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
      if (!active) pane.overlay?.close();
      pane.tab!.setAttribute('aria-selected', String(active));
      pane.tab!.tabIndex = active ? 0 : -1;
    }
    flushVisible();
  };

  const copyFamilyInputs = async (
    target: InspectedTheme,
    pane: FamilyPane,
    action: CopyButton,
    trigger: HTMLElement,
    status: HTMLElement,
  ): Promise<void> => {
    const output = status;
    try {
      const inputs = readInputPath(target.export(), ['families', pane.member!]);
      await copyText(root, JSON.stringify(inputs, null, 2), options.nonce);
      if (!disposed && pane.element.isConnected) {
        output.textContent = `Copied ${pane.member} family JSON.`;
        Reflect.deleteProperty(output.dataset, 'error');
        action.show('copied');
      }
    } catch (error) {
      if (disposed || !pane.element.isConnected) return;
      action.show('failed');
      pane.overlay?.open(trigger);
      output.textContent = error instanceof Error ? error.message : 'Unable to copy family JSON';
      output.dataset.error = '';
    }
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
      const node = nodeAt(sharedTree, displayPath, true);
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
        pane.className = 'family-pane json-surface';
        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-labelledby', tab.id);
        pane.hidden = true;
        tab.setAttribute('aria-controls', `${tab.id}-panel`);
        pane.id = `${tab.id}-panel`;
        const familyTools = createElement(document, 'div');
        familyTools.className = 'json-tools family-tools';
        const copyFamily = createCopyButton(document, {
          label: 'Copy family JSON',
          className: 'tool-button',
          ariaLabel: `Copy ${member} family JSON`,
        });
        const rawFamily = createElement(document, 'button');
        rawFamily.type = 'button';
        rawFamily.className = 'tool-button';
        rawFamily.textContent = 'Raw';
        rawFamily.setAttribute('aria-label', `Show raw ${member} family JSON`);
        familyTools.append(copyFamily.element, rawFamily);
        pane.append(familyTools);
        const tree = newNode();

        for (const output of target.manifest.outputs) {
          if (outputBelongsToMember(output, member)) addReadonlyOutput(tree, output, readonlys);
        }
        for (const source of target.manifest.sources.filter(
          (candidate) => sourceBelongsToMember(candidate, member),
        )) {
          const displayPath = sourceDisplayPath(target, source);
          const node = nodeAt(tree, displayPath, true);
          const label = node.children.size > 0 ? 'value' : leafLabel(source, displayPath);
          node.editor = createEditor(target, source, displayPath, label, editors);
        }
        // One expansion scope for every member: the trees share a shape, so opening a branch in
        // one family keeps it open in the others (and across sidebar selections).
        if (tree.children.size > 0) pane.append(renderTree(tree, target.manifest.id, 'family'));
        else {
          const empty = createElement(document, 'p');
          empty.className = 'empty';
          empty.textContent = `No sources or contract values for ${member}.`;
          pane.append(empty);
        }
        const paneRecord: FamilyPane = {
          member,
          tab,
          element: pane,
        };
        panes.push(paneRecord);
        copyFamily.element.addEventListener('click', () => (
          copyFamilyInputs(target, paneRecord, copyFamily, rawFamily, status)
        ));
        rawFamily.addEventListener('click', () => paneRecord.overlay?.open(rawFamily));
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

    element.append(metadata, sharedSection, familySection, status);
    const targetPanel: TargetPanel = {
      target,
      id: target.manifest.id,
      element,
      editors,
      readonlys,
      status,
      panes,
      dirtySources: new Set(),
      dirtyOutputs: new Set(readonlys.flatMap(
        (record) => (record.outputName ? [record.outputName] : []),
      )),
    };
    return targetPanel;
  };

  const updateSelection = (): void => {
    const selected = selectedPanel();
    for (const panelForTarget of panels) {
      panelForTarget.element.hidden = panelForTarget !== selected;
      if (panelForTarget !== selected) {
        for (const pane of panelForTarget.panes) pane.overlay?.close();
      }
    }
    copyButton.hidden = selected === undefined;
    rawButton.hidden = selected === undefined;
    if (selected) setupOverlay.sync();
    else setupOverlay.close();
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
    if (!activePanel.element.hidden) {
      for (const pane of activePanel.panes) {
        if (!pane.element.hidden) pane.overlay?.sync();
      }
      if (activePanel.id === selectedTargetId) setupOverlay.sync();
    }
  };

  const clearPanels = (): void => {
    setupOverlay.close();
    for (const panelForTarget of panels) {
      for (const pane of panelForTarget.panes) pane.overlay?.dispose();
      for (const { editor } of panelForTarget.editors) editor.dispose();
      panelForTarget.element.remove();
    }
    panels = [];
    branches.clear();
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
      await copyText(root, JSON.stringify(panelForTarget.target.export(), null, 2), options.nonce);
      if (!disposed) {
        setStatus(panelForTarget, 'Copied.');
        setupCopy.show('copied');
      }
    } catch (error) {
      if (disposed || !panelForTarget.element.isConnected) return;
      setupCopy.show('failed');
      setupOverlay.open(rawButton);
      setStatus(panelForTarget, error instanceof Error ? error.message : 'Unable to copy setup JSON', true);
    }
  };
  copyButton.addEventListener('click', copyListener);
  const rawListener = (): void => setupOverlay.open(rawButton);
  rawButton.addEventListener('click', rawListener);

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
        rawButton.hidden = true;
        const empty = createElement(document, 'p');
        empty.className = 'empty';
        empty.textContent = 'No inspectable themes.';
        targetsElement.append(empty);
        return;
      }
      panels = targets.map(createTargetPanel);
      for (const panelForTarget of panels) {
        targetsElement.append(panelForTarget.element);
        for (const pane of panelForTarget.panes) {
          pane.overlay = createJSONOverlay(pane.element, {
            label: `${pane.member} family JSON`,
            nonce: options.nonce,
            read: () => readInputPath(panelForTarget.target.export(), ['families', pane.member!]),
            onError: (error) => setStatus(panelForTarget, error, true),
          });
        }
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
            formatColor: (value) => formatColor(value, colorFormatSelect.value as ColorFormat),
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
      colorFormatSelect.removeEventListener('change', colorFormatListener);
      copyButton.removeEventListener('click', copyListener);
      setupCopy.reset();
      rawButton.removeEventListener('click', rawListener);
      setupOverlay.dispose();
      clearPanels();
      styleDispose();
      window.dispose();
    },
  };
}
