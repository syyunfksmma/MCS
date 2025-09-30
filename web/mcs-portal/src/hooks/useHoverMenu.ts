import { useCallback, useEffect, useRef, useState } from 'react';

export type HoverMenuOrigin = 'search' | 'tree';

export interface HoverMenuContext {
  routingId: string;
  routingCode: string;
  status?: string;
  origin: HoverMenuOrigin;
  anchorRect: DOMRect;
  isPinned?: boolean;
  slaBreached?: boolean;
  breachMs?: number;
  addinJobStatus?: string;
  canApprove?: boolean;
}

export interface UseHoverMenuOptions {
  openDelay?: number;
  closeDelay?: number;
}

export interface UseHoverMenuResult {
  context: HoverMenuContext | null;
  isOpen: boolean;
  open: (context: HoverMenuContext, options?: { immediate?: boolean }) => void;
  scheduleClose: (options?: { delay?: number }) => void;
  cancelClose: () => void;
  close: (options?: { immediate?: boolean }) => void;
}

const DEFAULT_OPEN_DELAY = 200;
const DEFAULT_CLOSE_DELAY = 150;

export function useHoverMenu({
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY
}: UseHoverMenuOptions = {}): UseHoverMenuResult {
  const [context, setContext] = useState<HoverMenuContext | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(
    (nextContext: HoverMenuContext, options?: { immediate?: boolean }) => {
      clearCloseTimer();
      clearOpenTimer();

      if (options?.immediate) {
        setContext(nextContext);
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        setContext(nextContext);
        openTimerRef.current = null;
      }, openDelay);
    },
    [clearCloseTimer, clearOpenTimer, openDelay]
  );

  const close = useCallback(
    (options?: { immediate?: boolean }) => {
      clearOpenTimer();
      if (options?.immediate) {
        clearCloseTimer();
        setContext(null);
        return;
      }

      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        setContext(null);
        closeTimerRef.current = null;
      }, closeDelay);
    },
    [clearCloseTimer, clearOpenTimer, closeDelay]
  );

  const scheduleClose = useCallback(
    (options?: { delay?: number }) => {
      const delay = options?.delay ?? closeDelay;
      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        setContext(null);
        closeTimerRef.current = null;
      }, delay);
    },
    [clearCloseTimer, closeDelay]
  );

  const cancelClose = useCallback(() => {
    clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearCloseTimer, clearOpenTimer]);

  return {
    context,
    isOpen: context !== null,
    open,
    scheduleClose,
    cancelClose,
    close
  };
}
