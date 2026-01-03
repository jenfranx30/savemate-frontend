import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockIndividualUser } from '../test-utils';
import Navbar from './Navbar';
import * as AuthContext from '../context/AuthContext';
import * as AuthModalContext from '../context/AuthModalContext';

describe('Navbar Component', () => {
  it('renders SaveMate logo', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/SaveMate/i)).toBeInTheDocument();
  });

  it('renders main navigation buttons', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByRole('button', { name: /deals/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('shows Sign In button when user is not logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      loading: false
    });

    renderWithProviders(<Navbar />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows My Profile button when user is logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockIndividualUser,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      loading: false
    });

    renderWithProviders(<Navbar />);
    expect(screen.getByRole('button', { name: /my profile/i })).toBeInTheDocument();
  });

  it('shows mobile menu toggle button', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });
});
