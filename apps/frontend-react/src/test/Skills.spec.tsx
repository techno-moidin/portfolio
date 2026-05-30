import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { Skills } from '../components/Skills';
import { RoleProvider } from '../utils/RoleContext';
import React from 'react';

// Wrapper helper
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <RoleProvider>
      {ui}
    </RoleProvider>
  );
};

describe('Skills Component & Offline Fallback', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render correct tech skill categories from RESUME_DATA', () => {
    renderWithProvider(<Skills />);
    
    expect(screen.getByText('Frontend Engineering')).toBeInTheDocument();
    expect(screen.getByText('Core Systems')).toBeInTheDocument();
    expect(screen.getByText('Database Management')).toBeInTheDocument();
  });

  it('should successfully make fetch calls and display API metrics on click in HR view', async () => {
    // Mock successful API response
    const mockSkillsData = {
      score: 98,
      comment: 'Elite compatibility resolved by backend!',
      highlights: ['Developed Elasticsearch platform.', 'Managed distributed workers.'],
      highlightedProjects: ['1', '3']
    };

    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSkillsData,
    });

    renderWithProvider(<Skills />);

    // Click on NestJS chip
    const nestJsButton = screen.getByRole('button', { name: 'NestJS' });
    fireEvent.click(nestJsButton);

    // Verify loading or resolved state
    await waitFor(() => {
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('Elite compatibility resolved by backend!')).toBeInTheDocument();
      expect(screen.getByText('Developed Elasticsearch platform.')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/api/portfolio/skills?match=NestJS');
  });

  it('should seamlessly execute local fallback simulations if backend throws network error', async () => {
    // Mock network error to trigger the catch-block local fallback
    (globalThis.fetch as Mock).mockRejectedValueOnce(new Error('Network connection timeout'));

    renderWithProvider(<Skills />);

    // Click on React chip
    const reactButton = screen.getByRole('button', { name: 'React' });
    fireEvent.click(reactButton);

    // Verify that the fallback triggers local simulation data correctly (React local fallback has 96% score)
    await waitFor(() => {
      expect(screen.getByText('96%')).toBeInTheDocument();
      expect(screen.getByText('Highly compatible! Engineered core React states and Redux wrappers across 3 major SaaS platforms.')).toBeInTheDocument();
      expect(screen.getByText('Built MuxEmail dashboard.')).toBeInTheDocument();
    });

    // Confirms fetch was called first and then gracefully degraded
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
