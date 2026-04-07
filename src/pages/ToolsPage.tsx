import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Scale, Utensils, Activity, Sparkles, Brain,
  Target, MessageCircle, ArrowRight, ChevronRight,
  Camera, Stethoscope, LayoutDashboard, ShoppingBag,
  BookOpen, Zap, CheckCircle
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// ─── Indian Food Database ───
const indianFoods = [
  { name: "Dal Makhani (1 bowl)", cal: 300, protein: 12, type: "Heavy (Kapha increasing)" },
  { name: "Chapati (1 piece)", cal: 70, protein: 3, type: "Balanced (Tridoshic)" },
  { name: "Palak Paneer (1 bowl)", cal: 280, protein: 14, type: "Cooling (Pitta pacifying)" },
  { name: "Khichdi (1 bowl)", cal: 200, protein: 8, type: "Healing (Tridoshic)" },
  { name: "Rajma Chawal (1 plate)", cal: 420, protein: 15, type: "Heavy (Kapha increasing)" },
  { name: "Chole Bhature (1 plate)", cal: 550, protein: 12, type: "Heavy (Kapha & Pitta)" },
  { name: "Idli (2 pieces)", cal: 120, protein: 4, type: "Light (Vata pacifying)" },
  { name: "Dosa (1 plain)", cal: 130, protein: 4, type: "Light (Tridoshic)" },
  { name: "Masala Dosa (1 piece)", cal: 250, protein: 6, type: "Medium (Pitta increasing)" },
  { name: "Biryani Chicken (1 plate)", cal: 500, protein: 22, type: "Hot (Pitta increasing)" },
  { name: "Biryani Veg (1 plate)", cal: 380, protein: 10, type: "Medium (Tridoshic)" },
  { name: "Paneer Tikka (6 pieces)", cal: 320, protein: 18, type: "Heavy (Kapha increasing)" },
  { name: "Aloo Paratha (1 piece)", cal: 300, protein: 6, type: "Heavy (Kapha increasing)" },
  { name: "Poha (1 bowl)", cal: 180, protein: 4, type: "Light (Vata pacifying)" },
  { name: "Upma (1 bowl)", cal: 200, protein: 5, type: "Light (Tridoshic)" },
  { name: "Samosa (1 piece)", cal: 260, protein: 4, type: "Heavy (Kapha & Pitta)" },
  { name: "Pav Bhaji (1 plate)", cal: 400, protein: 10, type: "Medium (Pitta increasing)" },
  { name: "Vada Pav (1 piece)", cal: 290, protein: 5, type: "Heavy (Kapha increasing)" },
  { name: "Lassi Sweet (1 glass)", cal: 180, protein: 6, type: "Cooling (Pitta pacifying)" },
  { name: "Butter Chicken (1 bowl)", cal: 450, protein: 28, type: "Hot & Heavy (Pitta & Kapha)" },
  { name: "Roti (1 piece)", cal: 60, protein: 2, type: "Balanced (Tridoshic)" },
  { name: "Rice Steamed (1 bowl)", cal: 200, protein: 4, type: "Cooling (Pitta pacifying)" },
  { name: "Raita (1 bowl)", cal: 80, protein: 4, type: "Cooling (Pitta pacifying)" },
  { name: "Gulab Jamun (2 pieces)", cal: 300, protein: 3, type: "Sweet (Vata pacifying)" },
  { name: "Chai (1 cup)", cal: 80, protein: 2, type: "Warming (Vata pacifying)" },
  { name: "Green Tea (1 cup)", cal: 5, protein: 0, type: "Light (Tridoshic detox)" },
];

type ActiveTool = 'bmi' | 'heart' | 'calorie' | null;

export default function ToolsPage({ user }: { user: FirebaseUser | null }) {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const navigate = useNavigate();

  const tools = [
    {
      id: 'bmi' as ActiveTool,
      label: 'BMI & Prakriti',
      icon: Scale,
      color: '#34D399',
      glow: 'rgba(52,211,153,0.2)',
      desc: 'Calculate your BMI and discover your dominant Ayurvedic dosha',
      tag: 'Calculator',
    },
    {
      id: 'heart' as ActiveTool,
      label: 'Heart Monitor',
      icon: Heart,
      color: '#F87171',
      glow: 'rgba(248,113,113,0.2)',
      desc: 'Log and track your pulse rate with Ayurvedic dosha interpretation',
      tag: 'Tracker',
    },
    {
      id: 'calorie' as ActiveTool,
      label: 'Calorie Checker',
      icon: Utensils,
      color: '#FBBF24',
      glow: 'rgba(251,191,36,0.2)',
      desc: 'Browse 25+ Indian dishes with calories, protein & Ayurvedic properties',
      tag: 'Database',
    },
    {
      id: null,
      label: 'AI Health Coach',
      icon: Brain,
      color: '#A78BFA',
      glow: 'rgba(167,139,250,0.2)',
      desc: '13-section personalized wellness blueprint powered by AI',
      tag: 'AI',
      to: '/health-coach',
    },
    {
      id: null,
      label: 'AI Diagnosis',
      icon: Sparkles,
      color: '#10B981',
      glow: 'rgba(16,185,129,0.2)',
      desc: 'Instant symptom analysis with dosha mapping and remedy plan',
      tag: 'AI',
      to: '/diagnosis',
    },
    {
      id: null,
      label: 'AI Meal Analyser',
      icon: Camera,
      color: '#F97316',
      glow: 'rgba(249,115,22,0.2)',
      desc: 'Snap your meal and get instant nutritional + Ayurvedic analysis',
      tag: 'AI',
      to: '/meal-analysis',
    },
    {
      id: null,
      label: 'Consult Doctors',
      icon: Stethoscope,
      color: '#60A5FA',
      glow: 'rgba(96,165,250,0.2)',
      desc: 'Book a session with verified Ayurvedic physicians for just ₹1',
      tag: '₹1',
      to: '/doctors',
    },
    {
      id: null,
      label: 'Health Guides',
      icon: BookOpen,
      color: '#6B7280',
      glow: 'rgba(107,114,128,0.2)',
      desc: 'Explore Ayurvedic herbs, doshas, and wellness knowledge base',
      tag: 'Learn',
      to: '/guides',
    },
    {
      id: null,
      label: 'WhatsApp Connect',
      icon: MessageCircle,
      color: '#25D366',
      glow: 'rgba(37,211,102,0.2)',
      desc: 'Chat directly with AyurCare+ support on WhatsApp',
      tag: 'Support',
      to: null,
      action: () => window.open('https://wa.me/919475002048?text=Hello%20AyurCare%2B', '_blank', 'noopener,noreferrer'),
    },
  ] as const;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Transparent background — shows body bg */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-scroll" style={{ backgroundImage: "url('/bg-page-dash.png')" }}>
        <div className="absolute inset-0 page-bg-overlay" style={{ opacity: 0.55 }} />
      </div>

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[90px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }} />
      </div>

      <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-accent/25 bg-emerald-accent/10 text-emerald-accent text-[11px] font-bold uppercase tracking-widest mb-6">
            <Zap size={12} /> Wellness Hub
          </div>
          <h1 className="font-display font-bold text-cream mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.025em' }}>
            All Your Health Tools
          </h1>
          <p className="text-cream/40 text-base leading-relaxed">
            AI-powered diagnostics, traditional Ayurvedic calculators, and expert consultations — in one place.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {tools.map((tool, i) => {
            const isInline = tool.id !== null;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <button
                  onClick={() => {
                    if (isInline) {
                      setActiveTool(activeTool === tool.id ? null : tool.id);
                    } else if ('action' in tool && tool.action) {
                      (tool as any).action();
                    } else if ('to' in tool && tool.to) {
                      navigate(tool.to as string);
                    }
                  }}
                  className={`group w-full text-left relative p-5 rounded-3xl transition-all duration-400 overflow-hidden border ${
                    activeTool === tool.id && isInline
                      ? 'border-emerald-accent/40 scale-[0.98]'
                      : 'border-white/[0.07] hover:border-white/[0.15] hover:-translate-y-0.5'
                  }`}
                  style={{
                    background: activeTool === tool.id && isInline
                      ? `${tool.glow}`
                      : 'rgba(10,15,13,0.45)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Hover radial glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{ background: `radial-gradient(ellipse at 20% 20%, ${tool.glow} 0%, transparent 70%)` }} />

                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${tool.color}18`, border: `1px solid ${tool.color}30` }}>
                      <tool.icon size={20} style={{ color: tool.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-cream text-[15px] leading-none">{tool.label}</h3>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0"
                          style={{ background: `${tool.color}18`, color: tool.color }}>
                          {tool.tag}
                        </span>
                      </div>
                      <p className="text-cream/40 text-[12px] leading-relaxed">{tool.desc}</p>
                    </div>

                    <div className="flex-shrink-0 mt-1">
                      {isInline ? (
                        <motion.div
                          animate={{ rotate: activeTool === tool.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}>
                          <ChevronRight size={16} className="text-cream/30 group-hover:text-emerald-accent transition-colors" />
                        </motion.div>
                      ) : (
                        <ArrowRight size={16} className="text-cream/30 group-hover:text-emerald-accent transition-colors group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Inline Tool Panel */}
        <AnimatePresence>
          {activeTool && (
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-2xl mx-auto rounded-3xl p-7 md:p-10 border border-white/[0.08]"
              style={{
                background: 'rgba(10,15,13,0.60)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
              }}
            >
              {activeTool === 'bmi'     && <BMITool />}
              {activeTool === 'heart'   && <HeartTool user={user} />}
              {activeTool === 'calorie' && <CalorieTool />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// BMI TOOL
// ─────────────────────────────────────────
function BMITool() {
  const [weight, setWeight]   = useState('');
  const [height, setHeight]   = useState('');
  const [age, setAge]         = useState('');
  const [gender, setGender]   = useState('male');
  const [result, setResult]   = useState<any>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;
    const bmi = w / (h * h);
    let category = 'Underweight', dosha = 'Vata (Air & Space)',
        desc = 'Slender build. Focus on warming, grounding foods like ghee, soups, and cooked grains.',
        color = '#60A5FA';
    if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal'; dosha = 'Pitta (Fire & Water)'; color = '#34D399';
      desc = 'Well-proportioned build. Strong digestion. Focus on cooling foods like cucumber, coconut, and fresh dairy.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight'; dosha = 'Kapha (Earth & Water)'; color = '#FBBF24';
      desc = 'Solid build. Focus on light, stimulating foods and regular cardio exercise.';
    } else if (bmi >= 30) {
      category = 'Obese'; dosha = 'Kapha Dominant'; color = '#F87171';
      desc = 'Consider a personalized Panchakarma detox and Kapha-reducing diet with our doctors.';
    }
    setResult({ val: bmi.toFixed(1), category, dosha, desc, color });
  };

  const inputClass = "w-full p-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-cream placeholder-cream/30 focus:border-emerald-accent/50 focus:outline-none transition-colors";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-accent/15 border border-emerald-accent/30 flex items-center justify-center">
          <Scale size={20} className="text-emerald-accent" />
        </div>
        <div>
          <h2 className="font-display font-bold text-cream text-xl">BMI & Prakriti Calculator</h2>
          <p className="text-cream/40 text-xs">Discover your dominant dosha</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-accent/60 mb-1.5 block">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} placeholder="e.g. 70" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-accent/60 mb-1.5 block">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} className={inputClass} placeholder="e.g. 175" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-accent/60 mb-1.5 block">Age</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inputClass} placeholder="e.g. 25" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-accent/60 mb-1.5 block">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <button onClick={calculateBMI}
        className="w-full py-4 rounded-2xl bg-emerald-accent text-forest font-bold text-sm hover:bg-emerald-accent/90 transition-all shadow-lg shadow-emerald-accent/20 flex items-center justify-center gap-2">
        Calculate BMI & Dosha <Sparkles size={16} />
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl border"
            style={{ background: `${result.color}10`, borderColor: `${result.color}30` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-display font-bold text-cream text-5xl">{result.val}</p>
                <p className="font-bold text-sm mt-1" style={{ color: result.color }}>{result.category}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-cream/40 mb-1">Dominant Dosha</p>
                <p className="font-bold text-base" style={{ color: result.color }}>{result.dosha}</p>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed">{result.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// HEART TOOL
// ─────────────────────────────────────────
function HeartTool({ user }: { user: FirebaseUser | null }) {
  const [heartRate, setHeartRate] = useState('');
  const [saved, setSaved]         = useState(false);

  const handleLog = async () => {
    if (!heartRate || !user) { if (!user) alert('Please log in to save heart rate logs.'); return; }
    try {
      const rate = Number(heartRate);
      await addDoc(collection(db, 'heart_logs'), {
        userId: user.uid, heartRate: rate,
        status: rate < 60 ? 'low' : rate > 100 ? 'high' : 'normal',
        timestamp: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setHeartRate('');
    } catch (err) { console.error(err); }
  };

  const rate = Number(heartRate);
  const advice = !rate ? null
    : rate < 60  ? { msg: 'Low pulse (Bradycardia). May indicate Kapha imbalance. Try warming herbs like ginger.', color: '#60A5FA' }
    : rate > 100 ? { msg: 'Elevated HR (Tachycardia). May indicate Pitta imbalance. Try cooling pranayama and brahmi tea.', color: '#F87171' }
    : { msg: 'Heart rate is in the normal range. Doshas appear balanced. Keep up your routine!', color: '#34D399' };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-rose-400/15 border border-rose-400/30 flex items-center justify-center">
          <Heart size={20} className="text-rose-400" />
        </div>
        <div>
          <h2 className="font-display font-bold text-cream text-xl">Heart Rate Monitor</h2>
          <p className="text-cream/40 text-xs">Track your pulse & dosha balance</p>
        </div>
      </div>

      <div className="relative mb-5">
        <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)}
          placeholder="0" maxLength={3}
          className="w-full text-center font-display font-bold text-cream py-8 rounded-3xl border border-white/[0.08] bg-white/[0.04] focus:border-rose-400/40 focus:outline-none transition-colors"
          style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', letterSpacing: '-0.05em' }} />
        <span className="absolute bottom-5 right-8 text-cream/20 font-bold text-sm tracking-widest">BPM</span>
      </div>

      <AnimatePresence>
        {advice && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 rounded-2xl border text-sm leading-relaxed"
            style={{ background: `${advice.color}10`, borderColor: `${advice.color}25`, color: `${advice.color}` }}>
            💡 {advice.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={handleLog}
        className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Heart size={16} /> Save & Log</>}
      </button>
      <p className="text-center text-[11px] text-cream/30 mt-3">View your full history in the Dashboard</p>
    </div>
  );
}

// ─────────────────────────────────────────
// CALORIE TOOL
// ─────────────────────────────────────────
function CalorieTool() {
  const [query, setQuery] = useState('');

  const filtered = !query.trim()
    ? indianFoods.slice(0, 8)
    : indianFoods.filter(f =>
        query.toLowerCase().split(/\s+/).some(w => f.name.toLowerCase().includes(w) || f.type.toLowerCase().includes(w))
      );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
          <Utensils size={20} className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-display font-bold text-cream text-xl">Indian Food Calorie DB</h2>
          <p className="text-cream/40 text-xs">25+ dishes with Ayurvedic properties</p>
        </div>
      </div>

      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search... Dal, Biryani, Pitta, Sweet..."
        className="w-full p-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-cream placeholder-cream/30 focus:border-amber-400/40 focus:outline-none transition-colors mb-4" />

      {/* Quick tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {['Dal', 'Biryani', 'Roti', 'Paneer', 'Dosa', 'Chai', 'Pitta'].map(tag => (
          <button key={tag} onClick={() => setQuery(tag)}
            className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
            style={query === tag
              ? { background: 'rgba(251,191,36,0.2)', borderColor: 'rgba(251,191,36,0.4)', color: '#FBBF24' }
              : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(248,250,252,0.5)' }
            }>
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
        {filtered.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:border-amber-400/20 transition-colors">
            <div>
              <p className="font-bold text-cream text-sm">{f.name}</p>
              <p className="text-[11px] text-amber-400/70 mt-0.5">{f.type}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="font-display font-bold text-cream text-xl">{f.cal}</p>
              <p className="text-[10px] text-cream/30 uppercase tracking-wider">kcal · {f.protein}g</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
