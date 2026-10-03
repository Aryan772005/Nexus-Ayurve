import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, MapPin, Search, ShoppingBag, FileText, ChevronDown,
  User, LogOut, Tag, ShieldCheck, Sparkles, Activity, Brain,
  Camera, Stethoscope, HeartPulse, X, ArrowRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../context/CartContext';
import { PRODUCTS, Product } from '../data/products';
import { LAB_PACKAGES } from '../data/labTests';

interface NavbarProps {
  user: FirebaseUser | null;
  onLogin: () => void;
}

export default function Navbar({ user, onLogin }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, cartTotal, openCart, openPrescription, openLocation, city, pincode, addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for live search preview
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const labResults = searchQuery.trim()
    ? LAB_PACKAGES.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 2)
    : [];

  const handleSelectSearchItem = (path: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/');
  };

  const navCategories = [
    { label: 'All Medicines', to: '/shop', badge: 'Authentic' },
    { label: 'Consult Doctors', to: '/doctors', badge: '₹1 Only' },
    { label: 'Lab Tests', to: '/shop?filter=lab-tests' },
    { label: 'Ayurveda Store', to: '/shop' },
    { label: 'AI Meal Analyser', to: '/meal-analysis', badge: 'AI' },
    { label: 'AyurCoach AI', to: '/ayurcoach', badge: 'New' },
    { label: 'Health Tools', to: '/tools' },
    { label: 'Health Guides', to: '/guides' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200">
      {/* ── TOP UTILITY STRIP (1mg style) ── */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
              <Sparkles size={12} className="text-amber-400" />
              Nexus Ayurve Care Plan:
            </span>
            <span className="text-emerald-200/90">
              Save extra 5% on all handcrafted medicines + Free Ayurvedic Vaidya Consultations
            </span>
            <Link to="/shop" className="text-amber-300 font-bold underline hover:text-amber-200 ml-1">
              Explore Offers
            </Link>
          </div>

          <div className="flex items-center gap-5 text-[11px] text-emerald-200/80">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              100% Genuine Ayurvedic Formulations
            </span>
            <span className="text-emerald-500">|</span>
            <span>24x7 Support: +91 94750 02048</span>
            <span className="text-emerald-500">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER (1mg layout) ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-5">
        {/* LEFT: Logo & Location */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Leaf size={22} className="fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-black text-xl tracking-tight text-slate-900">
                  NEXUS
                </span>
                <span className="font-display font-extrabold text-xl tracking-tight text-emerald-600">
                  AYURVE
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 -mt-1">
                Authentic Ayurveda & Care
              </p>
            </div>
          </Link>

          {/* Location Selector Pill (1mg signature) — Desktop */}
          <button
            onClick={openLocation}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition text-left group"
          >
            <MapPin size={15} className="text-emerald-600 shrink-0 group-hover:animate-bounce" />
            <div className="text-xs leading-tight">
              <p className="text-[10px] text-slate-400 font-medium">Deliver to</p>
              <p className="font-bold text-slate-800 truncate max-w-[120px]">
                {city} ({pincode})
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-700 ml-0.5" />
          </button>
        </div>

        {/* Location Selector Pill — Mobile only (compact) */}
        <button
          onClick={openLocation}
          className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 font-bold truncate max-w-[130px]"
        >
          <MapPin size={12} className="text-emerald-600 shrink-0" />
          <span className="truncate">{pincode}</span>
          <ChevronDown size={12} className="text-slate-500 shrink-0" />
        </button>

        {/* CENTER: 1mg-Style Comprehensive Search Bar (Desktop) */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden sm:block">
          <div
            className={`flex items-center w-full rounded-2xl border transition-all ${
              isSearchFocused
                ? 'border-emerald-600 ring-3 ring-emerald-100 bg-white shadow-sm'
                : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
            }`}
          >
            <Search size={18} className="text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search for Medicines, Health Products, Herbs and Doctors..."
              className="w-full px-3 py-2.5 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search Dropdown Modal */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 overflow-hidden space-y-3"
              >
                {/* Popular Tags */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Popular Ayurvedic Searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Ashwagandha KSM-66', 'Chyawanprash', 'Shilajit Gold Resin', 'Triphala', 'Kumkumadi Oil', 'BAMS Doctors'].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearchQuery(item);
                            navigate(`/shop?search=${encodeURIComponent(item)}`);
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-medium transition"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Live Products Results */}
                {searchResults.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Matching Medicines ({searchResults.length})
                    </p>
                    <div className="space-y-2">
                      {searchResults.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition"
                        >
                          <div
                            onClick={() => handleSelectSearchItem(`/shop?search=${encodeURIComponent(p.name)}`)}
                            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-white"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.brand} · ₹{p.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab tests match */}
                {labResults.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Lab Packages
                    </p>
                    {labResults.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => handleSelectSearchItem('/shop?filter=lab-tests')}
                        className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{pkg.title}</p>
                          <p className="text-[10px] text-emerald-600 font-semibold">{pkg.testsCount} Tests · ₹{pkg.price}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Actions (Upload Prescription, Offers, Cart, Profile) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* 1mg Signature: Quick Buy / Upload Prescription */}
          <button
            onClick={openPrescription}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-sm active:scale-95 shrink-0"
          >
            <FileText size={15} />
            <span className="hidden sm:inline">Upload</span> Prescription
          </button>

          {/* Offers */}
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Tag size={15} className="text-amber-500" />
            <span>Offers</span>
          </Link>

          {/* Cart Icon & Count */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition group"
          >
            <ShoppingBag size={18} className="text-slate-700 group-hover:text-emerald-600" />
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-[10px] text-slate-400">Cart</span>
              <span className="text-xs font-bold text-slate-800">
                {cartCount > 0 ? `₹${cartTotal}` : 'Empty'}
              </span>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Authentication / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((p) => !p)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-emerald-500 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.displayName || 'Patient'}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      <Activity size={14} className="text-emerald-600" />
                      My Health Dashboard
                    </Link>
                    <Link
                      to="/health-coach"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      <Brain size={14} className="text-violet-600" />
                      AI Health Coach
                    </Link>
                    <Link
                      to="/doctors"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      <Stethoscope size={14} className="text-sky-600" />
                      Doctor Appointments
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE SEARCH BAR (1mg Mobile Signature) ── */}
      <div className="block sm:hidden px-4 pb-2.5">
        <div
          className={`flex items-center w-full rounded-2xl border transition-all ${
            isSearchFocused
              ? 'border-emerald-600 ring-2 ring-emerald-100 bg-white'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <Search size={16} className="text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search medicines, herbs, doctors..."
            className="w-full px-2.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 mr-2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── SECONDARY CATEGORY STRIP (1mg style horizontal navigation) ── */}
      <div className="border-t border-slate-100 bg-slate-50/60 overflow-x-auto scrollbar-hide py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap text-xs">
          <div className="flex items-center gap-6">
            {navCategories.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-1.5 font-semibold transition py-0.5 ${
                    active
                      ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-500 font-medium">
            <span className="text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
              ⚡ Same Day Dispatch in {city}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
