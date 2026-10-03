import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Stethoscope, Activity, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount, cartTotal, openCart } = useCart();

  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop' && !location.search.includes('filter=lab-tests');
  const isDoctors = location.pathname === '/doctors';
  const isLabTests = location.pathname.includes('filter=lab-tests') || (location.pathname === '/shop' && location.search.includes('filter=lab-tests'));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around safe-bottom">
      {/* 1. Home */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
          isHome ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home size={20} className={isHome ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">Home</span>
      </Link>

      {/* 2. Medicines / Shop */}
      <Link
        to="/shop"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
          isShop ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <ShoppingBag size={20} className={isShop ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">Medicines</span>
      </Link>

      {/* 3. Doctors (Consult) */}
      <Link
        to="/doctors"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition relative ${
          isDoctors ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <Stethoscope size={20} className={isDoctors ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-white text-[8px] font-extrabold leading-none">
            ₹1
          </span>
        </div>
        <span className="text-[10px] mt-0.5">Doctors</span>
      </Link>

      {/* 4. Lab Tests */}
      <Link
        to="/shop?filter=lab-tests"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
          isLabTests ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Activity size={20} className={isLabTests ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">Lab Tests</span>
      </Link>

      {/* 5. Cart Button */}
      <button
        onClick={openCart}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-emerald-700 transition relative"
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium">
          {cartCount > 0 ? `₹${cartTotal}` : 'Cart'}
        </span>
      </button>
    </nav>
  );
}
