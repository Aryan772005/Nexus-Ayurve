import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Wind, Droplets, Flame, Moon, Cookie, TrendingDown, TrendingUp, Utensils, Leaf, Activity, Ribbon, Heart, Coffee, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const TOPIC_CARDS = [
  {
    id: 'weight',
    title: 'Weight Management',
    subtitle: 'Lose, Gain, or Maintain',
    icon: Scale,
    colorClasses: {
      icon: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
      tag: 'text-emerald-400/80 bg-forest/60 border-emerald-400/15',
      badge: 'text-emerald-400 bg-forest/80 border-emerald-400/20',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-forest shadow-emerald-500/25',
      gradient: 'from-forest/95 via-forest/60 to-transparent',
    },
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80',
    imageAlt: 'Ayurvedic approach to weight and body transformation',
    badge: 'Kapha Pacifying',
    desc: 'Triphala, Guggulu, specific pranayama, and dosha-balancing diets. Whether you want to lose fat, build healthy mass, or reduce calories — here is your roadmap.',
    tags: ['Fat Loss', 'Healthy Gain', 'Metabolism', 'Kapha Diet'],
  },
  {
    id: 'immunity',
    title: 'Boost Immunity',
    subtitle: 'Build Ojas & Resilience',
    icon: Leaf,
    colorClasses: {
      icon: 'bg-purple-400/20 border-purple-400/30 text-purple-400',
      tag: 'text-purple-400/80 bg-forest/60 border-purple-400/15',
      badge: 'text-purple-400 bg-forest/80 border-purple-400/20',
      btn: 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/25',
      gradient: 'from-forest/95 via-forest/60 to-transparent',
    },
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&q=80',
    imageAlt: 'Ayurvedic herbs for immunity',
    badge: 'Ojas Enhancing',
    desc: 'Chyawanprash, Giloy, Golden Milk, and Sattvic living — discover how to strengthen your Ojas (vital immunity) and become naturally resistant to illness.',
    tags: ['Chyawanprash', 'Giloy', 'Golden Milk', 'Immunity'],
  },
  {
    id: 'liver',
    title: 'Liver Care',
    subtitle: 'Detox & Hepatoprotection',
    icon: Activity,
    colorClasses: {
      icon: 'bg-teal-500/20 border-teal-500/30 text-teal-400',
      tag: 'text-teal-400/80 bg-forest/60 border-teal-400/15',
      badge: 'text-teal-400 bg-forest/80 border-teal-400/20',
      btn: 'bg-teal-500 hover:bg-teal-400 text-forest shadow-teal-500/25',
      gradient: 'from-forest/95 via-forest/60 to-transparent',
    },
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80',
    imageAlt: 'Ayurvedic herbs and supplements for liver health',
    badge: 'Pitta Dominant',
    desc: 'Kutki, Bhumi Amla, and Aloe Vera juice — powerful Ayurvedic remedies to protect the liver, stimulate bile secretion, and support deep natural detoxification.',
    tags: ['Liver Detox', 'Kutki', 'Pitta Balance', 'Cleanse'],
  },
  {
    id: 'sexual-wellness',
    title: 'Sexual Wellness',
    subtitle: 'Vajikarana & Vitality',
    icon: Heart,
    colorClasses: {
      icon: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
      tag: 'text-rose-400/80 bg-forest/60 border-rose-400/15',
      badge: 'text-rose-400 bg-forest/80 border-rose-400/20',
      btn: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25',
      gradient: 'from-forest/95 via-forest/60 to-transparent',
    },
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=80',
    imageAlt: 'Ayurvedic herbs for vitality and reproductive wellness',
    badge: 'Shukra Dhatu Focus',
    desc: 'Shilajit, Safed Musli, Shatavari, and Ashwagandha — the ancient Vajikarana branch of Ayurveda for sexual health, stamina, and reproductive vitality.',
    tags: ['Shilajit', 'Shatavari', 'Vitality', 'Hormones'],
  },
  {
    id: 'hangover',
    title: 'Hangover Fix',
    subtitle: 'Ayurvedic Rapid Recovery',
    icon: Coffee,
    colorClasses: {
      icon: 'bg-amber-400/20 border-amber-400/30 text-amber-400',
      tag: 'text-amber-400/80 bg-forest/60 border-amber-400/15',
      badge: 'text-amber-400 bg-forest/80 border-amber-400/20',
      btn: 'bg-amber-400 hover:bg-amber-300 text-forest shadow-amber-400/25',
      gradient: 'from-forest/95 via-forest/60 to-transparent',
    },
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=700&q=80',
    imageAlt: 'Coconut water and herbal tea for hangover recovery',
    badge: 'Pitta & Vata Pacifying',
    desc: 'Coconut water, CCF tea, grape juice, and Aloe Vera — fast-acting Ayurvedic remedies to flush toxins, rehydrate the body, and restore your Agni after alcohol.',
    tags: ['Detox', 'Coconut Water', 'CCF Tea', 'Recovery'],
  },
  {
    id: 'cancer',
    title: 'Cellular Health',
    subtitle: 'Holistic Cancer Support',
    icon: Ribbon,
    colorClasses: {
      icon: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
      tag: 'text-violet-400/80 bg-forest/60 border-violet-400/15',
      badge: 'text-violet-400 bg-forest/80 border-violet-400/20',
      btn: 'bg-violet-500 hover:bg-violet-400 text-white shadow-violet-500/25',
      gradient: 'from-forest/95 via-forest/60 to-transparent',
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=80',
    imageAlt: 'Turmeric and Ayurvedic supplements for cellular health',
    badge: 'Tridoshic Focus',
    desc: 'Ashwagandha, Turmeric (Curcumin), Tulsi, and Panchakarma — complementary Ayurvedic holistic support for cellular health and immunity, alongside medical care.',
    tags: ['Turmeric', 'Ashwagandha', 'Ojas', 'Immunity'],
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen pt-48 px-6 pb-20 max-w-7xl mx-auto">
      <div className="fixed inset-0 -z-10" style={{backgroundImage: "url('/bg-page-shop.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(10,8,5,0.93) 0%, rgba(20,12,3,0.90) 100%)'}} />
      </div>

      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Ayurvedic Wisdom</h1>
        <p className="text-emerald-accent/60 text-lg">Ancient guides for modern living — dosha balancing, natural weight management, and holistic healing.</p>
      </header>

      {/* ── All Topic Guides ── */}
      <div className="relative mb-10 mt-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
        <div className="relative flex justify-center">
          <span className="bg-forest px-6 py-2 text-xs uppercase tracking-[0.2em] font-bold text-emerald-accent/50 rounded-full border border-white/5">Deep Dive Guides</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-display font-bold text-cream mb-3">
          All Wellness Guides
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="text-emerald-accent/60 text-lg max-w-xl mx-auto">
          Step-by-step Ayurvedic protocols — pick a goal and dive deep
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {TOPIC_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-[28px] overflow-hidden border border-white/5 shadow-xl group bg-moss/20 flex flex-col"
            >
              <div className="relative h-44 w-full overflow-hidden shrink-0">
                <img src={card.image} alt={card.imageAlt} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.colorClasses.gradient}`} />
                <span className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-widest backdrop-blur-sm px-2.5 py-1 rounded-full border ${card.colorClasses.badge}`}>{card.badge}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${card.colorClasses.icon}`}><Icon size={17} /></div>
                  <div>
                    <h3 className="text-base font-display font-bold text-cream leading-tight">{card.title}</h3>
                    <p className="text-xs text-cream/40">{card.subtitle}</p>
                  </div>
                </div>
                <p className="text-cream/60 text-xs leading-relaxed mb-4 flex-1">{card.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border ${card.colorClasses.tag}`}>{tag}</span>
                  ))}
                </div>
                <Link to={`/topic/${card.id}`} className={`inline-flex items-center gap-1.5 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 self-start text-xs ${card.colorClasses.btn}`}>
                  <Icon size={13} /> Read Guide
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Weight Tips */}
      <div className="bg-moss/30 border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl mb-20">
        <h2 className="text-3xl font-display font-bold text-cream mb-6 flex items-center gap-3"><Flame className="text-orange-400" /> Ayurvedic Weight Loss Quick Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Morning Routine</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>☀️ Wake up before 6 AM (Brahma Muhurta)</li>
              <li>🍵 Drink warm water with lemon &amp; honey on an empty stomach</li>
              <li>🧘 Practice 15 min of Surya Namaskar (Sun Salutation)</li>
              <li>🌿 Take 1 tsp Triphala powder before breakfast</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Diet Tips</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>🍽️ Eat largest meal at lunch when Agni is strongest</li>
              <li>🚫 Avoid eating after 7 PM to allow proper digestion</li>
              <li>🫚 Add ginger, cumin, and turmeric to every meal</li>
              <li>💧 Drink warm water throughout the day</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Exercise</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>🏃 30 min brisk walk daily after dinner</li>
              <li>🧘 Kapalbhati Pranayama (10 min) to boost metabolism</li>
              <li>💪 Strength training 3x per week</li>
              <li>🛌 Get 7–8 hours of quality sleep</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Herbal Remedies</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>🌿 Triphala: Natural detox and weight management</li>
              <li>🫚 Guggulu: Boosts thyroid and fat metabolism</li>
              <li>🍃 Garcinia Cambogia: Controls appetite naturally</li>
              <li>🫖 Green tea with Tulsi: Antioxidant fat burner</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Essential Health Guides */}
      <h2 className="text-3xl font-display font-bold text-center text-cream mb-8">Essential Health Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {[
          { title: "Dinacharya", subtitle: "Daily Routine", icon: <Sun />, desc: "The perfect Ayurvedic morning-to-night routine: oil pulling, tongue scraping, self-massage (Abhyanga), and meditation." },
          { title: "Ritucharya", subtitle: "Seasonal Living", icon: <Moon />, desc: "Adapt your diet and lifestyle with each season to maintain dosha balance and prevent seasonal illnesses." },
          { title: "Agni & Digestion", subtitle: "Digestive Fire", icon: <Flame />, desc: "Strengthen Agni with ginger, cumin and fennel teas. Avoid incompatible food combinations (Viruddha Ahara)." },
          { title: "Panchakarma", subtitle: "Detox Therapy", icon: <Droplets />, desc: "The 5-step Ayurvedic detoxification process: Vamana, Virechana, Basti, Nasya, and Raktamokshana." },
          { title: "Yoga & Pranayama", subtitle: "Breath & Movement", icon: <Wind />, desc: "Specific asanas and breathing techniques for each dosha type to balance energy and improve flexibility." },
          { title: "Sattvic Diet", subtitle: "Pure Eating", icon: <Cookie />, desc: "Embrace whole, fresh, and natural foods. Reduce Rajasic (stimulating) and Tamasic (dulling) foods for mental clarity." },
        ].map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-forest/50 border border-white/5 p-8 rounded-3xl hover:-translate-y-2 transition-transform cursor-default group"
          >
            <div className="text-emerald-accent mb-2 bg-emerald-accent/10 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{g.icon}</div>
            <h3 className="font-bold text-xl text-cream mb-1 group-hover:text-emerald-accent transition-colors">{g.title}</h3>
            <p className="text-xs text-emerald-accent font-bold mb-3">{g.subtitle}</p>
            <p className="text-sm text-emerald-accent/60 leading-relaxed">{g.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Dosha Guides */}
      <div className="relative mb-10 mt-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
        <div className="relative flex justify-center">
          <span className="bg-forest px-6 py-2 text-xs uppercase tracking-[0.2em] font-bold text-emerald-accent/50 rounded-full border border-white/5">Foundations</span>
        </div>
      </div>

      <h2 className="text-3xl md:text-5xl font-display font-bold text-cream mb-8 text-center">Know Your Dosha</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-moss/20 border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <Wind className="absolute -right-6 -top-6 w-32 h-32 text-blue-400/5" />
          <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-4"><Wind className="text-blue-400" /></div>
          <h3 className="text-2xl font-display font-bold text-cream mb-2">Vata</h3>
          <p className="text-xs text-blue-400 font-bold mb-4">Air &amp; Space Element</p>
          <ul className="space-y-3 text-cream/70 text-sm">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Favor warm, cooked, grounding foods — root vegetables, soups, ghee</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Avoid cold, raw salads and iced drinks</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Practice restorative Yoga and meditation</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Key herbs: Ashwagandha, Shatavari, Bala</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Maintain a regular sleep schedule</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-moss/20 border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <Sun className="absolute -right-6 -top-6 w-32 h-32 text-rose-400/5" />
          <div className="w-12 h-12 bg-rose-400/10 rounded-2xl flex items-center justify-center mb-4"><Sun className="text-rose-400" /></div>
          <h3 className="text-2xl font-display font-bold text-cream mb-2">Pitta</h3>
          <p className="text-xs text-rose-400 font-bold mb-4">Fire &amp; Water Element</p>
          <ul className="space-y-3 text-cream/70 text-sm">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Favor cooling, sweet, and bitter foods — cucumber, mint, coconut water</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Avoid spicy, sour, and fermented foods</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Swimming and moderate exercise in cool environments</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Key herbs: Brahmi, Amalaki, Neem</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Practice Shitali pranayama (cooling breath)</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-moss/20 border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <Droplets className="absolute -right-6 -top-6 w-32 h-32 text-emerald-accent/5" />
          <div className="w-12 h-12 bg-emerald-accent/10 rounded-2xl flex items-center justify-center mb-4"><Droplets className="text-emerald-accent" /></div>
          <h3 className="text-2xl font-display font-bold text-cream mb-2">Kapha</h3>
          <p className="text-xs text-emerald-accent font-bold mb-4">Earth &amp; Water Element</p>
          <ul className="space-y-3 text-cream/70 text-sm">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Favor light, warm, stimulating foods — ginger, pepper, leafy greens</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Avoid heavy, oily, and sweet foods</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Engage in vigorous exercise — running, cycling</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Key herbs: Trikatu, Guggulu, Punarnava</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Wake before sunrise for optimal energy</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

