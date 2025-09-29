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
  window.scrollTo = vi.fn();
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

const generateStubUuid = () => `test-${Math.random().toString(16).slice(2)}`;

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: generateStubUuid
    }
  });
} else if (!("randomUUID" in globalThis.crypto)) {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: generateStubUuid
  });
}
