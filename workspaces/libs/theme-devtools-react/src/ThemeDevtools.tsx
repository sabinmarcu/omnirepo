'use client';

import { createThemeDevtools } from '@sabinmarcu/theme-devtools-core';
import type {
  ThemeDevtools as ThemeDevtoolsController,
  ThemeDevtoolsOptions,
  ThemeInputExport,
} from '@sabinmarcu/theme-devtools-core';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';

export type ThemeDevtoolsHandle = ThemeDevtoolsController;

/** The React host always owns a document inspection; supplied inspections stay native-only. */
type LocalThemeDevtoolsOptions = Extract<ThemeDevtoolsOptions, { readonly inspection?: undefined }>;

export type ThemeDevtoolsProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'onChange' | 'onError' | keyof LocalThemeDevtoolsOptions
> & LocalThemeDevtoolsOptions & {
  readonly onReady?: (controller: ThemeDevtoolsHandle | null) => void;
  readonly onChange?: (inputs: readonly ThemeInputExport[]) => void;
  readonly onError?: (error: unknown) => void;
};

type Callbacks = Pick<ThemeDevtoolsProps, 'onReady' | 'onChange' | 'onError' | 'onClose'>;

/**
 * Client-only host for the native devtools controller. Application theme sources
 * remain owned by their existing runtime; this component owns only the private UI.
 */
export const ThemeDevtools = forwardRef<ThemeDevtoolsHandle | null, ThemeDevtoolsProps>(
  ({
    manifests,
    inspectionDocument,
    nonce,
    shadowMode,
    presentation,
    ui,
    onReady,
    onChange,
    onError,
    onClose,
    ...hostProps
  }, forwardedReference) => {
    const hostReference = useRef<HTMLDivElement>(null);
    const controllerReference = useRef<ThemeDevtoolsHandle | null>(null);
    const callbacksReference = useRef<Callbacks>({
      onReady,
      onChange,
      onError,
      onClose,
    });
    const mountedManifestsReference = useRef<typeof manifests>(undefined);
    const mountedUIReference = useRef<typeof ui>(undefined);
    const latestInputsReference = useRef({
      manifests,
      ui,
    });
    const [controller, setController] = useState<ThemeDevtoolsHandle | null>(null);
    const [error, setError] = useState<{ readonly cause: unknown } | null>(null);
    const [retry, setRetry] = useState(0);
    const hasChangeListener = onChange !== undefined;

    const reportError = useCallback((cause: unknown) => {
      setError({ cause });
      try {
        callbacksReference.current.onError?.(cause);
      } catch {
        // An error observer must not leave an owned native instance undisposed.
      }
    }, []);
    const reportReady = useCallback((instance: ThemeDevtoolsHandle | null) => {
      try {
        callbacksReference.current.onReady?.(instance);
      } catch (error_) {
        reportError(error_);
      }
    }, [reportError]);

    useEffect(() => {
      callbacksReference.current = {
        onReady,
        onChange,
        onError,
        onClose,
      };
    }, [onReady, onChange, onError, onClose]);

    useEffect(() => {
      latestInputsReference.current = {
        manifests,
        ui,
      };
    }, [manifests, ui]);

    useImperativeHandle<ThemeDevtoolsHandle | null, ThemeDevtoolsHandle | null>(
      forwardedReference,
      () => controller,
      [controller],
    );

    useEffect(() => {
      const container = hostReference.current;
      if (!container) return undefined;
      const inputs = latestInputsReference.current;

      mountedManifestsReference.current = inputs.manifests;
      mountedUIReference.current = inputs.ui;

      let instance: ThemeDevtoolsHandle;
      try {
        instance = createThemeDevtools(container, {
          manifests: inputs.manifests,
          inspectionDocument,
          nonce,
          shadowMode,
          presentation,
          ui: inputs.ui,
          onClose: () => callbacksReference.current.onClose?.(),
        });
      } catch (error_) {
        reportError(error_);
        return undefined;
      }

      controllerReference.current = instance;
      setController(instance);
      setError(null);
      reportReady(instance);

      return () => {
        try {
          instance.destroy();
        } catch (error_) {
          reportError(error_);
        } finally {
          if (controllerReference.current === instance) controllerReference.current = null;
          setController((current) => (current === instance ? null : current));
          reportReady(null);
        }
      };
    }, [inspectionDocument, nonce, presentation, reportError, reportReady, retry, shadowMode]);

    useEffect(() => {
      const instance = controllerReference.current;
      if (!instance) {
        if (mountedManifestsReference.current !== manifests) {
          mountedManifestsReference.current = manifests;
          setRetry((attempt) => attempt + 1);
        }
        return;
      }
      if (mountedManifestsReference.current === manifests) return;

      mountedManifestsReference.current = manifests;
      try {
        instance.setManifests(manifests);
        setError(null);
      } catch (error_) {
        reportError(error_);
      }
    }, [manifests, reportError]);

    useEffect(() => {
      const instance = controllerReference.current;
      if (!instance) {
        if (mountedUIReference.current !== ui) {
          mountedUIReference.current = ui;
          setRetry((attempt) => attempt + 1);
        }
        return;
      }
      if (mountedUIReference.current === ui) return;

      mountedUIReference.current = ui;
      if (!ui) return;

      try {
        instance.updateUI(ui);
        setError(null);
      } catch (error_) {
        reportError(error_);
      }
    }, [reportError, ui]);

    useEffect(() => {
      if (!controller) return undefined;
      if (!hasChangeListener) return undefined;
      try {
        return controller.subscribe(() => {
          try {
            const listener = callbacksReference.current.onChange;
            if (listener) {
              const inputs = controller.exportInputs();
              setError(null);
              listener(inputs);
            }
          } catch (error_) {
            reportError(error_);
          }
        });
      } catch (error_) {
        reportError(error_);
        return undefined;
      }
    }, [controller, hasChangeListener, reportError]);

    return (
      <>
        <div {...hostProps} ref={hostReference} />
        {error === null
          ? null
          : (
            <p role="alert">
              {error.cause instanceof Error ? error.cause.message : String(error.cause)}
            </p>
          )}
      </>
    );
  },
);
