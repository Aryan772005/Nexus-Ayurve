import React from 'react';
import { Leaf, MapPin, Phone, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-moss/20 border-t border-white/5 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
        
        {/* Brand & Location */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 opacity-50">
            <Leaf size={24} className="text-emerald-accent" />
            <span className="font-display font-bold text-xl text-cream">Ayurcare+</span>
          </div>
          <p className="text-xs text-emerald-accent/30 flex items-center gap-1 mt-1">
            <MapPin size={12} /> Desh Bhagat University, Mandi Govindgarh
          </p>
        </div>
        
        {/* Core Team Details */}
        <div className="flex flex-col items-center md:items-start text-sm text-emerald-accent/60 gap-1.5 bg-forest/40 p-5 rounded-2xl border border-white/5 shadow-inner">
          <p className="flex items-center gap-2 font-bold text-cream mb-1 text-base">
            <Users size={16} className="text-emerald-accent" /> Team Leadership
          </p>
          <p><strong className="text-cream/90">CEO:</strong> Aryan Singh Tariani</p>
          <p><strong className="text-cream/90">Business Analyst:</strong> Rounak</p>
          <p><strong className="text-cream/90">Data Management:</strong> Nitin Gupta</p>
          <a href="tel:+919475002048" className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-emerald-accent hover:text-white transition-colors font-medium">
            <Phone size={14} /> +91 94750 02048
          </a>
        </div>
        
        {/* Copyright & Links */}
        <div className="text-center md:text-right flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-4 text-sm font-medium text-emerald-accent/60">
            <a href="#" className="hover:text-emerald-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-accent transition-colors">Terms of Service</a>
          </div>
          <p className="text-sm text-emerald-accent/40">
            &copy; {new Date().getFullYear()} Aryan Singh Tariani.<br />All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
