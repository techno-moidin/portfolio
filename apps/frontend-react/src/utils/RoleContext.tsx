import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'HR' | 'CEO' | 'CTO';

interface RoleContextType {
  role: UserRole;
  transitionStatus: 'idle' | 'fading-out' | 'fading-in';
  switchRole: (newRole: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('HR');
  const [transitionStatus, setTransitionStatus] = useState<'idle' | 'fading-out' | 'fading-in'>('idle');

  const switchRole = useCallback((newRole: UserRole) => {
    if (newRole === role) return;

    // Start 200ms fade-out sequence
    setTransitionStatus('fading-out');

    setTimeout(() => {
      // Re-hydrate role content after fade-out completes
      setRole(newRole);
      setTransitionStatus('fading-in');

      // End 300ms fade-in sequence
      setTimeout(() => {
        setTransitionStatus('idle');
      }, 300);

    }, 200);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, transitionStatus, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
