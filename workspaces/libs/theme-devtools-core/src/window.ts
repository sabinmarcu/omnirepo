import { attachStyles } from './styles.js';
import { windowStyles } from './window.styles.js';

export type InspectorWindowOptions = {
  readonly nonce?: string;
  close(): void;
  refresh(): void;
};

/** Own only window placement and interaction; never an inspected theme allocation. */
export function createInspectorWindow(root: ShadowRoot, options: InspectorWindowOptions) {
  const document = root.ownerDocument;
  const realm = document.defaultView;
  if (!realm) throw new Error('The inspector window requires an active owner document');
  const host = root.host as HTMLElement;
  const previous = {
    popover: host.getAttribute('popover'),
    role: host.getAttribute('role'),
    label: host.getAttribute('aria-label'),
    modal: host.getAttribute('aria-modal'),
    left: host.style.getPropertyValue('--devtools-theme-window-position-x'),
    top: host.style.getPropertyValue('--devtools-theme-window-position-y'),
    leftPriority: host.style.getPropertyPriority('--devtools-theme-window-position-x'),
    topPriority: host.style.getPropertyPriority('--devtools-theme-window-position-y'),
  };
  host.setAttribute('popover', 'manual');
  host.setAttribute('role', 'dialog');
  host.setAttribute('aria-label', 'Theme inspector');
  host.setAttribute('aria-modal', 'false');

  const panel = document.createElement('section');
  panel.className = 'inspector-window';
  const header = document.createElement('header');
  header.className = 'window-header';
  header.title = 'Drag to move the theme inspector';
  const grip = document.createElement('span');
  grip.className = 'window-grip';
  grip.textContent = '⠿';
  grip.setAttribute('aria-hidden', 'true');
  const title = document.createElement('h1');
  title.className = 'window-title';
  title.textContent = 'Theme inspector';
  const actions = document.createElement('div');
  actions.className = 'window-actions';
  const refresh = document.createElement('button');
  refresh.type = 'button';
  refresh.className = 'window-action';
  refresh.textContent = '↻';
  refresh.title = 'Refresh theme catalog';
  refresh.setAttribute('aria-label', 'Refresh theme catalog');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'window-action window-close';
  close.textContent = '×';
  close.title = 'Close theme inspector';
  close.setAttribute('aria-label', 'Close theme inspector');
  actions.append(refresh, close);
  header.append(grip, title, actions);
  const tools = document.createElement('div');
  tools.className = 'window-tools';
  const content = document.createElement('div');
  content.className = 'window-content';
  const surface = document.createElement('div');
  surface.className = 'window-surface';
  surface.append(content);
  panel.append(header, tools, surface);
  root.append(panel);
  const detachStyles = attachStyles(root, 'window', windowStyles, options.nonce);

  let disposed = false;
  let position: { x: number; y: number } | undefined;
  let drag: { id: number; x: number; y: number; left: number; top: number } | undefined;
  const bounds = () => {
    const viewport = realm.visualViewport;
    const rect = host.getBoundingClientRect();
    const left = viewport?.offsetLeft ?? 0;
    const top = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? realm.innerWidth;
    const height = viewport?.height ?? realm.innerHeight;
    return {
      minX: left + 12,
      minY: top + 12,
      maxX: left + Math.max(12, width - rect.width - 12),
      maxY: top + Math.max(12, height - rect.height - 12),
    };
  };
  const place = (x: number, y: number) => {
    const limits = bounds();
    position = {
      x: Math.min(limits.maxX, Math.max(limits.minX, x)),
      y: Math.min(limits.maxY, Math.max(limits.minY, y)),
    };
    host.style.setProperty('--devtools-theme-window-position-x', `${position.x}px`);
    host.style.setProperty('--devtools-theme-window-position-y', `${position.y}px`);
  };
  const constrain = () => {
    if (!disposed && position && host.matches(':popover-open')) place(position.x, position.y);
  };
  const finishDrag = () => {
    if (drag && header.hasPointerCapture(drag.id)) header.releasePointerCapture(drag.id);
    drag = undefined;
    Reflect.deleteProperty(host.dataset, 'dragging');
  };
  const startDrag = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0 || disposed) return;
    const { target } = event;
    if (target instanceof realm.Element && target.closest('button, input, select, textarea, a')) return;
    const rect = host.getBoundingClientRect();
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: rect.left,
      top: rect.top,
    };
    host.dataset.dragging = '';
    header.setPointerCapture(event.pointerId);
    event.preventDefault();
  };
  const moveDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    place(drag.left + event.clientX - drag.x, drag.top + event.clientY - drag.y);
  };
  const stopDrag = (event: PointerEvent) => {
    if (drag?.id === event.pointerId) finishDrag();
  };
  const closeWindow = () => {
    if (disposed) return;
    finishDrag();
    host.hidePopover();
    options.close();
  };
  const refreshCatalog = () => {
    try { options.refresh(); } catch (error) {
      const message = document.createElement('p');
      message.className = 'window-failure';
      message.setAttribute('role', 'alert');
      message.textContent = error instanceof Error ? error.message : String(error);
      content.prepend(message);
    }
  };
  const keydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    closeWindow();
  };
  const shown = (event: ToggleEvent) => {
    if (event.newState !== 'open') return;
    if (position) constrain();
    else {
      const limits = bounds();
      place(limits.maxX, Math.min(limits.maxY, limits.minY + 56));
    }
  };
  header.addEventListener('pointerdown', startDrag);
  header.addEventListener('pointermove', moveDrag);
  header.addEventListener('pointerup', stopDrag);
  header.addEventListener('pointercancel', stopDrag);
  header.addEventListener('lostpointercapture', stopDrag);
  close.addEventListener('click', closeWindow);
  refresh.addEventListener('click', refreshCatalog);
  root.addEventListener('keydown', keydown as EventListener);
  host.addEventListener('toggle', shown);
  realm.addEventListener('resize', constrain);
  realm.visualViewport?.addEventListener('resize', constrain);
  realm.visualViewport?.addEventListener('scroll', constrain);
  host.showPopover();
  const initial = bounds();
  place(initial.maxX, Math.min(initial.maxY, initial.minY + 56));

  return {
    content,
    surface,
    tools,
    title,
    dispose() {
      if (disposed) return;
      disposed = true;
      finishDrag();
      header.removeEventListener('pointerdown', startDrag);
      header.removeEventListener('pointermove', moveDrag);
      header.removeEventListener('pointerup', stopDrag);
      header.removeEventListener('pointercancel', stopDrag);
      header.removeEventListener('lostpointercapture', stopDrag);
      close.removeEventListener('click', closeWindow);
      refresh.removeEventListener('click', refreshCatalog);
      root.removeEventListener('keydown', keydown as EventListener);
      host.removeEventListener('toggle', shown);
      realm.removeEventListener('resize', constrain);
      realm.visualViewport?.removeEventListener('resize', constrain);
      realm.visualViewport?.removeEventListener('scroll', constrain);
      if (host.matches(':popover-open')) host.hidePopover();
      for (const [attribute, value] of Object.entries({
        popover: previous.popover,
        role: previous.role,
        'aria-label': previous.label,
        'aria-modal': previous.modal,
      })) {
        host.toggleAttribute(attribute, value !== null);
        if (value !== null) host.setAttribute(attribute, value);
      }
      host.style.setProperty('--devtools-theme-window-position-x', previous.left, previous.leftPriority);
      host.style.setProperty('--devtools-theme-window-position-y', previous.top, previous.topPriority);
      detachStyles();
      panel.remove();
    },
  };
}
