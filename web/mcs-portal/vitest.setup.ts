import "@testing-library/jest-dom";
import { vi } from "vitest";

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

if (!window.scrollTo) {
  window.scrollTo = vi.fn((..._args: unknown[]) => undefined) as unknown as typeof window.scrollTo;
}

Element.prototype.scrollIntoView = vi.fn();

window.getComputedStyle = vi.fn().mockImplementation(() => ({
  getPropertyValue: () => '',
  getPropertyPriority: () => '',
  item: () => '',
  removeProperty: () => '',
  setProperty: () => undefined,
  length: 0,
  parentRule: null
})) as typeof window.getComputedStyle;

if (!('ResizeObserver' in window)) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}

if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
    configurable: true,
  });
}

const generateStubUuid = () => `test-${Math.random().toString(16).slice(2)}`;

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: generateStubUuid,
    },
  });
} else if (!('randomUUID' in globalThis.crypto)) {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: generateStubUuid,
  });
}

