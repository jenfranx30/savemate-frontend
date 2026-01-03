// src/components/auth/AuthModal.jsx

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import PasswordField from '../ui/PasswordField';

export default function AuthModal() {
  const { isOpen, mode, signupType, close, setMode, setSignupType } = useAuthModal();
  const { login, signup } = useAuth();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ emailOrUsername: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });

  const title = useMemo(() => (mode === 'login' ? 'Sign In' : 'Create account'), [mode]);

  useEffect(() => {
    if (!isOpen) {
      setBusy(false);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    if (!loginForm.emailOrUsername.trim() || !loginForm.password) {
      setBusy(false);
      setError('Please fill in all fields.');
      return;
    }

    try {
      await login({ emailOrUsername: loginForm.emailOrUsername, password: loginForm.password });
      close();
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    if (!signupForm.firstName.trim() || !signupForm.lastName.trim() || !signupForm.email.trim()) {
      setBusy(false);
      setError('Please fill in all fields.');
      return;
    }

    if (!signupForm.password || !signupForm.confirmPassword) {
      setBusy(false);
      setError('Please enter a password and confirm it.');
      return;
    }

    if (signupForm.password.length < 8) {
      setBusy(false);
      setError('Password must be at least 8 characters.');
      return;
    }

    if (signupType === 'business' && !signupForm.businessName.trim()) {
      setBusy(false);
      setError('Please enter your business name.');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setBusy(false);
      setError('Passwords do not match.');
      return;
    }

    try {
      await signup({
        email: signupForm.email,
        password: signupForm.password,
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        accountType: signupType,
        businessName: signupType === 'business' ? signupForm.businessName : null,
      });
      close();
    } catch (err) {
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onMouseDown={onBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'login'
                ? 'Use your email to access your account.'
                : 'Create a new account in seconds.'}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          {error ? (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          {mode === 'login' ? (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email or Username</label>
                <input
                  type="text"
                  value={loginForm.emailOrUsername}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, emailOrUsername: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <PasswordField
                  variant="light"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-600">
                No account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={submitSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">First name</label>
                  <input
                    type="text"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Last name</label>
                  <input
                    type="text"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                  <PasswordField
                    variant="light"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Confirm</label>
                  <PasswordField
                    variant="light"
                    value={signupForm.confirmPassword}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Account type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSignupType('individual')}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                      signupType === 'individual'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupType('business')}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                      signupType === 'business'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>

              {signupType === 'business' ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Business name</label>
                  <input
                    type="text"
                    value={signupForm.businessName}
                    onChange={(e) => setSignupForm((p) => ({ ...p, businessName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
