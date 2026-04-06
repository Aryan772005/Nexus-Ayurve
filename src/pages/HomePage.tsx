import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Calendar, ChevronRight, Star, Users, Award, Leaf, Quote, Shield, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage({ onLogin, user }: { onLogin: () => void, user: any }) {
  return (
    <div className="min-h-screen bg-forest overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-accent/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 14, repeat: Infinity, delay: 3 }}
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-emerald-accent/5 rounded-full blur-[150px]" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-10 md:pt-28 md:pb-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-accent/10 text-emerald-accent text-xs md:text-sm font-bold mb-6 md:mb-8 border border-emerald-accent/20"
          >
            <Sparkles size={14} className="md:w-4 md:h-4" /> Premium Holistic Wellness
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-display font-bold text-gradient leading-tight mb-3 md:mb-8"
          >
            Ayurcare<span className="text-emerald-accent">+</span>
          </motion.h1>

          {/* Hero Wellness Image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.7, ease: 'easeOut' }}
            className="relative mx-auto mb-10"
            style={{ maxWidth: '520px' }}
          >
            {/* Glow ring */}
            <div style={{
              position: 'absolute', inset: '-3px',
              background: 'linear-gradient(135deg, rgba(52,211,153,0.5) 0%, rgba(16,185,129,0.2) 50%, rgba(52,211,153,0.4) 100%)',
              borderRadius: '28px',
              filter: 'blur(8px)',
              zIndex: 0,
            }} />
            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(52,211,153,0.25)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-[180px] sm:h-[220px] md:h-[280px] object-cover object-center block"
                style={{ transform: 'translateZ(0)' }}
              >
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(5,27,18,0.75) 0%, rgba(5,27,18,0.1) 60%, transparent 100%)',
              }} />
              {/* Floating badge */}
              <div style={{
                position: 'absolute', bottom: '16px', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(5,27,18,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(52,211,153,0.3)',
                borderRadius: '99px',
                padding: '6px 20px',
                display: 'flex', alignItems: 'center', gap: '8px',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: '#34d399', fontSize: '14px' }}>🌿</span>
                <span style={{ color: '#ecfdf5', fontSize: '13px', fontWeight: 700, letterSpacing: '0.03em' }}>
                  Ayurvedic Wellness Platform
                </span>
              </div>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-cream/70 mb-6 md:mb-12 leading-relaxed px-2"
          >
            Ancient wisdom meets modern intelligence. Consult with top Indian Ayurvedic doctors, track your vitals, and balance your life — all from one platform.
          </motion.p>

          {/* WOW FACTOR CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
            className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto"
          >
            {/* Feature 1: AI Diagnosis */}
            <div 
              onClick={() => user ? window.location.href = '/diagnosis' : onLogin()}
              className="group relative cursor-pointer"
            >
              {/* Subtle Glow Behind */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-accent to-blue-500/50 rounded-[24px] md:rounded-[32px] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              {/* Premium Glass Card */}
              <div className="relative h-full bg-moss/70 backdrop-blur-2xl border border-white/10 p-4 sm:p-8 rounded-[24px] md:rounded-[32px] flex items-center gap-4 sm:gap-6 transform group-hover:-translate-y-2 transition-all duration-500 md:shadow-2xl md:shadow-black/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/5 border border-emerald-accent/30 flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_20px_rgba(52,211,153,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Sparkles className="text-emerald-accent w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-base sm:text-xl md:text-2xl font-display font-bold text-cream mb-0.5 md:mb-1">AI Diagnosis</h3>
                  <p className="text-[10px] sm:text-sm text-emerald-accent/60 font-medium leading-tight md:leading-relaxed">Instant symptom analysis with intelligent dosha mapping.</p>
                </div>
                <ChevronRight className="text-emerald-accent/30 group-hover:text-emerald-accent transition-colors group-hover:translate-x-1.5 duration-300" size={20} />
              </div>
            </div>

            {/* Feature 2: AI Health Checker */}
            <div 
              onClick={() => user ? window.location.href = '/health-coach' : onLogin()}
              className="group relative cursor-pointer"
            >
              {/* Subtle Glow Behind */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-emerald-accent rounded-[24px] md:rounded-[32px] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              {/* Premium Glass Card */}
              <div className="relative h-full bg-moss/70 backdrop-blur-2xl border border-white/10 p-4 sm:p-8 rounded-[24px] md:rounded-[32px] flex items-center gap-4 sm:gap-6 transform group-hover:-translate-y-2 transition-all duration-500 md:shadow-2xl md:shadow-black/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-400/20 to-emerald-accent/5 border border-purple-400/30 flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_20px_rgba(192,132,252,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Shield className="text-purple-400 w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-base sm:text-xl md:text-2xl font-display font-bold text-cream mb-0.5 md:mb-1">AI Health Checker</h3>
                  <p className="text-[10px] sm:text-sm text-purple-400/60 font-medium leading-tight md:leading-relaxed">Complete holistic wellness blueprint & health tracking.</p>
                </div>
                <ChevronRight className="text-purple-400/30 group-hover:text-purple-400 transition-colors group-hover:translate-x-1.5 duration-300" size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 md:py-12 px-4 sm:px-6 bg-moss/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-8 text-center">
          {[
            { num: "8+", label: "Expert Doctors", icon: <Users size={16} className="md:w-5 md:h-5" /> },
            { num: "Trusted", label: "Platform", icon: <Shield size={16} className="md:w-5 md:h-5" /> },
            { num: "₹1", label: "Per Session", icon: <Award size={16} className="md:w-5 md:h-5" /> },
            { num: "4.8★", label: "Avg. Rating", icon: <Star size={16} className="md:w-5 md:h-5" /> },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <div className="text-emerald-accent mb-1 md:mb-2 flex justify-center">{s.icon}</div>
              <p className="text-xl md:text-3xl font-display font-bold text-cream">{s.num}</p>
              <p className="text-[9px] md:text-xs text-emerald-accent/50 uppercase tracking-widest mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 py-10 md:py-24 relative z-10 bg-[url('/bg-features.png')] bg-cover bg-center bg-fixed bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-forest/85 before:-z-10">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-center text-cream mb-2 md:mb-4">Everything You Need</h2>
        <p className="text-xs md:text-base text-center text-emerald-accent/60 mb-8 md:mb-16 max-w-xl mx-auto px-2">A complete Ayurvedic wellness platform for every aspect of your health journey.</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
          {[
            { icon: <Heart className="text-rose-400 w-7 h-7 md:w-10 md:h-10" />, title: "Vitals Tracker", desc: "Monitor heart rate, BMI, and calorie intake tailored to your specific Ayurvedic Dosha." },
            { icon: <Calendar className="text-emerald-accent w-7 h-7 md:w-10 md:h-10" />, title: "Expert Doctors", desc: "Book consultations with verified Indian Ayurvedic physicians for just ₹1." },
            { icon: <Sparkles className="text-blue-400 w-7 h-7 md:w-10 md:h-10" />, title: "AI Diagnosis", desc: "Use text, voice, or body map to let our AI analyze symptoms." },
            { icon: <Leaf className="text-green-400 w-7 h-7 md:w-10 md:h-10" />, title: "Herbal Guides", desc: "Explore dosha-specific diet plans, Triphala remedies, and tips." },
            { icon: <Award className="text-purple-400 w-7 h-7 md:w-10 md:h-10" />, title: "Food Scanner", desc: "Upload meal images for instant nutritional analysis via NVIDIA AI." },
            { icon: <Star className="text-yellow-400 w-7 h-7 md:w-10 md:h-10" />, title: "Food Database", desc: "Check calories and Ayurvedic properties of common Indian dishes." },
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-moss/30 backdrop-blur-xl p-5 md:p-10 rounded-[24px] md:rounded-[40px] border border-white/5 shadow-2xl hover:border-emerald-accent/20 transition-all hover:-translate-y-1 md:hover:-translate-y-2 group"
            >
              <div className="mb-3 md:mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-lg md:text-2xl font-display font-bold mb-1 md:mb-3 text-cream">{f.title}</h3>
              <p className="text-[11px] md:text-base text-emerald-accent/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Herbs Section */}
      <section className="px-4 sm:px-6 py-10 md:py-20 border-y border-white/5 relative z-10 bg-[url('/bg-herbs.png')] bg-cover bg-center bg-fixed bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-forest/90 before:-z-10">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-center text-cream mb-2 md:mb-4">Sacred Herbs of Ayurveda</h2>
        <p className="text-xs md:text-base text-center text-emerald-accent/60 mb-8 md:mb-16 max-w-xl mx-auto px-2">Nature's most potent healing ingredients used in our treatment protocols.</p>
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
          {[
            { name: "Ashwagandha", benefit: "Stress relief", emoji: "🌿", image: "/ashwagandha.png" },
            { name: "Turmeric", benefit: "Anti-inflammatory", emoji: "🟡", image: "/turmeric.png" },
            { name: "Tulsi", benefit: "Immunity booster", emoji: "🍃", image: "/tulsi.png" },
            { name: "Triphala", benefit: "Digestive health", emoji: "🫐", image: "/triphala.png" },
            { name: "Brahmi", benefit: "Brain & memory", emoji: "🧠", image: "/brahmi.png" },
          ].map((herb, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-forest/60 border border-white/5 rounded-[20px] md:rounded-3xl p-3 md:p-5 text-center hover:border-emerald-accent/30 transition-all hover:-translate-y-1 md:hover:-translate-y-2 cursor-default group"
            >
              <div className="mb-3 md:mb-4 relative rounded-xl md:rounded-2xl overflow-hidden aspect-square shadow-lg shadow-black/20">
                <img 
                  src={herb.image} 
                  alt={herb.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <h4 className="font-bold text-cream text-[13px] md:text-lg flex items-center justify-center gap-1 md:gap-2">
                {herb.name} <span className="text-sm md:text-xl">{herb.emoji}</span>
              </h4>
              <p className="text-[10px] md:text-sm text-emerald-accent/70 mt-0.5">{herb.benefit}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 py-10 md:py-24 relative z-10 bg-[url('/bg-testimonials.png')] bg-cover bg-center bg-fixed bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-forest/85 before:-z-10">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-center text-cream mb-2 md:mb-4">What Our Users Say</h2>
        <p className="text-xs md:text-base text-center text-emerald-accent/60 mb-8 md:mb-16 max-w-xl mx-auto px-2">Real stories from people who transformed their health with Ayurcare+.</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {[
            { name: "Meera K.", location: "Delhi", text: "The AI assistant diagnosed my digestive issues perfectly. The Ayurvedic diet plan worked wonders in just 2 weeks!", avatar: "M" },
            { name: "Rohit S.", location: "Mumbai", text: "Booking a consultation for ₹1 was unbelievable. Dr. Vikram Singh's rejuvenation therapy changed my life completely.", avatar: "R" },
            { name: "Anita P.", location: "Bangalore", text: "I love the BMI calculator with Dosha mapping. Finally an app that combines modern science with ancient wisdom!", avatar: "A" },
          ].map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-moss/30 border border-white/5 rounded-[20px] md:rounded-3xl p-5 md:p-8 relative"
            >
              <Quote className="text-emerald-accent/10 absolute top-4 md:top-6 right-4 md:right-6 md:w-10 md:h-10 w-6 h-6" />
              <p className="text-cream/80 leading-relaxed text-xs md:text-base mb-4 md:mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-accent/20 text-emerald-accent flex items-center justify-center font-bold text-xs md:text-sm">{t.avatar}</div>
                <div>
                  <p className="font-bold text-cream text-[11px] md:text-sm">{t.name}</p>
                  <p className="text-[10px] md:text-xs text-emerald-accent/50">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Medicines — Shop Promo */}
      <section className="px-4 sm:px-6 py-10 md:py-24 border-y border-white/5 relative z-10 bg-[url('/bg-shop.png')] bg-cover bg-center bg-fixed bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-forest/90 before:-z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-emerald-accent/10 text-emerald-accent text-[10px] md:text-xs font-bold mb-3 md:mb-4 border border-emerald-accent/20">
                <ShoppingBag size={12} className="md:w-[14px] md:h-[14px]" /> New — Ayurvedic Shop
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-cream mb-1 md:mb-2">Shop Trusted Medicines</h2>
              <p className="text-xs md:text-base text-emerald-accent/60 max-w-lg">Handpicked Ayurvedic medicines from top Indian brands. Fast and trusted delivery.</p>
            </div>
            <Link to="/shop" className="mt-4 md:mt-0 text-emerald-accent font-bold text-[11px] md:text-sm hover:underline flex items-center gap-1">
              View All Medicines <ChevronRight size={14} className="md:w-4 md:h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { name: "Ashwagandha KSM-66", brand: "Himalaya", price: 299, mrp: 450, image: "/med-ashwagandha.png", rating: 4.7, badge: "Bestseller", link: "https://www.1mg.com/search/all?name=ashwagandha" },
              { name: "Chyawanprash", brand: "Dabur", price: 350, mrp: 499, image: "/med-chyawanprash.png", rating: 4.8, badge: "Most Popular", link: "https://www.1mg.com/search/all?name=chyawanprash" },
              { name: "Shilajit Gold Resin", brand: "Zandu", price: 399, mrp: 599, image: "/med-shilajit.png", rating: 4.4, badge: "Premium", link: "https://www.1mg.com/search/all?name=shilajit" },
              { name: "Tulsi Drops", brand: "Organic India", price: 220, mrp: 350, image: "/med-tulsi.png", rating: 4.6, link: "https://www.1mg.com/search/all?name=tulsi+drops" },
            ].map((med, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-forest/60 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-accent/25 transition-all hover:-translate-y-2 shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
                  {med.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-accent text-forest text-xs font-bold shadow-lg">{med.badge}</span>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest/80 backdrop-blur-sm border border-white/10">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-cream text-xs font-bold">{med.rating}</span>
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-emerald-accent/50 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider">{med.brand}</p>
                  <h4 className="text-cream font-bold text-[11px] md:text-sm mb-1.5 md:mb-2 truncate">{med.name}</h4>
                  <div className="flex items-baseline md:flex-row flex-col sm:flex-row gap-1 sm:gap-2 mb-2 md:mb-3">
                    <span className="text-[15px] md:text-xl font-display font-bold text-cream">₹{med.price}</span>
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[10px] md:text-xs text-cream/30 line-through">₹{med.mrp}</span>
                      <span className="text-[8px] md:text-[10px] font-bold text-emerald-accent bg-emerald-accent/10 px-1 md:px-1.5 py-0.5 rounded-full">
                        {Math.round((1 - med.price / med.mrp) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                  <a
                    href={med.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 md:py-2.5 rounded-lg md:rounded-xl bg-emerald-accent text-forest font-bold text-[10px] md:text-xs hover:bg-emerald-accent/90 transition-all flex items-center justify-center gap-1"
                  >
                    Buy Now <ExternalLink size={11} className="md:w-[13px] md:h-[13px]" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-10 md:py-20 bg-moss/30 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-cream mb-2 md:mb-4 px-2">Start Your Healing Journey Today</h2>
          <p className="text-xs md:text-lg text-emerald-accent/60 mb-6 md:mb-10 px-2 mt-1">Join thousands who are balancing their doshas, tracking vitals, and consulting experts.</p>
          {user ? (
            <Link to="/doctors" className="bg-emerald-accent text-forest px-6 py-3.5 md:px-10 md:py-5 rounded-full text-sm md:text-xl font-bold shadow-xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 transition-all inline-flex items-center gap-2">
              Browse Doctors <ChevronRight size={18} className="md:w-6 md:h-6" />
            </Link>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-emerald-accent text-forest px-6 py-3.5 md:px-10 md:py-5 rounded-full text-sm md:text-xl font-bold shadow-xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 transition-all inline-flex items-center gap-2 mx-auto"
            >
              Sign Up <ChevronRight size={18} className="md:w-6 md:h-6" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
