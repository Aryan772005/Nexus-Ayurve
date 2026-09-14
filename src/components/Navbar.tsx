import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, LogOut, Sun, Moon, Activity,
  Shield, ShoppingBag, X,
  LayoutDashboard, Stethoscope, MessageSquare,
  Brain, ArrowUpRight, Camera, Zap, ChevronDown,
  HeartPulse, Utensils, BookOpen, Wrench, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  user: FirebaseUser | null;
  onLogin: () => void;
}

const TOOL_GROUPS = [
  {
    label: 'Core',
    color: '#00D97E',
    items: [
      { to: '/dashboard',    label: 'My Dashboard',     icon: LayoutDashboard, tag: 'Live',  desc: 'Health stats & invoices',      color: '#00D97E' },
      { to: '/doctors',      label: 'Consult Experts',  icon: Stethoscope,     tag: '₹1',    desc: 'Book an Ayurvedic doctor',      color: '#60A5FA' },
      { to: '/shop',         label: 'Herbal Shop',       icon: ShoppingBag,     tag: 'New',   desc: 'Ayurvedic medicines & herbs',   color: '#FCD34D' },
    ] },
  {
    label: 'AI Tools',
    color: '#A78BFA',
    items: [
      { to: '/ayurcoach',     label: 'AyurCoach App',      icon: Sparkles,        tag: 'New',  desc: 'AI food & dosha coach for youth', color: '#D97736' },
      { to: '/health-coach',  label: 'AI Health Coach',   icon: Brain,         tag: 'AI',   desc: '13-section wellness report',    color: '#A78BFA' },
      { to: '/diagnosis',     label: 'AI Diagnosis',       icon: Activity,      tag: 'AI',   desc: 'Symptom & dosha analysis',      color: '#A78BFA' },
      { to: '/meal-analysis', label: 'AI Meal Analyser',   icon: Camera,        tag: 'AI',   desc: 'Scan & analyse your meal',      color: '#FB923C' },
      { to: '/chat',          label: 'Nexus AI Chat',      icon: MessageSquare, tag: 'Live', desc: 'Ask anything about health',     color: '#00D97E' },
    ] },
  {
    label: 'Wellness',
    color: '#F87171',
    items: [
      { to: '/tools',           label: 'BMI & Heart',      icon: HeartPulse, tag: 'Tool', desc: 'BMI + heart monitor',             color: '#F87171' },
      { to: '/calorie-checker', label: 'Calorie Checker',  icon: Utensils,   tag: 'Tool', desc: 'Indian food database',            color: '#FB923C' },
      { to: '/guides',          label: 'Health Guides',    icon: BookOpen,   tag: 'Edu',  desc: 'Ayurvedic knowledge base',        color: '#94A3B8' },
    ] },
];

const NAV_LINKS = [
  { to: '/ayurcoach',    label: 'AyurCoach',    icon: Sparkles        },
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/doctors',      label: 'Consult',      icon: Stethoscope     },
  { to: '/shop',         label: 'Shop',         icon: ShoppingBag     },
  { to: '/chat',         label: 'AI Chat',      icon: MessageSquare   },
  { to: '/health-coach', label: 'Coach',        icon: Brain           },
  { to: '/diagnosis',    label: 'Diagnose',     icon: Activity        },
];

export default function Navbar({ user, onLogin }: NavbarProps) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isLight, setIsLight]       = useState(false);
  const [showPanel, setShowPanel]   = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setShowPanel(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = showPanel ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showPanel]);

  // Always start in dark mode
  useEffect(() => {
    setIsLight(false);
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };
  const isActive = (p: string) => location.pathname === p;

  return (
    <>
      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-2 border-b bg-white/90 border-black/[0.07] shadow-lg shadow-black/5'
            : 'py-3 bg-transparent border-b border-transparent'
        } backdrop-blur-2xl`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-10">
          <div className="flex items-center justify-between gap-4">

            {/* LEFT: Menu trigger + Logo */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Hamburger */}
              <button
                onClick={() => setShowPanel(true)}
                aria-label="Open tools panel"
                className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-200 text-sm font-bold ${
                  showPanel
                    ? 'bg-emerald-accent text-[#080C10]'
                    : isLight
                      ? 'bg-black/5 border border-black/8 text-slate-600 hover:text-[#059669] hover:border-[#059669]/30'
                      : 'bg-white/[0.04] border border-white/[0.07] text-cream/60 hover:text-[#00D97E] hover:border-[#00D97E]/30 hover:bg-[#00D97E]/5'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <div className="flex flex-col gap-[5px] w-[16px]">
                  <span className={`h-[1.5px] rounded-full transition-all duration-300 ${showPanel ? 'bg-current rotate-45 translate-y-[6.5px]' : 'bg-current'}`} />
                  <span className={`h-[1.5px] rounded-full transition-all duration-300 ${showPanel ? 'opacity-0 -translate-x-3' : 'bg-current'}`} />
                  <span className={`h-[1.5px] rounded-full transition-all duration-300 ${showPanel ? 'bg-current -rotate-45 -translate-y-[6.5px]' : 'bg-current'}`} />
                </div>
                <span className="hidden sm:block text-[11px] tracking-wider uppercase">Tools</span>
                {!showPanel && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00D97E]">
                    <span className="absolute inset-0 rounded-full bg-[#00D97E] animate-ping opacity-70" />
                  </span>
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #00D97E, #00B868)',
                    boxShadow: '0 4px 16px rgba(0,217,126,0.4)'
                  }}
                >
                  <Leaf className="text-[#080C10] w-4.5 h-4.5" size={18} />
                </div>
                <span className="text-[17px] font-display font-bold hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>
                  <span className="text-gradient">Nexus</span>
                  <span className={isLight ? 'text-slate-800' : 'text-cream/90'}> Ayurve</span>
                </span>
              </Link>
            </div>

            {/* CENTER: Nav links */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 whitespace-nowrap ${
                    isActive(link.to)
                      ? 'nav-pill-active'
                      : isLight
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5'
                        : 'text-cream/40 hover:text-cream hover:bg-white/[0.05]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <link.icon size={12} />
                  {link.label}
                </Link>
              ))}
              {/* Meal analysis — special orange pill */}
              <Link
                to="/meal-analysis"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 whitespace-nowrap ${
                  isActive('/meal-analysis')
                    ? 'bg-orange-500/20 text-orange-300 shadow-[0_0_0_1px_rgba(249,115,22,0.35)]'
                    : 'bg-orange-500/8 text-orange-400/80 border border-orange-500/15 hover:bg-orange-500/15 hover:text-orange-300'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Camera size={12} />
                Meal AI
              </Link>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isLight
                    ? 'bg-black/5 border border-black/8 text-slate-500 hover:text-slate-800'
                    : 'bg-white/[0.04] border border-white/[0.07] text-cream/50 hover:text-[#00D97E] hover:border-[#00D97E]/25'
                }`}
                title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {isLight ? <Moon size={15} /> : <Sun size={15} />}
              </button>

              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-white/[0.07]">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 rounded-xl overflow-hidden border-2 transition-all group-hover:border-[#00D97E]/60"
                      style={{ borderColor: 'rgba(0,217,126,0.3)' }}>
                      {user.photoURL
                        ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[#00D97E] text-xs font-bold"
                            style={{ background: 'rgba(0,217,126,0.15)' }}>
                            {(user.displayName || 'U')[0].toUpperCase()}
                          </div>
                      }
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-cream/25 hover:text-rose-400 transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="btn-primary text-[12px] sm:text-[13px] px-4 py-2 rounded-xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Sign In <Zap size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ══ FULL-HEIGHT TOOLS PANEL ═══════════════════════════════════ */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-in panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full z-[201] flex flex-col border-r"
              style={{
                width: 'min(360px, 88vw)',
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(40px) saturate(1.4)',
                borderColor: 'var(--color-border-accent)' }}
            >
              {/* Ambient glow top */}
              <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,217,126,0.08) 0%, transparent 70%)' }} />

              {/* Panel header */}
              <div className="relative flex items-center justify-between px-6 pt-7 pb-5 border-b border-white/[0.05] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #00D97E, #00B868)', boxShadow: '0 4px 20px rgba(0,217,126,0.4)' }}>
                    <Leaf size={18} className="text-[#080C10]" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-cream leading-none mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                      Nexus Ayurve
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00D97E]">Wellness Hub</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-cream/30 hover:text-cream transition-all hover:bg-white/[0.06] border border-white/[0.04]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* User card */}
              {user && (
                <div className="mx-5 mt-5 px-4 py-3.5 rounded-2xl flex items-center gap-3 shrink-0"
                  style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.18)' }}>
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-[#00D97E] text-sm font-bold"
                    style={{ background: 'rgba(0,217,126,0.12)', border: '1px solid rgba(0,217,126,0.25)' }}>
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                      : (user.displayName || 'U')[0].toUpperCase()
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-cream truncate">{user.displayName || 'User'}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#00D97E]/70 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/dashboard'); setShowPanel(false); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-cream/40 hover:text-[#00D97E] hover:bg-[#00D97E]/10 transition-all"
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              )}

              {/* Tool groups — scrollable */}
              <div className="flex-1 overflow-y-auto py-5 px-5 space-y-6 scrollbar-hide">
                {TOOL_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/30 pl-1 mb-2.5"
                      style={{ fontFamily: 'var(--font-display)' }}>
                      {group.label}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item, i) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 + 0.05, type: 'spring', damping: 25 }}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setShowPanel(false)}
                            className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-150 ${
                              isActive(item.to)
                                ? 'shadow-lg'
                                : 'hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.09]'
                            }`}
                            style={isActive(item.to) ? {
                              background: `linear-gradient(135deg, ${item.color}22, ${item.color}10)`,
                              border: `1px solid ${item.color}33`,
                              boxShadow: `0 4px 20px ${item.color}20` } : {}}
                          >
                            {/* Icon */}
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                              style={{
                                background: `${item.color}15`,
                                border: `1px solid ${item.color}25` }}>
                              <item.icon size={16} style={{ color: item.color }} />
                            </div>
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] font-bold leading-none mb-1 transition-colors ${
                                isActive(item.to) ? 'text-cream' : 'text-cream/80 group-hover:text-cream'
                              }`} style={{ fontFamily: 'var(--font-display)' }}>
                                {item.label}
                              </p>
                              <p className="text-[11px] text-cream/35 truncate">{item.desc}</p>
                            </div>
                            {/* Tag */}
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-widest"
                              style={{
                                background: `${item.color}15`,
                                color: item.color,
                                border: `1px solid ${item.color}25` }}>
                              {item.tag}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div className="shrink-0 border-t border-white/[0.06] px-5 py-5"
                style={{ background: 'rgba(255,255,255,0.015)' }}>
                <div className="mb-4 space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,217,126,0.1)' }}>
                      <Leaf size={11} className="text-[#00D97E]" />
                    </div>
                    <span className="font-bold text-sm text-cream/80" style={{ fontFamily: 'var(--font-display)' }}>Nexus Ayurve</span>
                  </div>
                  <p className="text-[11px] text-cream/45 flex items-center gap-1.5">
                    <span className="text-[#00D97E] font-bold">CEO:</span> Aryan Singh Tariani
                  </p>
                  <p className="text-[11px] text-cream/30">Desh Bhagat University, Mandi Govindgarh</p>
                  <a href="tel:+919475002048" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#00D97E] hover:underline mt-1">
                    +91 94750 02048
                  </a>
                </div>

                {!user ? (
                  <button
                    onClick={() => { onLogin(); setShowPanel(false); }}
                    className="btn-primary w-full justify-center rounded-2xl py-3.5"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Sign In to Nexus Ayurve <Zap size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
                    style={{
                      border: '1px solid rgba(244,63,94,0.25)',
                      color: 'rgba(251,113,133,0.9)',
                      background: 'rgba(244,63,94,0.05)',
                      fontFamily: 'var(--font-display)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.12)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.05)';
                    }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
