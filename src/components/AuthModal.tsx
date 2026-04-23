import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { loginWithGoogle, signUpWithEmail, loginWithEmail } from '../lib/firebase';
import { auditLogin, auditLogout, auditSignup, auditFailed } from '../utils/hipaaAudit';
import HIPAABadge from './HIPAABadge';

const VideoPanel = React.memo(() => (
  <div className="hidden md:block relative w-5/12 flex-shrink-0 overflow-hidden">
    <video
      src="/nexus-ayurve-hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'brightness(0.82)', transform: 'translateZ(0)' }}
    />
    {/* Gradient overlay so text is readable */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    {/* Branding overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <p className="text-white/90 font-display text-lg font-bold leading-tight">
        Nexus Ayurve
      </p>
      <p className="text-white/50 text-xs mt-1">
        Your Ayurvedic wellness companion
      </p>
      {/* HIPAA minimal badge on video panel */}
      <div className="mt-3">
        <HIPAABadge variant="minimal" />
      </div>
    </div>
  </div>
));

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        const result = await signUpWithEmail(email, password, name);
        // HIPAA Audit — signup event, no PHI logged
        await auditSignup(result.user.uid);
      } else {
        const result = await loginWithEmail(email, password);
        // HIPAA Audit — login event, no PHI logged
        await auditLogin(result.user.uid);
      }
      onClose();
    } catch (err: any) {
      // HIPAA Audit — failed auth attempt, no credentials logged
      await auditFailed();
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') setError('This email is already registered. Try logging in.');
      else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Invalid email or password.');
      else if (code === 'auth/user-not-found') setError('No account found with this email.');
      else if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const result = await loginWithGoogle();
      // HIPAA Audit — Google login, no PHI logged
      await auditLogin(result.user.uid);
      onClose();
    } catch (err: any) {
      await auditFailed();
      setError(err.message || 'Google login failed.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl flex rounded-[28px] overflow-hidden shadow-2xl"
        style={{ minHeight: '520px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Left: Video Panel ── */}
        <VideoPanel />

        {/* ── Right: Form Panel ── */}
        <div className="flex-1 bg-forest border border-white/10 p-8 flex flex-col justify-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-accent/40 hover:text-emerald-accent transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-display font-bold text-cream mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-emerald-accent/50 text-sm mb-4">
            {mode === 'login'
              ? 'Sign in to continue your wellness journey'
              : 'Start your Ayurvedic health journey today'}
          </p>

          {/* HIPAA Full compliance badge — expandable */}
          <div className="mb-5">
            <HIPAABadge variant="full" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3.5 rounded-2xl font-bold mb-6 hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-emerald-accent/40 uppercase">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-accent/40" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3.5 bg-moss/30 border border-white/10 rounded-2xl text-cream placeholder:text-emerald-accent/30 focus:border-emerald-accent outline-none"
                />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-accent/40" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-moss/30 border border-white/10 rounded-2xl text-cream placeholder:text-emerald-accent/30 focus:border-emerald-accent outline-none"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-accent/40" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-11 pr-12 py-3.5 bg-moss/30 border border-white/10 rounded-2xl text-cream placeholder:text-emerald-accent/30 focus:border-emerald-accent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-accent/40 hover:text-emerald-accent"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-sm bg-rose-400/10 px-4 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-accent text-forest py-3.5 rounded-2xl font-bold hover:bg-emerald-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-emerald-accent/50 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-emerald-accent font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
