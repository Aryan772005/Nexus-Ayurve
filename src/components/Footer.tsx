import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ShieldCheck, Phone, Mail, MapPin,
  ArrowUpRight, Award, Truck, Lock, CheckCircle2,
  Heart, Sparkles, Stethoscope, Activity, FileText
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      
      {/* ── 1MG TRUST HIGHLIGHT STRIP ── */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Formulations</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Sourced directly from licensed Ayurvedic pharmacies & wildcrafters</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Safe & Express Delivery</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Temperature-monitored sealed packaging straight to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Ayush & GMP Certified</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Strict adherence to classical texts and modern laboratory assays</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Lock size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">HIPAA & AES-256 Secure</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Your prescriptions and health records are completely private</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN SITEMAP COLUMNS ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                <Leaf size={20} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                NEXUS <span className="text-emerald-400">AYURVE</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              India's premier digital Ayurvedic healthcare ecosystem. Handcrafted authentic medicines, certified doctor teleconsultations, and AI-driven dosha diagnostic intelligence.
            </p>

            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Desh Bhagat University, Mandi Gobindgarh, Punjab 147301</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <a href="tel:+919475002048" className="hover:text-emerald-400 transition">+91 94750 02048 (CEO Aryan Singh Tariani)</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-emerald-400 shrink-0" />
                <span>support@nexusayurve.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Our Services</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/shop" className="hover:text-white transition">Order Medicines</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition">Consult BAMS Doctors</Link></li>
              <li><Link to="/shop?filter=lab-tests" className="hover:text-white transition">Book Lab Tests & Scans</Link></li>
              <li><Link to="/ayurcoach" className="hover:text-white transition">AyurCoach AI</Link></li>
              <li><Link to="/meal-analysis" className="hover:text-white transition">AI Meal Analyser</Link></li>
              <li><Link to="/diagnosis" className="hover:text-white transition">AI Dosha Diagnosis</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Ayurvedic Remedies</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/shop?category=Stress+%26+Sleep" className="hover:text-white transition">Ashwagandha KSM-66</Link></li>
              <li><Link to="/shop?category=Immunity+%26+Vitality" className="hover:text-white transition">Amla Chyawanprash</Link></li>
              <li><Link to="/shop?category=Vitality+%26+Strength" className="hover:text-white transition">Himalayan Shilajit Gold</Link></li>
              <li><Link to="/shop?category=Digestion+%26+Gut" className="hover:text-white transition">Triphala Churna</Link></li>
              <li><Link to="/shop?category=Skin+%26+Hair" className="hover:text-white transition">Kumkumadi Saffron Oil</Link></li>
              <li><Link to="/shop?category=Joint+%26+Pain" className="hover:text-white transition">Turmeric Curcumin 95%</Link></li>
            </ul>
          </div>

          {/* Trust & Accreditations */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Certifications</h5>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Ayush Ministry Guidelines Compliant</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-sky-400 shrink-0" />
                <span>NABL Accredited Diagnostics</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Good Manufacturing Practices (GMP)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATUTORY DISCLAIMER (1mg Style) ── */}
        <div className="border-t border-slate-800 pt-6 pb-4 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> Nexus Ayurve is a digital platform connecting users with authentic Ayurvedic products, certified diagnostic laboratories, and licensed Ayurvedic medical practitioners. The information contained herein is for informational and educational purposes only and is not intended to substitute professional medical advice, diagnosis, or treatment. Always seek the advice of your Ayurvedic physician or qualified healthcare provider with any questions you may have regarding a medical condition.
          </p>
        </div>

        {/* ── BOTTOM COPYRIGHT ── */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Nexus Ayurve by Aryan Singh Tariani. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Editorial Policy</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
