/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'HR' | 'CEO' | 'CTO';

interface RoleContextType {
  role: UserRole;
  transitionStatus: 'idle' | 'fading-out' | 'fading-in';
  onboardingCompleted: boolean;
  switchRole: (newRole: UserRole) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Helper function to extract initial state synchronously before first render
const getInitialRoleAndOnboarding = (): { initialRole: UserRole; initialOnboardingCompleted: boolean } => {
  if (typeof window !== 'undefined') {
    try {
      // Step A: Parse URL query parameter (ref or role)
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('role');
      if (ref) {
        const lowerRef = ref.toLowerCase();
        let matchedRole: UserRole | null = null;
        if (['cto', 'engineer', 'tech-lead', 'techlead', 'technical-lead'].includes(lowerRef)) {
          matchedRole = 'CTO';
        } else if (['ceo', 'founder', 'product', 'product-manager', 'productmanager'].includes(lowerRef)) {
          matchedRole = 'CEO';
        } else if (['hr', 'recruiter', 'hiring', 'software-engineer', 'softwareengineer'].includes(lowerRef)) {
          matchedRole = 'HR';
        }

        if (matchedRole) {
          localStorage.setItem('role_perspective', matchedRole);
          localStorage.setItem('onboarding_completed', 'true');
          return { initialRole: matchedRole, initialOnboardingCompleted: true };
        }
      }

      // Step B: Retrieve from LocalStorage Choice Retention
      const cachedRole = localStorage.getItem('role_perspective');
      const onboardingDone = localStorage.getItem('onboarding_completed') === 'true';
      if (onboardingDone && (cachedRole === 'HR' || cachedRole === 'CEO' || cachedRole === 'CTO')) {
        return { initialRole: cachedRole as UserRole, initialOnboardingCompleted: true };
      }
    } catch (e) {
      console.error('Error parsing initial role or onboarding settings', e);
    }
  }

  // Step C: Fallback to Recruiter role, displaying the gateway modal
  return { initialRole: 'HR', initialOnboardingCompleted: false };
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { initialRole, initialOnboardingCompleted } = getInitialRoleAndOnboarding();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(initialOnboardingCompleted);
  const [transitionStatus, setTransitionStatus] = useState<'idle' | 'fading-out' | 'fading-in'>('idle');

  const setOnboardingCompleted = useCallback((completed: boolean) => {
    setOnboardingCompletedState(completed);
    try {
      localStorage.setItem('onboarding_completed', completed ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to write onboarding state to localStorage', e);
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    if (newRole === role) return;

    // Start 200ms fade-out sequence
    setTransitionStatus('fading-out');

    setTimeout(() => {
      // Re-hydrate role content after fade-out completes
      setRole(newRole);
      setTransitionStatus('fading-in');
      setOnboardingCompletedState(true);

      // Persist the choice to localStorage
      try {
        localStorage.setItem('role_perspective', newRole);
        localStorage.setItem('onboarding_completed', 'true');
      } catch (e) {
        console.error('Failed to save selected role to localStorage', e);
      }

      // End 300ms fade-in sequence
      setTimeout(() => {
        setTransitionStatus('idle');
      }, 300);

    }, 200);
  }, [role]);

  return (
    <RoleContext.Provider 
      value={{ 
        role, 
        transitionStatus, 
        onboardingCompleted, 
        switchRole, 
        setOnboardingCompleted 
      }}
    >
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
