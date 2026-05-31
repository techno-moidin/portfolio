import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RoleProvider, useRole } from '../utils/RoleContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RoleProvider>{children}</RoleProvider>
);

describe('RoleContext Transition State Machine & Onboarding Gateway', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    vi.useFakeTimers();
    store = {};

    // Mock Storage.prototype methods cleanly
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value;
    });
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      store = {};
    });

    // Mock window.location for query param testing
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        search: '',
        pathname: '/',
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with default role "HR" and onboardingCompleted "false"', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    expect(result.current.role).toBe('HR');
    expect(result.current.onboardingCompleted).toBe(false);
    expect(result.current.transitionStatus).toBe('idle');
  });

  it('should initialize with CTO role and skip onboarding if ?ref=cto query parameter is present', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        search: '?ref=cto',
        pathname: '/',
      },
    });

    const { result } = renderHook(() => useRole(), { wrapper });
    expect(result.current.role).toBe('CTO');
    expect(result.current.onboardingCompleted).toBe(true);
    expect(store['role_perspective']).toBe('CTO');
    expect(store['onboarding_completed']).toBe('true');
  });

  it('should load role from localStorage choice retention on startup', () => {
    store['role_perspective'] = 'CEO';
    store['onboarding_completed'] = 'true';

    const { result } = renderHook(() => useRole(), { wrapper });
    expect(result.current.role).toBe('CEO');
    expect(result.current.onboardingCompleted).toBe(true);
  });

  it('should progress to fading-in and switch role after 200ms when switchRole is called', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => {
      result.current.switchRole('CEO');
    });

    // Immediately after triggering switchRole, we should fade out
    expect(result.current.transitionStatus).toBe('fading-out');
    expect(result.current.role).toBe('HR'); // Role shouldn't change yet

    // Fast-forward 200ms (completes fade-out step)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.role).toBe('CEO');
    expect(result.current.transitionStatus).toBe('fading-in');
    expect(result.current.onboardingCompleted).toBe(true);
    expect(store['role_perspective']).toBe('CEO');
    expect(store['onboarding_completed']).toBe('true');
  });

  it('should restore to idle status after 200ms + 300ms transition finishes', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => {
      result.current.switchRole('CTO');
    });

    // Fast-forward 500ms total
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.role).toBe('CTO');
    expect(result.current.transitionStatus).toBe('idle');
  });

  it('should ignore duplicate role switches and remain idle', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => {
      result.current.switchRole('HR'); // Switching to active role
    });

    expect(result.current.transitionStatus).toBe('idle');
    expect(result.current.role).toBe('HR');
  });

  it('should allow manually completing onboarding', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    expect(result.current.onboardingCompleted).toBe(false);

    act(() => {
      result.current.setOnboardingCompleted(true);
    });

    expect(result.current.onboardingCompleted).toBe(true);
    expect(store['onboarding_completed']).toBe('true');
  });
});
