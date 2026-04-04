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
      <section className="relative pt-40 pb-28 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-accent/10 text-emerald-accent text-sm font-bold mb-8 border border-emerald-accent/20"
          >
            <Sparkles size={16} /> Premium Holistic Wellness
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-gradient leading-tight mb-8"
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
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                  transform: 'translateZ(0)',
                }}
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
            className="max-w-2xl mx-auto text-xl text-cream/70 mb-12 leading-relaxed"
          >
            Ancient wisdom meets modern intelligence. Consult with top Indian Ayurvedic doctors, track your vitals, and balance your life — all from one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              <Link 
                to="/dashboard"
                className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all inline-flex items-center gap-3"
              >
                Go to Dashboard <ChevronRight />
              </Link>
            ) : (
              <button 
                onClick={onLogin}
                className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              >
                Get Started Free <ChevronRight />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6 bg-moss/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "8+", label: "Expert Doctors", icon: <Users size={20} /> },
            { num: "Trusted", label: "Platform", icon: <Shield size={20} /> },
            { num: "₹1", label: "Per Session", icon: <Award size={20} /> },
            { num: "4.8★", label: "Avg. Rating", icon: <Star size={20} /> },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <div className="text-emerald-accent mb-2 flex justify-center">{s.icon}</div>
              <p className="text-3xl font-display font-bold text-cream">{s.num}</p>
              <p className="text-xs text-emerald-accent/50 uppercase tracking-widest mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24 relative z-10">
        <h2 className="text-4xl font-display font-bold text-center text-cream mb-4">Everything You Need</h2>
        <p className="text-center text-emerald-accent/60 mb-16 max-w-xl mx-auto">A complete Ayurvedic wellness platform for every aspect of your health journey.</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Heart className="text-rose-400 w-10 h-10" />, title: "Vitals Tracker", desc: "Monitor heart rate, BMI, and calorie intake tailored to your specific Ayurvedic Dosha." },
            { icon: <Calendar className="text-emerald-accent w-10 h-10" />, title: "Expert Doctors", desc: "Book 1-on-1 consultations with verified Indian Ayurvedic physicians for just ₹1." },
            { icon: <Sparkles className="text-blue-400 w-10 h-10" />, title: "AI Assistant", desc: "Chat with our advanced AI to analyze symptoms and get personalized Ayurvedic recommendations." },
            { icon: <Leaf className="text-green-400 w-10 h-10" />, title: "Herbal Guides", desc: "Explore dosha-specific diet plans, Triphala remedies, and weight management tips." },
            { icon: <Award className="text-purple-400 w-10 h-10" />, title: "BMI & Prakriti", desc: "Calculate your BMI and discover your body constitution type for better health decisions." },
            { icon: <Star className="text-yellow-400 w-10 h-10" />, title: "Food Database", desc: "Check calories and Ayurvedic properties of 50+ common Indian dishes instantly." },
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-moss/30 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl hover:border-emerald-accent/20 transition-all hover:-translate-y-2 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-2xl font-display font-bold mb-3 text-cream">{f.title}</h3>
              <p className="text-emerald-accent/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Herbs Section */}
      <section className="px-6 py-20 bg-moss/20 border-y border-white/5">
        <h2 className="text-4xl font-display font-bold text-center text-cream mb-4">Sacred Herbs of Ayurveda</h2>
        <p className="text-center text-emerald-accent/60 mb-16 max-w-xl mx-auto">Nature's most potent healing ingredients used in our treatment protocols.</p>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: "Ashwagandha", benefit: "Stress relief & vitality", emoji: "🌿", image: "/ashwagandha.png" },
            { name: "Turmeric", benefit: "Anti-inflammatory", emoji: "🟡", image: "/turmeric.png" },
            { name: "Tulsi", benefit: "Immunity booster", emoji: "🍃", image: "/tulsi.png" },
            { name: "Triphala", benefit: "Digestive health", emoji: "🫐", image: "/triphala.png" },
            { name: "Brahmi", benefit: "Brain & memory", emoji: "🧠", image: "/brahmi.png" },
          ].map((herb, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-forest/60 border border-white/5 rounded-3xl p-5 text-center hover:border-emerald-accent/30 transition-all hover:-translate-y-2 cursor-default group"
            >
              <div className="mb-4 relative rounded-2xl overflow-hidden aspect-square shadow-lg shadow-black/20">
                <img 
                  src={herb.image} 
                  alt={herb.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <h4 className="font-bold text-cream text-lg flex items-center justify-center gap-2">
                {herb.name} <span className="text-xl">{herb.emoji}</span>
              </h4>
              <p className="text-sm text-emerald-accent/70 mt-1">{herb.benefit}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24">
        <h2 className="text-4xl font-display font-bold text-center text-cream mb-4">What Our Users Say</h2>
        <p className="text-center text-emerald-accent/60 mb-16 max-w-xl mx-auto">Real stories from people who transformed their health with Ayurcare+.</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Meera K.", location: "Delhi", text: "The AI assistant diagnosed my digestive issues perfectly. The Ayurvedic diet plan worked wonders in just 2 weeks!", avatar: "M" },
            { name: "Rohit S.", location: "Mumbai", text: "Booking a consultation for ₹1 was unbelievable. Dr. Vikram Singh's rejuvenation therapy changed my life completely.", avatar: "R" },
            { name: "Anita P.", location: "Bangalore", text: "I love the BMI calculator with Dosha mapping. Finally an app that combines modern science with ancient wisdom!", avatar: "A" },
          ].map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-moss/30 border border-white/5 rounded-3xl p-8 relative"
            >
              <Quote className="text-emerald-accent/10 absolute top-6 right-6" size={40} />
              <p className="text-cream/80 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-accent/20 text-emerald-accent flex items-center justify-center font-bold text-sm">{t.avatar}</div>
                <div>
                  <p className="font-bold text-cream text-sm">{t.name}</p>
                  <p className="text-xs text-emerald-accent/50">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Medicines — Shop Promo */}
      <section className="px-6 py-24 bg-moss/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-accent/10 text-emerald-accent text-xs font-bold mb-4 border border-emerald-accent/20">
                <ShoppingBag size={14} /> New — Ayurvedic Shop
              </div>
              <h2 className="text-4xl font-display font-bold text-cream mb-2">Shop Trusted Medicines</h2>
              <p className="text-emerald-accent/60 max-w-lg">Handpicked Ayurvedic medicines from top Indian brands. Fast and trusted delivery.</p>
            </div>
            <Link to="/shop" className="mt-6 md:mt-0 text-emerald-accent font-bold text-sm hover:underline flex items-center gap-1">
              View All Medicines <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="p-4">
                  <p className="text-emerald-accent/50 text-[10px] font-semibold uppercase tracking-wider">{med.brand}</p>
                  <h4 className="text-cream font-bold text-sm mb-2">{med.name}</h4>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-display font-bold text-cream">₹{med.price}</span>
                    <span className="text-xs text-cream/30 line-through">₹{med.mrp}</span>
                    <span className="text-[10px] font-bold text-emerald-accent bg-emerald-accent/10 px-1.5 py-0.5 rounded-full">
                      {Math.round((1 - med.price / med.mrp) * 100)}% OFF
                    </span>
                  </div>
                  <a
                    href={med.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-accent text-forest font-bold text-xs hover:bg-emerald-accent/90 transition-all flex items-center justify-center gap-1.5"
                  >
                    Buy Now <ExternalLink size={13} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-moss/30 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-cream mb-4">Start Your Healing Journey Today</h2>
          <p className="text-emerald-accent/60 mb-10 text-lg">Join thousands who are balancing their doshas, tracking vitals, and consulting experts — all for free.</p>
          {user ? (
            <Link to="/doctors" className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all inline-flex items-center gap-3">
              Browse Doctors <ChevronRight />
            </Link>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              Sign Up with Google <ChevronRight />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
