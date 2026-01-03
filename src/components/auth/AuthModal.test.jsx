import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, TEST_ACCOUNTS } from '../../test-utils';
import AuthModal from './AuthModal';
import * as AuthModalContext from '../../context/AuthModalContext';
import * as AuthContext from '../../context/AuthContext';

describe('AuthModal Component', () => {
  it('renders nothing when closed', () => {
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: false,
      mode: 'login',
      signupType: 'individual',
      openLogin: vi.fn(),
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    renderWithProviders(<AuthModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders login form when open', () => {
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'login',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn()
    });

    const { container } = renderWithProviders(<AuthModal />);
    
    // Use getByRole for the dialog
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    
    // Look for specific heading
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    
    // Look for input fields - check if they exist in the container
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders signup form when in signup mode', () => {
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'signup',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn()
    });

    const { container } = renderWithProviders(<AuthModal />);
    
    // Look for the heading
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    
    // Check that we have multiple input fields (first name, last name, email, passwords)
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(4);
  });

  it('has close button', () => {
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'login',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn()
    });

    renderWithProviders(<AuthModal />);
    
    // Find the close button by aria-label
    expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
  });

  it('shows account type selection in signup mode', () => {
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'signup',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn()
    });

    renderWithProviders(<AuthModal />);
    
    // Find buttons by exact text within the account type section
    const buttons = screen.getAllByRole('button');
    const individualButton = buttons.find(btn => btn.textContent === 'Individual');
    const businessButton = buttons.find(btn => btn.textContent === 'Business');
    
    expect(individualButton).toBeInTheDocument();
    expect(businessButton).toBeInTheDocument();
  });

  it('allows typing in login email field', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'login',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn()
    });

    const { container } = renderWithProviders(<AuthModal />);
    
    // Find the first input (should be email/username)
    const inputs = container.querySelectorAll('input[type="text"]');
    const emailInput = inputs[0];
    
    await user.type(emailInput, TEST_ACCOUNTS.individual.email);
    expect(emailInput).toHaveValue(TEST_ACCOUNTS.individual.email);
  });

  it('allows typing in signup first name field', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'signup',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn()
    });

    const { container } = renderWithProviders(<AuthModal />);
    
    // Find text inputs - first one should be first name
    const inputs = container.querySelectorAll('input[type="text"]');
    const firstNameInput = inputs[0];
    
    await user.type(firstNameInput, 'John');
    expect(firstNameInput).toHaveValue('John');
  });

  it('allows typing in signup last name field', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(AuthModalContext, 'useAuthModal').mockReturnValue({
      isOpen: true,
      mode: 'signup',
      signupType: 'individual',
      close: vi.fn(),
      setMode: vi.fn(),
      setSignupType: vi.fn()
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: vi.fn(),
      signup: vi.fn()
    });

    const { container } = renderWithProviders(<AuthModal />);
    
    // Find text inputs - second one should be last name
    const inputs = container.querySelectorAll('input[type="text"]');
    const lastNameInput = inputs[1];
    
    await user.type(lastNameInput, 'Doe');
    expect(lastNameInput).toHaveValue('Doe');
  });
});
