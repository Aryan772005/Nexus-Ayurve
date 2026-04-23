import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, Heart, Calendar, ChevronRight, Star, Users, Award,
  Leaf, Quote, Shield, ShoppingBag, ExternalLink, ArrowRight,
  Brain, Camera, Stethoscope, Zap, Play, Volume2, VolumeX
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage({ onLogin, user }: { onLogin: () => void, user: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroScale    = useTransform(scrollYProgress, [0, 0.55], [1, 1.1]);
  const heroTextY    = useTransform(scrollYProgress, [0, 0.4],  [0, -50]);

  const toggleMute = () => {
    setMuted(m => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  const tools = [
    { to: '/diagnosis',    label: 'AI Diagnosis',   icon: Sparkles,    color: '#10B981', glow: 'rgba(16,185,129,0.25)',  desc: 'Symptom & dosha analysis' },
    { to: '/health-coach', label: 'Health Coach',   icon: Brain,       color: '#A78BFA', glow: 'rgba(167,139,250,0.25)', desc: '13-section wellness report' },
    { to: '/meal-analysis',label: 'Meal Analyser',  icon: Camera,      color: '#F97316', glow: 'rgba(249,115,22,0.25)',  desc: 'Scan & analyse your food' },
    { to: '/doctors',      label: 'Expert Doctors', icon: Stethoscope, color: '#60A5FA', glow: 'rgba(96,165,250,0.25)',  desc: 'Consult Ayurvedic doctors for ₹1' },
    { to: '/chat',         label: 'Nexus Ayurve Chat',  icon: Leaf,        color: '#34D399', glow: 'rgba(52,211,153,0.25)',  desc: 'Ask anything about your health' },
    { to: '/shop',         label: 'Herbal Shop',    icon: ShoppingBag, color: '#FBBF24', glow: 'rgba(251,191,36,0.25)',  desc: 'Trusted Ayurvedic products' },
  ];

  const herbs = [
    { name: 'Ashwagandha', benefit: 'Stress Relief',     emoji: '🌿', image: '/ashwagandha.png' },
    { name: 'Turmeric',    benefit: 'Anti-inflammatory', emoji: '🟡', image: '/turmeric.png'    },
    { name: 'Tulsi',       benefit: 'Immunity Boost',    emoji: '🍃', image: '/tulsi.png'       },
    { name: 'Triphala',    benefit: 'Digestive Health',  emoji: '🫐', image: '/triphala.png'    },
    { name: 'Brahmi',      benefit: 'Brain & Memory',    emoji: '🧠', image: '/brahmi.png'      },
  ];

  return (
    <div className="min-h-screen bg-forest text-cream overflow-x-hidden">

      {/* ════════════════════════════════════════
          CINEMATIC HERO — Full-bleed video
      ════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex flex-col items-center justify-end overflow-hidden">

        {/* Video layer with scroll-zoom — GPU-accelerated */}
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0" data-motion>
          <video
            ref={videoRef}
            autoPlay loop muted playsInline preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'translateZ(0)', willChange: 'transform', backfaceVisibility: 'hidden' }}
          >
            <source src="/nexus-ayurve-hero.mp4" type="video/mp4" />
          </video>

          {/* Simple overlays — no extra layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-transparent to-forest" style={{ transform: 'translateZ(0)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/40 via-transparent to-forest/40" />
          {/* Film-grain only on desktop — skip on mobile for perf */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none hidden md:block" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
          }} />
        </motion.div>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="absolute top-24 right-5 z-30 w-10 h-10 rounded-full bg-black/30 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 transition-all"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Hero text overlay */}
        <motion.div style={{ y: heroTextY }} className="relative z-10 w-full text-center px-5 pb-16 md:pb-28">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-accent/30 bg-emerald-accent/10 backdrop-blur-sm text-emerald-accent text-[11px] font-bold mb-6 uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
            Ancient Wisdom · Modern Intelligence
          </motion.div>

          {/* Giant brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.9 }}
            className="font-display font-bold leading-none mb-5"
            style={{ fontSize: 'clamp(3.5rem, 13vw, 9.5rem)', letterSpacing: '-0.025em' }}
          >
            <span className="text-cream drop-shadow-2xl">Nexus </span>
            <span style={{
              background: 'linear-gradient(130deg, #34D399 0%, #10B981 50%, #6EE7B7 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Ayurve</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
            className="text-cream/55 text-base md:text-xl max-w-md md:max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Consult Ayurvedic doctors, scan your meals with AI,<br className="hidden md:block" /> track your vitals — all in one platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {user ? (
              <Link to="/dashboard"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-forest transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 0 50px rgba(52,211,153,0.35)' }}>
                Go to Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button onClick={onLogin}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-forest transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 0 50px rgba(52,211,153,0.35)' }}>
                Get Started Free <Zap size={16} className="group-hover:scale-125 transition-transform" />
              </button>
            )}
            <Link to="/doctors"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-cream bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <Play size={14} className="fill-cream" /> See How It Works
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
        >
          <span className="text-cream/25 text-[9px] uppercase tracking-[0.2em]">Scroll</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-emerald-accent/50 to-transparent" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════ */}
      <section className="relative z-10 py-7 border-y border-cream/[0.08] stats-surface">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 text-center">
          {[
            { num: '8+',      label: 'Expert Doctors'   },
            { num: 'Trusted', label: 'AI Platform'      },
            { num: '₹1',      label: 'Per Consultation' },
            { num: '4.8★',    label: 'Average Rating'   },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <p className="text-2xl md:text-3xl font-display font-bold text-cream mb-0.5">{s.num}</p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-accent/50">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          AI TOOLS GRID — the OMA-style section
      ════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-24 md:py-36 overflow-hidden">
        {/* Ambient orb — small, CPU-painted once, no animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.06] pointer-events-none hidden md:block"
          style={{ background: 'radial-gradient(circle, #10B981, transparent)', transform: 'translate(-50%, -50%) translateZ(0)' }} />

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent text-[11px] font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} /> AI-Powered Suite
            </div>
            <h2 className="font-display font-bold text-cream mb-5"
              style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              Everything in one<br />
              <span style={{
                background: 'linear-gradient(130deg, #34D399, #6EE7B7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>wellness platform</span>
            </h2>
            <p className="text-cream/35 text-lg max-w-lg mx-auto">
              Ancient Ayurvedic knowledge, supercharged with modern AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={tool.to}
                  className="card-surface group relative flex flex-col h-full p-6 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.12]"
                >
                  {/* Hover radial glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{ background: `radial-gradient(ellipse at 20% 10%, ${tool.glow} 0%, transparent 65%)` }} />

                  {/* Icon */}
                  <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${tool.color}18`, border: `1px solid ${tool.color}35` }}>
                    <tool.icon size={20} style={{ color: tool.color }} />
                  </div>

                  <h3 className="font-display font-bold text-lg text-cream mb-1.5 group-hover:text-white transition-colors">{tool.label}</h3>
                  <p className="text-cream/35 text-sm leading-relaxed flex-1">{tool.desc}</p>

                  <div className="flex items-center gap-1.5 mt-5 font-bold text-sm transition-all duration-300"
                    style={{ color: tool.color }}>
                    Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SACRED HERBS — cinematic card grid
      ════════════════════════════════════════ */}
      <section className="relative z-10 py-24 md:py-32 border-y border-white/[0.06] overflow-hidden">
        {/* Static bg — bg-fixed removed (iOS broken + laggy everywhere) */}
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/bg-herbs.png')" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest via-transparent to-forest" />

        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <h2 className="font-display font-bold text-cream mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}>
              Sacred Herbs
            </h2>
            <p className="text-cream/35 text-base max-w-sm mx-auto">
              Nature's most potent healing ingredients used in our protocols.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {herbs.map((herb, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="group relative rounded-3xl overflow-hidden border border-white/[0.06] hover:border-emerald-accent/25 transition-all duration-500 aspect-[3/4]"
              >
                <img src={herb.image} alt={herb.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xl mb-0.5">{herb.emoji}</p>
                  <h4 className="font-bold text-cream text-sm mb-0.5">{herb.name}</h4>
                  <p className="text-emerald-accent/70 text-[11px]">{herb.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="relative z-10 py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <h2 className="font-display font-bold text-cream mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}>
              Real Stories
            </h2>
            <p className="text-cream/35 text-base max-w-md mx-auto">
              From people who transformed their health with Nexus Ayurve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Meera K.', loc: 'Delhi',     avatar: 'M', color: '#34D399',
                text: 'The AI diagnosed my digestive issues perfectly. The Ayurvedic diet plan worked in just 2 weeks!' },
              { name: 'Rohit S.', loc: 'Mumbai',    avatar: 'R', color: '#A78BFA',
                text: 'Booking a consultation for ₹1 was unbelievable. Dr. Vikram\'s therapy completely changed my health.' },
              { name: 'Anita P.', loc: 'Bangalore', avatar: 'A', color: '#F97316',
                text: 'Finally an app that blends modern science with ancient wisdom. BMI with Dosha mapping is genius!' },
            ].map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-surface-subtle relative p-6 rounded-3xl overflow-hidden"
              >
                <Quote size={30} className="absolute top-5 right-5 text-white/[0.04]" />
                <p className="text-cream/65 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}30` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-cream text-sm">{t.name}</p>
                    <p className="text-[11px] text-cream/30">{t.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SHOP SECTION
      ════════════════════════════════════════ */}
      <section className="relative z-10 py-24 md:py-32 border-t border-white/[0.06] px-5 md:px-8 overflow-hidden">
        {/* Static bg — no bg-fixed on mobile */}
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('/bg-shop.png')" }} />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-4">
                <ShoppingBag size={11} /> Ayurvedic Shop
              </div>
              <h2 className="font-display font-bold text-cream mb-2"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
                Trusted Medicines
              </h2>
              <p className="text-cream/35 text-base max-w-md">Handpicked from top Indian brands. Fast, trusted delivery.</p>
            </motion.div>
            <Link to="/shop" className="mt-5 md:mt-0 flex items-center gap-1.5 text-emerald-accent font-bold text-sm hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Ashwagandha KSM-66', brand: 'Himalaya',      price: 299, mrp: 450, image: '/med-ashwagandha.png',  rating: 4.7, badge: 'Bestseller',   link: 'https://www.1mg.com/search/all?name=ashwagandha' },
              { name: 'Chyawanprash',        brand: 'Dabur',         price: 350, mrp: 499, image: '/med-chyawanprash.png', rating: 4.8, badge: 'Most Popular', link: 'https://www.1mg.com/search/all?name=chyawanprash' },
              { name: 'Shilajit Gold Resin', brand: 'Zandu',         price: 399, mrp: 599, image: '/med-shilajit.png',     rating: 4.4, badge: 'Premium',      link: 'https://www.1mg.com/search/all?name=shilajit' },
              { name: 'Tulsi Drops',         brand: 'Organic India', price: 220, mrp: 350, image: '/med-tulsi.png',        rating: 4.6, badge: null,           link: 'https://www.1mg.com/search/all?name=tulsi+drops' },
            ].map((med, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                className="card-surface-subtle group rounded-3xl overflow-hidden hover:border-emerald-accent/20 transition-all duration-500 hover:-translate-y-1.5"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={med.image} alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
                  {med.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-accent text-forest text-[10px] font-bold">
                      {med.badge}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-cream text-[11px] font-bold">{med.rating}</span>
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-emerald-accent/50 text-[9px] font-bold uppercase tracking-wider mb-1">{med.brand}</p>
                  <h4 className="text-cream font-bold text-[12px] md:text-sm mb-2 truncate">{med.name}</h4>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-lg font-display font-bold text-cream">₹{med.price}</span>
                    <span className="text-[10px] text-cream/30 line-through">₹{med.mrp}</span>
                    <span className="text-[9px] font-bold text-emerald-accent">{Math.round((1 - med.price / med.mrp) * 100)}% OFF</span>
                  </div>
                  <a href={med.link} target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-accent text-forest font-bold text-[11px] hover:bg-emerald-accent/90 transition-all flex items-center justify-center gap-1.5">
                    Buy Now <ExternalLink size={11} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA — Cinematic close
      ════════════════════════════════════════ */}
      <section className="relative z-10 py-32 md:py-44 px-5 text-center overflow-hidden">
        {/* Radial glow — smaller + GPU layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[350px] h-[350px] rounded-full blur-[70px] opacity-[0.12] hidden md:block"
            style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)', transform: 'translateZ(0)' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent text-[11px] font-bold uppercase tracking-widest mb-8">
            <Leaf size={12} /> Begin Your Journey
          </div>
          <h2 className="font-display font-bold text-cream mb-5"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Start Healing<br />
            <span style={{
              background: 'linear-gradient(135deg, #34D399, #6EE7B7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Today</span>
          </h2>
          <p className="text-cream/35 text-base mb-10 max-w-md mx-auto">
            Join thousands balancing their doshas, tracking vitals, and consulting Ayurvedic experts.
          </p>
          {user ? (
            <Link to="/doctors"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base text-forest transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 0 70px rgba(52,211,153,0.4)' }}>
              Browse Doctors <ChevronRight size={18} />
            </Link>
          ) : (
            <button onClick={onLogin}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base text-forest transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 0 70px rgba(52,211,153,0.4)' }}>
              Sign Up Free <Zap size={18} />
            </button>
          )}
        </motion.div>
      </section>

    </div>
  );
}
