import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, LogOut, Sun, Moon, Activity, Ribbon, Heart, Scale,
  Shield, Coffee, ShoppingBag, Utensils, Sparkles, Menu, X,
  LayoutDashboard, Stethoscope, Wrench, BookOpen, MessageSquare,
  Brain, ChevronRight, Zap, Target, ArrowUpRight, Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, logout } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  user: FirebaseUser | null;
  onLogin: () => void;
}



// ─── All tools grouped for the panel ───
const TOOL_GROUPS = [
  {
    label: 'Core',
    items: [
      { to: '/dashboard',    label: 'My Dashboard',     icon: LayoutDashboard, tag: 'Live',     tagColor: '#10B981', desc: 'Health stats & invoices' },
      { to: '/doctors',      label: 'Consult Experts',  icon: Stethoscope,     tag: '₹1',       tagColor: '#60A5FA', desc: 'Book an Ayurvedic doctor' },
      { to: '/shop',         label: 'Herbal Shop',      icon: ShoppingBag,     tag: 'New',      tagColor: '#FBBF24', desc: 'Ayurvedic medicines' },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { to: '/health-coach', label: 'AI Health Coach',   icon: Brain,         tag: 'AI',   tagColor: '#A78BFA', desc: '13-section wellness report' },
      { to: '/diagnosis',    label: 'AI Diagnosis',      icon: Sparkles,      tag: 'AI',   tagColor: '#A78BFA', desc: 'Symptom & dosha analysis' },
      { to: '/meal-analysis', label: 'AI Analyse Meal',   icon: Camera,        tag: 'AI',   tagColor: '#F97316', desc: 'Scan & analyse your meal' },
      { to: '/chat',         label: 'Ayurcare Chat',           icon: MessageSquare, tag: 'Live', tagColor: '#10B981', desc: 'Ask anything about health' },
    ],
  },
  {
    label: 'Wellness',
    items: [
      { to: '/tools',           label: 'BMI & Heart',      icon: Wrench,   tag: 'Tool', tagColor: '#F87171', desc: 'BMI + heart monitor' },
      { to: '/calorie-checker', label: 'Calorie Checker',  icon: Utensils, tag: 'Tool', tagColor: '#F87171', desc: 'Indian food database' },
      { to: '/guides',          label: 'Health Guides',    icon: BookOpen, tag: 'Edu',  tagColor: '#6B7280', desc: 'Ayurvedic knowledge base' },
    ],
  },
];

export default function Navbar({ user, onLogin }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLightMode, setIsLightMode] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close panel on route change
  useEffect(() => { setShowPanel(false); }, [location.pathname]);

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = showPanel ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showPanel]);

  useEffect(() => {
    // Force Dark Mode on initial load always, ignoring past saves
    // This ensures "new or old" users ALWAYS see dark mode by default
    setIsLightMode(false);
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLightMode(true);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 backdrop-blur-2xl border-b shadow-xl shadow-black/10'
          + ' ' + (isLightMode
              ? 'bg-white/80 border-black/[0.06]'
              : 'bg-forest/80 border-white/[0.06]')
          : 'py-3 sm:py-5 bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-10">
          <div className="flex items-center justify-between sm:justify-start gap-4">

            {/* LEFT: Hamburger + Logo — shrink-0 so it never gets squished */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* All Tools Trigger */}
              <button
                onClick={() => setShowPanel(true)}
                aria-label="All Tools"
                className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                  showPanel
                    ? 'bg-emerald-accent text-forest'
                    : 'bg-forest/50 border border-white/8 text-cream/70 hover:text-emerald-accent hover:border-emerald-accent/30 hover:bg-emerald-accent/5'
                } backdrop-blur-md`}
              >
                <div className="flex flex-col gap-[5px] w-[18px]">
                  <span className={`h-[2px] rounded-full transition-all duration-300 ${showPanel ? 'bg-forest rotate-45 translate-y-[7px]' : 'bg-current'}`} />
                  <span className={`h-[2px] rounded-full transition-all duration-300 ${showPanel ? 'opacity-0 -translate-x-2' : 'bg-current'}`} />
                  <span className={`h-[2px] rounded-full transition-all duration-300 ${showPanel ? 'bg-forest -rotate-45 -translate-y-[7px]' : 'bg-current'}`} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block">Tools</span>
                {/* Pulse dot */}
                {!showPanel && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-accent">
                    <span className="absolute inset-0 rounded-full bg-emerald-accent animate-ping opacity-60" />
                  </span>
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="bg-emerald-accent p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-accent/20">
                  <Leaf className="text-forest w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold text-gradient hidden sm:block">AyurCare+</span>
              </Link>
            </div>

            {/* CENTER: flex-1 so it fills ALL remaining space between logo and actions */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-0.5 min-w-0">
              {[
                { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
                { to: '/doctors',      label: 'Consult',      icon: Stethoscope     },
                { to: '/shop',         label: 'Shop',         icon: ShoppingBag     },
                { to: '/chat',         label: 'Ayurcare Chat',      icon: MessageSquare   },
                { to: '/health-coach', label: 'Health Coach', icon: Brain           },
                { to: '/diagnosis',    label: 'AI Diagnosis', icon: Sparkles        },
              ].map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap ${
                    isActive(link.to)
                      ? 'bg-emerald-accent/10 text-emerald-accent'
                      : 'text-cream/50 hover:text-cream hover:bg-white/5'
                  }`}
                >
                  <link.icon size={12} />
                  {link.label}
                </Link>
              ))}
              {/* AI Analyse Meal — special highlighted pill */}
              <Link
                to="/meal-analysis"
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300"
              >
                <Camera size={12} />
                AI Analyse Meal
              </Link>
            </div>

            {/* RIGHT: Actions — shrink-0 so it never gets squished */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl bg-forest/40 border border-white/8 text-cream/60 hover:text-emerald-accent transition-colors flex items-center justify-center backdrop-blur-md"
              >
                {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-emerald-accent/20">
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-emerald-accent/20 flex items-center justify-center text-emerald-accent text-xs font-bold">{(user.displayName || 'U')[0]}</div>
                    }
                  </div>
                  <button onClick={handleLogout} className="text-cream/30 hover:text-rose-400 transition-colors">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-accent text-forest text-[12px] sm:text-[13px] font-bold hover:bg-emerald-accent/90 transition-all shadow-lg shadow-emerald-accent/15"
                >
                  Sign In <Zap size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Left-Side Tools Panel ── */}
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
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 h-full z-[201] flex flex-col backdrop-blur-3xl border-r shadow-2xl"
              style={{
                width: 'min(360px, 85vw)',
                background: 'rgba(10, 15, 13, 0.75)',
                borderRight: '1px solid rgba(52, 211, 153, 0.15)',
              }}  
            >
              {/* Panel Header */}
              <div className="flex flex-shrink-0 items-center justify-between px-6 pt-6 pb-5 border-b border-cream/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-accent flex items-center justify-center shadow-lg shadow-emerald-accent/30">
                    <Leaf size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-cream leading-tight tracking-wide">AyurCare+</h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-accent">Wellness Hub</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-cream/40 hover:text-cream bg-cream/[0.03] hover:bg-cream/[0.08] border border-cream/[0.05] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User card (if logged in) */}
              {user && (
                <div className="mx-6 mt-6 px-4 py-3 rounded-2xl flex items-center gap-3 bg-emerald-accent/[0.08] border border-emerald-accent/20 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-accent/30 flex-shrink-0 bg-emerald-accent/10 flex items-center justify-center text-emerald-accent text-sm font-bold">
                    {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : (user.displayName || 'U')[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-cream truncate">{user.displayName || 'User'}</p>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-accent truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/dashboard'); setShowPanel(false); }}
                    className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-cream/[0.05] hover:bg-emerald-accent text-cream/50 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              )}

              {/* Tool Groups (Scrollable) */}
              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-7 scrollbar-hide">
                {TOOL_GROUPS.map((group) => (
                  <div key={group.label}>
                    {/* Group Label */}
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40 pl-1 mb-3">
                      {group.label}
                    </p>

                    {/* Items */}
                    <div className="space-y-1.5">
                      {group.items.map((item, i) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 + 0.05 }}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setShowPanel(false)}
                            className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                              isActive(item.to)
                                ? 'bg-emerald-accent border-emerald-accent shadow-lg shadow-emerald-accent/25'
                                : 'bg-cream/[0.02] border-cream/[0.05] hover:bg-cream/[0.06] hover:border-emerald-accent/30 border'
                            }`}
                          >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-forest/30 shadow-inner">
                              <item.icon size={18} className={isActive(item.to) ? 'text-forest' : `text-[${item.tagColor}]`} style={{ color: isActive(item.to) ? '#fff' : item.tagColor }} />
                            </div>

                            {/* Label + desc */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-[14px] font-bold leading-none mb-1 transition-colors ${isActive(item.to) ? 'text-white' : 'text-cream group-hover:text-emerald-accent'}`}>
                                {item.label}
                              </p>
                              <p className={`text-[11px] truncate ${isActive(item.to) ? 'text-white/80' : 'text-cream/50'}`}>{item.desc}</p>
                            </div>

                            {/* Tag badge */}
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-widest ${isActive(item.to) ? 'bg-white/20 text-white' : 'bg-forest/50'}`}
                              style={{ color: isActive(item.to) ? '#fff' : item.tagColor }}
                            >
                              {item.tag}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Panel Footer strictly adhering to Branding */}
              <div className="flex-shrink-0 border-t border-cream/[0.08] bg-moss/10 px-6 py-6">
                
                {/* Branding Core Details */}
                <div className="mb-5 space-y-2">
                  <div className="flex items-center gap-2 mb-1 opacity-70">
                    <Leaf size={16} className="text-emerald-accent" />
                    <span className="font-display font-bold text-sm text-cream">Ayurcare+</span>
                  </div>
                  <p className="text-[11px] text-cream/60 flex items-center gap-1.5"><strong className="text-emerald-accent">CEO:</strong> Aryan Singh Tariani</p>
                  <p className="text-[11px] text-cream/40">Desh Bhagat University, Mandi Govindgarh</p>
                  <a href="tel:+919475002048" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-accent hover:underline mt-1">
                     +91 94750 02048
                  </a>
                </div>

                {/* Authentication logic */}
                {!user ? (
                  <button
                    onClick={() => { onLogin(); setShowPanel(false); }}
                    className="w-full py-3.5 rounded-xl bg-emerald-accent text-forest text-[13px] font-bold hover:bg-emerald-accent/90 transition-all shadow-lg shadow-emerald-accent/20 flex items-center justify-center gap-2"
                  >
                    Sign In to AyurCare+ <Zap size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-500 bg-rose-500/5 text-[13px] font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
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
