import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loginWithGoogle, signUpWithEmail, loginWithEmail } from '../lib/firebase';
import { auditLogin, auditSignup, auditFailed } from '../utils/hipaaAudit';

/* ── Left video / brand panel ───────────────────────────────────────── */
const VideoPanel = React.memo(() => (
  <div className="hidden md:flex relative w-[42%] flex-shrink-0 overflow-hidden flex-col">
    <video
      src="/nexusdd.mp4"
      autoPlay muted loop playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'brightness(0.55) saturate(1.2)', transform: 'translateZ(0)' }}
    />
    {/* Gradient overlays */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,12,16,0.3) 0%, transparent 40%, rgba(8,12,16,0.9) 100%)' }} />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 60%, rgba(8,12,16,0.6) 100%)' }} />

    {/* Logo top-left */}
    <div className="relative z-10 p-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #00D97E, #00B868)', boxShadow: '0 4px 16px rgba(0,217,126,0.45)' }}>
          <Leaf size={15} className="text-[#080C10]" />
        </div>
        <span className="font-display font-bold text-white text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>
          Nexus Ayurve
        </span>
      </div>
    </div>

    {/* Bottom branding */}
    <div className="relative z-10 mt-auto p-6 space-y-3">
      <h3 className="text-white font-display font-bold text-xl leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
        Ancient Wisdom.<br />
        <span style={{ color: '#00D97E' }}>Modern AI.</span>
      </h3>
      <p className="text-white/55 text-[12px] leading-relaxed max-w-[200px]">
        Personalised Ayurvedic health insights powered by AI.
      </p>

      {/* Mini HIPAA tag */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl w-fit"
        style={{ background: 'rgba(0,217,126,0.12)', border: '1px solid rgba(0,217,126,0.25)' }}>
        <ShieldCheck size={11} className="text-[#00D97E]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D97E]">HIPAA Protected</span>
      </div>

      {/* Feature dots */}
      <div className="space-y-1.5 pt-1">
        {['AES-256 encrypted', 'Zero data retention', 'No PHI stored'].map(f => (
          <div key={f} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#00D97E]" />
            <span className="text-[11px] text-white/45">{f}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

/* ── Input field wrapper ─────────────────────────────────────────────── */
function InputField({
  icon: Icon, type, value, onChange, placeholder, required, children
}: {
  icon: React.ElementType; type: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/25 group-focus-within:text-[#00D97E] transition-colors z-10" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-[14px] text-cream outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          fontFamily: 'var(--font-sans)',
        }}
        onFocus={e => {
          e.currentTarget.style.border = '1px solid rgba(0,217,126,0.4)';
          e.currentTarget.style.background = 'rgba(0,217,126,0.04)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,217,126,0.08)';
        }}
        onBlur={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {children}
    </div>
  );
}

/* ── Main AuthModal ──────────────────────────────────────────────────── */
export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode]     = useState<'login' | 'signup'>('login');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]     = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!name.trim())         { setError('Name is required'); setLoading(false); return; }
        if (password.length < 6)  { setError('Password must be at least 6 characters'); setLoading(false); return; }
        const result = await signUpWithEmail(email, password, name);
        await auditSignup(result.user.uid);
      } else {
        const result = await loginWithEmail(email, password);
        await auditLogin(result.user.uid);
      }
      onClose();
    } catch (err: any) {
      await auditFailed();
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') setError('Email already registered. Try signing in.');
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
      await auditLogin(result.user.uid);
      onClose();
    } catch (err: any) {
      await auditFailed();
      setError(err.message || 'Google sign-in failed.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full max-w-3xl flex rounded-[28px] overflow-hidden"
        style={{
          minHeight: '540px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left panel */}
        <VideoPanel />

        {/* Right form panel */}
        <div
          className="flex-1 flex flex-col justify-center p-8 md:p-9 relative"
          style={{ background: '#080C10' }}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(0,217,126,0.07) 0%, transparent 70%)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center text-cream/25 hover:text-cream transition-all hover:bg-white/[0.06]"
          >
            <X size={16} />
          </button>

          {/* Mode switch tabs */}
          <div className="flex p-1 rounded-2xl mb-6 relative"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 relative z-10"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: mode === m ? '#080C10' : 'rgba(232,237,245,0.4)',
                  background: mode === m ? 'linear-gradient(135deg, #00D97E, #00B868)' : 'transparent',
                  boxShadow: mode === m ? '0 4px 16px rgba(0,217,126,0.35)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-cream leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {mode === 'login' ? 'Welcome back' : 'Join Nexus Ayurve'}
            </h2>
            <p className="text-[13px] text-cream/35 mt-1">
              {mode === 'login'
                ? 'Sign in to continue your wellness journey'
                : 'Start your Ayurvedic health journey today'}
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-[13px] mb-5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(232,237,245,0.85)',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-cream/25">or email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <InputField icon={User} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />

            <InputField icon={Lock} type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required>
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/25 hover:text-cream transition-colors z-10"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </InputField>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] px-4 py-2.5 rounded-xl"
                  style={{ background: 'rgba(244,63,94,0.1)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.2)' }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 rounded-2xl text-[14px] mt-1 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#080C10]/30 border-t-[#080C10] rounded-full animate-spin" />Processing...</span>
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>

          {/* Privacy note */}
          <div className="flex items-center gap-1.5 justify-center mt-5">
            <ShieldCheck size={11} className="text-[#00D97E]/40" />
            <p className="text-[10px] text-cream/25 text-center">
              End-to-end encrypted · No health data stored · HIPAA protected
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
