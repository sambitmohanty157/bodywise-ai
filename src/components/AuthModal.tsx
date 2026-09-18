import { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle, Loader2, Zap, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

type Tab = 'login' | 'signup';
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signup' }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      resetForm();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  function resetForm() {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirm(false);
    setStatus('idle');
    setErrorMessage('');
    setTouched({});
  }

  function switchTab(t: Tab) {
    setTab(t);
    setStatus('idle');
    setErrorMessage('');
    setTouched({});
  }

  function validateSignUp(): string | null {
    if (!fullName.trim()) return 'Full name is required.';
    if (fullName.trim().length < 2) return 'Full name must be at least 2 characters.';
    if (!email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  function validateLogin(): string | null {
    if (!email.trim()) return 'Email address is required.';
    if (!password) return 'Password is required.';
    return null;
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });

    const error = validateSignUp();
    if (error) {
      setStatus('error');
      setErrorMessage(error);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    if (!supabase) {
      setStatus('error');
      setErrorMessage('Service unavailable. Please try again later.');
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    if (signUpError) {
      setStatus('error');
      if (signUpError.message.toLowerCase().includes('already registered')) {
        setErrorMessage('An account with this email already exists. Try logging in instead.');
      } else {
        setErrorMessage(signUpError.message || 'Sign up failed. Please try again.');
      }
      return;
    }

    setStatus('success');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const error = validateLogin();
    if (error) {
      setStatus('error');
      setErrorMessage(error);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    if (!supabase) {
      setStatus('error');
      setErrorMessage('Service unavailable. Please try again later.');
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setStatus('error');
      if (loginError.message.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else {
        setErrorMessage(loginError.message || 'Login failed. Please try again.');
      }
      return;
    }

    setStatus('success');
  }

  function fieldError(field: string): string | null {
    if (!touched[field]) return null;
    switch (field) {
      case 'fullName':
        if (!fullName.trim()) return 'Full name is required.';
        if (fullName.trim().length < 2) return 'At least 2 characters.';
        return null;
      case 'email':
        if (!email.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Invalid email format.';
        return null;
      case 'password':
        if (!password) return 'Password is required.';
        if (tab === 'signup' && password.length < 6) return 'At least 6 characters.';
        return null;
      case 'confirmPassword':
        if (!confirmPassword) return 'Please confirm your password.';
        if (password !== confirmPassword) return 'Passwords do not match.';
        return null;
      default:
        return null;
    }
  }

  function inputClass(field: string): string {
    const err = fieldError(field);
    const base = 'w-full bg-surface-gray-800/60 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none transition-colors duration-200 backdrop-blur-sm';
    if (err) return `${base} border-brand-red/60 focus:border-brand-red`;
    return `${base} border-white/[0.06] focus:border-brand-red/50`;
  }

  if (!isOpen) return null;

  const isLogin = tab === 'login';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-surface-gray-900 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-5 border-b border-white/[0.04]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-gray-800 flex items-center justify-center text-surface-gray-400 hover:text-white hover:bg-surface-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold">
                Body<span className="text-brand-red">Wise</span> AI
              </span>
            </div>

            {status === 'success' ? (
              <h2 className="text-xl font-bold">
                {isLogin ? 'Welcome back!' : 'Welcome aboard!'}
              </h2>
            ) : (
              <>
                {/* Tab switcher */}
                <div className="flex bg-surface-gray-800/60 rounded-xl p-1 mb-4">
                  <button
                    onClick={() => switchTab('signup')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      tab === 'signup'
                        ? 'bg-brand-red text-white shadow-sm'
                        : 'text-surface-gray-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Sign Up
                  </button>
                  <button
                    onClick={() => switchTab('login')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      tab === 'login'
                        ? 'bg-brand-red text-white shadow-sm'
                        : 'text-surface-gray-400 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Log In
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-1">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-sm text-surface-gray-500">
                  {isLogin ? 'Sign in to continue your fitness journey.' : 'Start your AI-powered fitness journey today.'}
                </p>
              </>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {status === 'success' ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {isLogin ? 'Signed in successfully!' : 'Account created!'}
                </h3>
                <p className="text-sm text-surface-gray-400 mb-6">
                  {isLogin
                    ? "You're now signed in to BodyWise AI. Let's continue your transformation."
                    : 'Your BodyWise AI account is ready. You can now start your transformation.'}
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary w-full text-base"
                >
                  Continue
                </button>
              </div>
            ) : isLogin ? (
              /* ---- LOGIN FORM ---- */
              <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    ref={firstInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={inputClass('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={status === 'loading'}
                  />
                  {fieldError('email') && (
                    <p className="text-xs text-brand-red mt-1">{fieldError('email')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      className={`${inputClass('password')} pr-10`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={status === 'loading'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-gray-500 hover:text-surface-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldError('password') && (
                    <p className="text-xs text-brand-red mt-1">{fieldError('password')}</p>
                  )}
                </div>

                {status === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-brand-red shrink-0" />
                    <p className="text-sm text-brand-red">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full text-base flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </button>

                <p className="text-xs text-surface-gray-500 text-center">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchTab('signup')} className="text-brand-red hover:text-brand-red-hover font-semibold transition-colors">
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              /* ---- SIGNUP FORM ---- */
              <form onSubmit={handleSignUp} className="flex flex-col gap-4" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    className={inputClass('fullName')}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={status === 'loading'}
                  />
                  {fieldError('fullName') && (
                    <p className="text-xs text-brand-red mt-1">{fieldError('fullName')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={inputClass('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={status === 'loading'}
                  />
                  {fieldError('email') && (
                    <p className="text-xs text-brand-red mt-1">{fieldError('email')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      className={`${inputClass('password')} pr-10`}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      disabled={status === 'loading'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-gray-500 hover:text-surface-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldError('password') && (
                    <p className="text-xs text-brand-red mt-1">{fieldError('password')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                      className={`${inputClass('confirmPassword')} pr-10`}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      disabled={status === 'loading'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-gray-500 hover:text-surface-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldError('confirmPassword') && (
                    <p className="text-xs text-brand-red mt-1">{fieldError('confirmPassword')}</p>
                  )}
                </div>

                {status === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-brand-red shrink-0" />
                    <p className="text-sm text-brand-red">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full text-base flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>

                <p className="text-xs text-surface-gray-500 text-center mt-1">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-surface-gray-400 hover:text-white underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-surface-gray-400 hover:text-white underline">Privacy Policy</a>.
                </p>

                <p className="text-xs text-surface-gray-500 text-center">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchTab('login')} className="text-brand-red hover:text-brand-red-hover font-semibold transition-colors">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
