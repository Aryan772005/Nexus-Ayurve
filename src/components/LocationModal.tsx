import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Check, Navigation, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const POPULAR_CITIES = [
  { city: 'New Delhi', pincode: '110001' },
  { city: 'Mumbai', pincode: '400001' },
  { city: 'Bengaluru', pincode: '560001' },
  { city: 'Hyderabad', pincode: '500001' },
  { city: 'Kolkata', pincode: '700001' },
  { city: 'Chennai', pincode: '600001' },
  { city: 'Pune', pincode: '411001' },
  { city: 'Ahmedabad', pincode: '380001' },
  { city: 'Jaipur', pincode: '302001' },
  { city: 'Chandigarh', pincode: '160017' }
];

export default function LocationModal() {
  const { isLocationOpen, closeLocation, city, pincode, setLocation } = useCart();
  const [inputPincode, setInputPincode] = useState('');
  const [error, setError] = useState('');

  if (!isLocationOpen) return null;

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPincode.trim().length !== 6 || !/^\d+$/.test(inputPincode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setError('');
    setLocation(`PIN: ${inputPincode.trim()}`, inputPincode.trim());
    closeLocation();
  };

  const handleCitySelect = (selectedCity: string, selectedPin: string) => {
    setLocation(selectedCity, selectedPin);
    closeLocation();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLocation}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Select Delivery Location</h3>
                <p className="text-xs text-slate-500">Get fast delivery times & authentic Ayurvedic medicines in your area</p>
              </div>
            </div>
            <button
              onClick={closeLocation}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Pincode Form */}
            <form onSubmit={handlePincodeSubmit} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enter 6-digit Pincode</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={inputPincode}
                    onChange={(e) => {
                      setInputPincode(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. 110001, 400050"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition active:scale-95 shadow-sm"
                >
                  Check
                </button>
              </div>
              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
            </form>

            {/* Current Selected */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Navigation size={16} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-800 font-medium">Currently Delivering to:</p>
                  <p className="text-sm font-bold text-emerald-950">{city} ({pincode})</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full shadow-xs border border-emerald-200">
                Active
              </span>
            </div>

            {/* Popular Cities */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Popular Delivery Hubs</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_CITIES.map((c) => {
                  const isSelected = city === c.city || pincode === c.pincode;
                  return (
                    <button
                      key={c.city}
                      onClick={() => handleCitySelect(c.city, c.pincode)}
                      className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{c.city}</div>
                        <div className="text-[10px] text-slate-400">{c.pincode}</div>
                      </div>
                      {isSelected && <Check size={14} className="text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
