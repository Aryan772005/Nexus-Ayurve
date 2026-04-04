import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, Sun, Moon, Activity, Ribbon, Heart, Scale, Shield, Coffee, ShoppingBag, TrendingDown, TrendingUp, Utensils } from 'lucide-react';
import { auth, logout } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  user: FirebaseUser | null;
}

const TOPICS = [
  { id: 'liver',            label: 'Liver',          icon: Activity  },
  { id: 'cancer',           label: 'Cancer',         icon: Ribbon    },
  { id: 'sexual-wellness',  label: 'Sexual Wellness',icon: Heart     },
  { id: 'weight',           label: 'Weight Management',icon: Scale     },
  { id: 'immunity',         label: 'Immunity',       icon: Shield    },
  { id: 'hangover',         label: 'Hangover Fix',   icon: Coffee    },
];

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    // Default is light mode ("normal when new users login should be in light mode")
    if (savedMode === 'dark') {
      setIsLightMode(false);
      document.body.classList.remove('light-mode');
    } else {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
      if (!savedMode) localStorage.setItem('theme', 'light');
    }
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-transparent py-4 md:py-5 px-6 md:px-12 backdrop-blur-[4px] transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Main Nav */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-accent p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-accent/20">
              <Leaf className="text-forest w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">Ayurcare+</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/dashboard" className="text-cream hover:text-emerald-accent transition-colors">Dashboard</Link>
              <Link to="/doctors" className="text-cream hover:text-emerald-accent transition-colors">Consult</Link>
              <Link to="/tools" className="text-cream hover:text-emerald-accent transition-colors">Tools</Link>
              <Link to="/shop" className="text-cream hover:text-emerald-accent transition-colors flex items-center gap-1"><ShoppingBag size={14} /> Shop</Link>
              <Link to="/guides" className="text-cream hover:text-emerald-accent transition-colors">Guides</Link>
              <Link to="/chat" className="text-cream hover:text-emerald-accent transition-colors">AI Chat</Link>
            </div>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
              <LanguageSwitcher />
              
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-forest/40 border border-white/10 text-emerald-accent/80 hover:text-emerald-accent transition-colors text-xs font-semibold"
                title="Toggle Theme"
              >
                {isLightMode ? <Moon size={14} /> : <Sun size={14} />}
                <span>{isLightMode ? 'Dark' : 'Light'}</span>
              </button>

              {user ? (
                <>
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-emerald-accent/20" referrerPolicy="no-referrer" />
                  <button onClick={handleLogout} className="text-emerald-accent/60 hover:text-rose-400 transition-colors" title="Sign Out">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <span className="text-sm font-medium text-emerald-accent/60 hidden md:block">Log in to book</span>
              )}
            </div>
          </div>
        </div>

        {/* Health Topics Ribbon (Logos) */}
        <div className="border-t border-white/10 pt-4 pb-2 md:pt-5 md:pb-3 flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide">
          {TOPICS.map(t => (
            <Link key={t.id} to={`/topic/${t.id}`} className="flex items-center gap-2.5 group shrink-0">
              <div className="bg-moss/40 border border-white/5 p-2.5 rounded-2xl group-hover:bg-emerald-accent/20 group-hover:border-emerald-accent/30 transition-all shadow-sm">
                <t.icon className="w-4 h-4 text-emerald-accent group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs uppercase tracking-wider text-cream/70 group-hover:text-emerald-accent font-bold transition-colors">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
