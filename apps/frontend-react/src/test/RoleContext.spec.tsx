import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RoleProvider, useRole } from '../utils/RoleContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RoleProvider>{children}</RoleProvider>
);

describe('RoleContext Transition State Machine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default role "HR" and status "idle"', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    expect(result.current.role).toBe('HR');
    expect(result.current.transitionStatus).toBe('idle');
  });

  it('should trigger fade-out sequence immediately on switchRole', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => {
      result.current.switchRole('CEO');
    });

    // Immediately after triggering switchRole, we should fade out
    expect(result.current.transitionStatus).toBe('fading-out');
    expect(result.current.role).toBe('HR'); // Role shouldn't change yet
  });

  it('should progress to fading-in and switch role after 200ms', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => {
      result.current.switchRole('CEO');
    });

    // Fast-forward 200ms (completes fade-out step)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.role).toBe('CEO');
    expect(result.current.transitionStatus).toBe('fading-in');
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
});
