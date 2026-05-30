import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver (used for scroll reveals and count-ups in App.tsx)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock requestAnimationFrame (used inside ParticleCanvas.tsx canvas animation loop)
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(performance.now()), 16);
  },
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: (id: number) => {
    clearTimeout(id);
  },
});

// Mock fetch globally
globalThis.fetch = vi.fn();

