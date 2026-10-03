import type { SourceRepresentation } from '@sabinmarcu/theme-core';
import {
  formatSourceInput,
  parseSourceInput,
} from './inputs.js';
import { editorStyles } from './editor.styles.js';
import { attachStyles } from './styles.js';
import type { SourceEditorOptions } from './types.js';

const createElement = <Name extends keyof HTMLElementTagNameMap>(
  document: Document,
  name: Name,
): HTMLElementTagNameMap[Name] => document.createElement(name);

type EditableControl = HTMLInputElement | HTMLTextAreaElement;

const describeCodec = (codec: SourceRepresentation, isBoolean: boolean): string => {
  if (isBoolean) return 'Bool';
  if (codec.kind === 'number') return codec.unit ? `N ${codec.unit}` : 'N';
  if (codec.kind === 'color') return 'CSS';
  if (codec.kind === 'json') return 'JSON';
  return 'Text';
};

/** Create a deferred source editor constructor in its supplied owner realm. */
export function createSourceEditorClass(
  realm: Window & typeof globalThis,
): CustomElementConstructor {
  const BaseElement = realm.HTMLElement;

  return class ThemeSourceEditor extends BaseElement {
    static readonly themeDevtoolsVersion = '2';

    #options: SourceEditorOptions | undefined;

    #control: EditableControl | undefined;

    #picker: HTMLInputElement | undefined;

    #styleDispose: (() => void) | undefined;

    #dirty = false;

    #disposed = false;

    #booleanControl = false;

    #shadow: ShadowRoot;

    #root: HTMLDivElement;

    #label: HTMLLabelElement;

    #meta: HTMLSpanElement;

    #fieldRow: HTMLDivElement;

    #unit: HTMLSpanElement;

    #error: HTMLDivElement;

    constructor() {
      super();
      const document = this.ownerDocument;
      this.#shadow = this.attachShadow({ mode: 'open' });
      this.#root = createElement(document, 'div');
      this.#root.className = 'editor';
      this.#label = createElement(document, 'label');
      this.#label.className = 'label';
      this.#meta = createElement(document, 'span');
      this.#meta.className = 'meta';
      this.#fieldRow = createElement(document, 'div');
      this.#fieldRow.className = 'field-row';
      this.#unit = createElement(document, 'span');
      this.#unit.className = 'unit';
      this.#unit.hidden = true;
      this.#error = createElement(document, 'div');
      this.#error.className = 'error';
      this.#error.id = 'source-editor-error';
      this.#error.setAttribute('role', 'alert');
      this.#error.setAttribute('aria-atomic', 'true');
      this.#error.hidden = true;
      this.#root.append(this.#label, this.#meta, this.#fieldRow, this.#error);
      this.#shadow.append(this.#root);
    }

    configure(options: SourceEditorOptions, initialValue: unknown): void {
      if (this.#disposed) throw new Error('Cannot configure a disposed source editor');
      this.#options = options;
      this.dataset.sourceName = options.source.name;
      this.dataset.inputPath = JSON.stringify(options.source.inputPath);
      this.#styleDispose?.();
      this.#styleDispose = attachStyles(this.#shadow, 'editor', editorStyles, options.nonce);
      this.#label.textContent = options.label;
      this.#setControl(options.source.codec, initialValue);
      this.#dirty = false;
      Reflect.deleteProperty(this.dataset, 'dirty');
      this.#setError();
      this.#writeValue(initialValue);
    }

    sync(value: unknown): void {
      if (!this.#options || this.#disposed || this.#dirty || this.#root.matches(':focus-within')) return;
      if (this.#options.source.codec.kind === 'json'
        && this.#booleanControl !== (typeof value === 'boolean')) {
        this.#setControl(this.#options.source.codec, value);
      }
      this.#setError();
      this.#writeValue(value);
    }

    dispose(): void {
      if (this.#disposed) return;
      this.#disposed = true;
      this.#removeControlListeners();
      this.#styleDispose?.();
      this.#styleDispose = undefined;
      this.#options = undefined;
      this.#control = undefined;
      this.#picker = undefined;
      this.#shadow.replaceChildren();
    }

    #setControl(codec: SourceRepresentation, initialValue: unknown): void {
      this.#removeControlListeners();
      const document = this.ownerDocument;
      this.#booleanControl = codec.kind === 'json' && typeof initialValue === 'boolean';
      const control = createElement(document, codec.kind === 'json' && !this.#booleanControl ? 'textarea' : 'input');
      const accessibleLabel = this.#options?.accessibleLabel ?? this.#options?.label ?? 'Source value';
      control.className = 'control';
      control.id = 'source-editor-value';
      control.setAttribute('aria-label', accessibleLabel);
      control.setAttribute('aria-describedby', this.#error.id);

      if (control instanceof realm.HTMLInputElement) {
        if (this.#booleanControl) {
          control.type = 'checkbox';
        } else if (codec.kind === 'number') {
          control.type = 'number';
          control.step = 'any';
          control.inputMode = 'decimal';
        } else {
          control.type = 'text';
        }
      } else {
        control.spellcheck = false;
      }

      control.addEventListener('input', this.#input);
      control.addEventListener('change', this.#change);
      control.addEventListener('blur', this.#blur);
      control.addEventListener('keydown', this.#keyDown);
      this.#control = control;
      this.#picker = undefined;
      this.#label.htmlFor = control.id;
      this.#meta.textContent = describeCodec(codec, this.#booleanControl);
      this.#unit.hidden = codec.kind !== 'number' || !codec.unit;
      this.#unit.textContent = codec.kind === 'number' ? codec.unit ?? '' : '';

      if (codec.kind === 'color') {
        const picker = createElement(document, 'input');
        picker.className = 'picker';
        picker.type = 'color';
        picker.setAttribute('aria-label', `${accessibleLabel} color picker`);
        picker.setAttribute('alpha', '');
        picker.setAttribute('colorspace', 'display-p3');
        picker.addEventListener('input', this.#pickColor);
        picker.addEventListener('change', this.#pickColor);
        this.#picker = picker;

        const disclosure = createElement(document, 'details');
        disclosure.className = 'css-disclosure';
        const summary = createElement(document, 'summary');
        summary.textContent = 'CSS';
        summary.setAttribute('aria-label', `${accessibleLabel} CSS value`);
        disclosure.append(summary, control);
        this.#fieldRow.replaceChildren(picker, disclosure, this.#unit);
      } else {
        this.#fieldRow.replaceChildren(control, this.#unit);
      }
    }

    #removeControlListeners(): void {
      this.#control?.removeEventListener('input', this.#input);
      this.#control?.removeEventListener('change', this.#change);
      this.#control?.removeEventListener('blur', this.#blur);
      this.#control?.removeEventListener('keydown', this.#keyDown);
      this.#picker?.removeEventListener('input', this.#pickColor);
      this.#picker?.removeEventListener('change', this.#pickColor);
    }

    #writeValue(value: unknown): boolean {
      if (!this.#options || !this.#control) return false;
      try {
        const text = formatSourceInput(value, this.#options.source.codec);
        if (this.#booleanControl && this.#control instanceof realm.HTMLInputElement) {
          if (this.#control.checked !== (value === true)) this.#control.checked = value === true;
        } else if (this.#control.value !== text) this.#control.value = text;
        if (this.#options.source.codec.kind === 'color' && this.#picker) {
          const symbolic = /\b(?:var|env|light-dark)\s*\(/i.test(text);
          if (!symbolic && realm.CSS.supports('color', text)) {
            if (this.#picker.value !== text) this.#picker.value = text;
            if (this.#picker.title !== text) this.#picker.title = text;
            Reflect.deleteProperty(this.dataset, 'colorUnsupported');
          } else {
            this.dataset.colorUnsupported = '';
            this.#picker.title = 'Choose a color to replace this CSS expression, or edit its CSS value';
          }
        }
        return true;
      } catch (error) {
        this.#setError(error instanceof Error ? error.message : 'Unable to display the current value');
        return false;
      }
    }

    #draft(): string {
      if (!this.#control) return '';
      if (this.#booleanControl && this.#control instanceof realm.HTMLInputElement) {
        return this.#control.checked ? 'true' : 'false';
      }
      return this.#control.value;
    }

    #setDirty(): void {
      this.#dirty = true;
      this.dataset.dirty = '';
    }

    #clearDirty(): void {
      this.#dirty = false;
      Reflect.deleteProperty(this.dataset, 'dirty');
    }

    #input = (): void => {
      if (!this.#options || !this.#control) return;
      this.#setDirty();
      try {
        parseSourceInput(this.#draft(), this.#options.source.codec);
        this.#setError();
      } catch (error) {
        this.#setError(error instanceof Error ? error.message : 'Invalid draft');
      }
    };

    #change = (): void => {
      if (this.#booleanControl) this.#setDirty();
      this.#commitDraft();
    };

    #blur = (): void => {
      if (this.#dirty) this.#commitDraft();
      else if (this.#options) this.#writeValue(this.#options.read());
    };

    #keyDown = (event: Event): void => {
      if (!(event instanceof realm.KeyboardEvent)) return;
      if (event.key === 'Escape' && this.#dirty) {
        event.preventDefault();
        this.#discardDraft();
        return;
      }
      if (event.key !== 'Enter' || event.isComposing) return;
      if (this.#control instanceof realm.HTMLTextAreaElement
        && !event.ctrlKey && !event.metaKey) return;
      if (this.#commitDraft()) event.preventDefault();
    };

    #pickColor = (): void => {
      if (!this.#options || !this.#picker) return;
      try {
        const pickerValue = this.#picker.value;
        if (this.#options.read() === pickerValue) return;
        this.#options.commit(pickerValue);
        const canonical = this.#options.read();
        this.#clearDirty();
        this.#setError();
        this.#writeValue(canonical);
      } catch (error) {
        this.#setError(error instanceof Error ? error.message : 'Unable to apply this color');
      }
    };

    #commitDraft(): boolean {
      if (!this.#options || !this.#control || !this.#dirty) return false;
      try {
        const value = parseSourceInput(this.#draft(), this.#options.source.codec);
        this.#options.commit(value);
        const canonical = this.#options.read();
        this.#clearDirty();
        this.#setError();
        this.#writeValue(canonical);
        return true;
      } catch (error) {
        this.#setError(error instanceof Error ? error.message : 'Unable to apply this value');
        return false;
      }
    }

    #discardDraft(): void {
      if (!this.#options || !this.#dirty) return;
      try {
        const current = this.#options.read();
        if (!this.#writeValue(current)) return;
        this.#clearDirty();
        this.#setError();
      } catch (error) {
        this.#setError(error instanceof Error ? error.message : 'Unable to read the current value');
      }
    }

    #setError(message?: string): void {
      if (message) {
        this.dataset.error = '';
        this.#error.textContent = message;
        this.#error.hidden = false;
        this.#control?.setAttribute('aria-invalid', 'true');
        return;
      }
      Reflect.deleteProperty(this.dataset, 'error');
      this.#error.textContent = '';
      this.#error.hidden = true;
      this.#control?.removeAttribute('aria-invalid');
    }
  };
}
