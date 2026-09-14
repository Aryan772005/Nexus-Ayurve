import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ShieldCheck, Phone, Mail, MapPin,
  LayoutDashboard, Stethoscope, ShoppingBag,
  Brain, Activity, MessageSquare, HeartPulse,
  ArrowUpRight, Github, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { to: '/dashboard',    label: 'My Dashboard'      },
    { to: '/doctors',      label: 'Consult Experts'   },
    { to: '/shop',         label: 'Herbal Shop'        },
    { to: '/chat',         label: 'Nexus AI Chat'      },
  ],
  'AI Tools': [
    { to: '/health-coach',  label: 'AI Health Coach'  },
    { to: '/diagnosis',     label: 'AI Diagnosis'     },
    { to: '/meal-analysis', label: 'Meal AI Analyser' },
    { to: '/tools',         label: 'BMI & Heart'      },
  ],
  Wellness: [
    { to: '/calorie-checker', label: 'Calorie Checker' },
    { to: '/guides',          label: 'Health Guides'   },
  ] };

const BADGES = [
  { label: 'HIPAA Secured', color: '#00D97E', bg: 'rgba(0,217,126,0.08)', border: 'rgba(0,217,126,0.2)' },
  { label: 'AES-256',       color: '#A78BFA', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
  { label: 'Zero Data',     color: '#60A5FA', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t mt-auto overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-forest) 0%, var(--color-moss) 100%)',
        borderColor: 'var(--color-border)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,217,126,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">
        {/* TOP ROW — Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #00D97E, #00B868)', boxShadow: '0 4px 20px rgba(0,217,126,0.35)' }}
              >
                <Leaf size={18} className="text-[#080C10]" />
              </div>
              <div>
                <p className="font-display font-bold text-xl leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  <span className="text-gradient">Nexus</span>
                  <span className="text-cream/90"> Ayurve</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#00D97E]/60 mt-0.5">Ayurvedic AI Platform</p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-[13px] text-cream/45 leading-relaxed max-w-xs">
              Ancient wisdom meets modern AI. Personalised Ayurvedic health insights, doctor consultations, and wellness tools — all in one secure platform.
            </p>

            {/* Security badges */}
            <div className="flex flex-wrap gap-2">
              {BADGES.map(b => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}
                >
                  <ShieldCheck size={10} />
                  {b.label}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[12px] text-cream/40">
                <MapPin size={12} className="text-[#00D97E]/50 flex-shrink-0" />
                <span>Desh Bhagat University, Mandi Govindgarh</span>
              </div>
              <a href="tel:+919475002048" className="flex items-center gap-2.5 text-[12px] text-cream/40 hover:text-[#00D97E] transition-colors">
                <Phone size={12} className="text-[#00D97E]/50 flex-shrink-0" />
                +91 94750 02048
              </a>
              <div className="flex items-center gap-2.5 text-[12px] text-cream/40">
                <Mail size={12} className="text-[#00D97E]/50 flex-shrink-0" />
                <span>CEO: Aryan Singh Tariani</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/35"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-1.5 text-[13px] text-cream/45 hover:text-cream transition-colors duration-150"
                    >
                      <ArrowUpRight size={11} className="text-[#00D97E]/0 group-hover:text-[#00D97E] transition-all -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div
          className="h-px w-full mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
        />

        {/* BOTTOM ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/25 text-center sm:text-left">
            © 2026 Nexus Ayurve by Aryan Singh Tariani. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-cream/20">Powered by Gemini AI</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D97E] animate-pulse" />
              <span className="text-[10px] text-[#00D97E]/60 font-bold uppercase tracking-wider">Systems Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
