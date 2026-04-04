import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Scale, Utensils, Activity } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Expanded Indian Food Database
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
  { name: "Jalebi (3 pieces)", cal: 350, protein: 2, type: "Sweet & Hot (Kapha increasing)" },
  { name: "Chai (1 cup)", cal: 80, protein: 2, type: "Warming (Vata pacifying)" },
  { name: "Green Tea (1 cup)", cal: 5, protein: 0, type: "Light (Tridoshic detox)" },
  { name: "Kadhi Pakora (1 bowl)", cal: 250, protein: 8, type: "Medium (Pitta pacifying)" },
  { name: "Methi Thepla (2 pieces)", cal: 200, protein: 6, type: "Light (Tridoshic)" },
  { name: "Dhokla (4 pieces)", cal: 160, protein: 6, type: "Light (Tridoshic)" },
];

export default function ToolsPage({ user }: { user: FirebaseUser | null }) {
  const [activeTool, setActiveTool] = useState<'bmi' | 'calorie' | 'heart'>('bmi');

  return (
    <div className="min-h-screen pt-48 px-6 pb-20 max-w-7xl mx-auto">
      <div className="fixed inset-0 -z-10" style={{backgroundImage: "url('/bg-page-dash.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(10,15,13,0.93) 0%, rgba(3,20,12,0.90) 100%)'}} />
      </div>
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Wellness Tools</h1>
        <p className="text-emerald-accent/60 text-lg">Measure and monitor your doshas with our interactive calculators.</p>
      </header>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <ToolTab active={activeTool === 'bmi'} onClick={() => setActiveTool('bmi')} icon={<Scale />} label="BMI & Prakriti" />
        <ToolTab active={activeTool === 'calorie'} onClick={() => setActiveTool('calorie')} icon={<Utensils />} label="Calorie Check" />
        <ToolTab active={activeTool === 'heart'} onClick={() => setActiveTool('heart')} icon={<Heart />} label="Heart Monitor" />
      </div>

      <motion.div 
        key={activeTool}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-moss/20 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl"
      >
        {activeTool === 'bmi' && <BMITool />}
        {activeTool === 'calorie' && <CalorieTool />}
        {activeTool === 'heart' && <HeartTool user={user} />}
      </motion.div>
    </div>
  );
}

function ToolTab({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
        active 
          ? 'bg-emerald-accent text-forest shadow-lg shadow-emerald-accent/20' 
          : 'bg-forest border border-white/10 text-emerald-accent/60 hover:text-emerald-accent hover:border-emerald-accent/30'
      }`}
    >
      {React.cloneElement(icon, { size: 18 })} {label}
    </button>
  );
}

function BMITool() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<any>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;
    const bmi = w / (h * h);
    
    let category = "Underweight";
    let dosha = "Vata (Air & Space)";
    let desc = "Slender build. You may experience dry skin and cold hands. Focus on warming, grounding foods like ghee, soups, and cooked grains.";
    let color = "text-blue-400";
    
    if (bmi >= 18.5 && bmi < 25) {
      category = "Normal";
      dosha = "Pitta (Fire & Water)";
      desc = "Medium, well-proportioned build. Strong digestion and metabolism. Focus on cooling, refreshing foods like cucumber, coconut, and fresh dairy.";
      color = "text-emerald-accent";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      dosha = "Kapha (Earth & Water)";
      desc = "Solid, sturdy build. Strong endurance but may have sluggish digestion. Focus on light, stimulating foods and regular exercise.";
      color = "text-yellow-400";
    } else if (bmi >= 30) {
      category = "Obese";
      dosha = "Kapha Dominant (Earth & Water)";
      desc = "Heavy build. Consider consulting our doctors for a personalized Panchakarma detox and a Kapha-reducing diet plan.";
      color = "text-rose-400";
    }

    setResult({ val: bmi.toFixed(1), category, dosha, desc, color });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-cream font-bold">Ayurvedic BMI & Prakriti Calculator</h2>
      <p className="text-emerald-accent/60 text-sm mb-6">Discover your dominant dosha and get personalized wellness advice.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Weight (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent outline-none" placeholder="e.g. 70" />
        </div>
        <div>
          <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Height (cm)</label>
          <input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent outline-none" placeholder="e.g. 175" />
        </div>
        <div>
          <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Age</label>
          <input type="number" value={age} onChange={e=>setAge(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent outline-none" placeholder="e.g. 25" />
        </div>
        <div>
          <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Gender</label>
          <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent outline-none">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      
      <button onClick={calculateBMI} className="w-full bg-emerald-accent text-forest py-4 rounded-2xl font-bold mt-4 hover:bg-emerald-accent/90 transition-colors">Calculate BMI & Dosha</button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-8 bg-emerald-accent/5 border border-emerald-accent/20 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-5xl font-display font-bold text-cream">{result.val}</p>
              <p className={`text-sm font-bold mt-1 ${result.color}`}>{result.category}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-accent/50 uppercase tracking-widest">Likely Dosha</p>
              <p className="text-lg font-bold text-emerald-accent">{result.dosha}</p>
            </div>
          </div>
          <p className="text-sm text-cream/70 leading-relaxed">{result.desc}</p>
        </motion.div>
      )}
    </div>
  );
}

function CalorieTool() {
  const [food, setFood] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Live filter: split search into words, match ANY word against food name
  const getFilteredFoods = () => {
    if (!food.trim()) return showAll ? indianFoods : [];
    const words = food.toLowerCase().split(/\s+/);
    return indianFoods.filter(item => {
      const name = item.name.toLowerCase();
      const type = item.type.toLowerCase();
      return words.some(w => name.includes(w) || type.includes(w));
    });
  };

  const filtered = getFilteredFoods();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-cream font-bold">Indian Food Calorie Checker</h2>
      <p className="text-emerald-accent/60 text-sm mb-6">Search 30+ Indian dishes to check calories, protein, and Ayurvedic properties.</p>
      
      <div>
        <input type="text" value={food} onChange={e => setFood(e.target.value)} className="w-full p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent outline-none" placeholder="Start typing... e.g. Dal, Chicken, Sweet, Pitta..." />
      </div>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-emerald-accent/40">Quick:</span>
        {["Dal", "Biryani", "Roti", "Chai", "Paneer", "Samosa", "Dosa", "Rice"].map(tag => (
          <button key={tag} onClick={() => setFood(tag)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${food === tag ? 'bg-emerald-accent text-forest border-emerald-accent' : 'bg-forest/50 border-white/5 text-emerald-accent/60 hover:text-emerald-accent hover:border-emerald-accent/30'}`}>{tag}</button>
        ))}
        <button onClick={() => { setFood(''); setShowAll(!showAll); }} className="text-xs px-3 py-1 bg-forest/50 border border-white/5 rounded-full text-emerald-accent/60 hover:text-emerald-accent hover:border-emerald-accent/30 transition-colors">
          {showAll ? 'Hide All' : 'Show All'}
        </button>
      </div>

      {filtered.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
          <p className="text-xs text-emerald-accent/40">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</p>
          {filtered.map((r, i) => (
            <div key={i} className="p-4 bg-forest/40 border border-white/5 rounded-2xl flex justify-between items-center hover:border-emerald-accent/20 transition-colors">
              <div>
                <p className="font-bold text-cream">{r.name}</p>
                <p className="text-xs text-emerald-accent/50 mt-1">{r.type}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-2xl font-display font-bold text-cream">{r.cal}</p>
                <p className="text-[10px] text-emerald-accent/40 uppercase tracking-widest">kcal ・ {r.protein}g protein</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {food.trim() && filtered.length === 0 && (
        <div className="text-center py-10 text-emerald-accent/40">No results found for "{food}". Try a different keyword.</div>
      )}
    </div>
  );
}

function HeartTool({ user }: { user: FirebaseUser | null }) {
  const [heartRate, setHeartRate] = useState('');
  const [saved, setSaved] = useState(false);

  const handleLogHeartRate = async () => {
    if (!heartRate || !user) {
      if(!user) alert("Please log in to save heart rate logs.");
      return;
    }
    try {
      const rate = Number(heartRate);
      let status = 'normal';
      if (rate < 60) status = 'low';
      if (rate > 100) status = 'high';

      await addDoc(collection(db, 'heart_logs'), {
        userId: user.uid,
        heartRate: rate,
        status,
        timestamp: new Date().toISOString()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setHeartRate('');
    } catch (err) {
      console.error("Heart rate logging failed:", err);
    }
  };

  const getHeartAdvice = (rate: number) => {
    if (!rate) return "";
    if (rate < 60) return "Low pulse (Bradycardia). This may indicate Kapha imbalance. Consider warming herbs like ginger and ashwagandha.";
    if (rate > 100) return "Elevated heart rate (Tachycardia). This may indicate Pitta imbalance. Try cooling pranayama and brahmi tea.";
    return "Your heart rate is in the normal range. Your doshas appear balanced. Keep up your routine!";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-cream font-bold">Heart Rate Monitor</h2>
      <p className="text-emerald-accent/60 text-sm mb-6">Track your pulse to understand your Vata, Pitta, and Kapha balance.</p>
      
      <div className="relative mb-6">
        <input 
          type="number" 
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="BPM"
          className="w-full text-6xl font-serif text-center py-10 bg-forest/40 rounded-3xl border border-white/5 focus:border-emerald-accent/50 text-cream outline-none"
        />
        <span className="absolute bottom-4 right-8 text-emerald-accent/20 font-bold">BPM</span>
      </div>

      {heartRate && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-cream/70 bg-forest/50 p-4 rounded-2xl border border-white/5">
          💡 {getHeartAdvice(Number(heartRate))}
        </motion.p>
      )}

      <button onClick={handleLogHeartRate} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all">Save & Log</button>

      {saved && <p className="text-center text-emerald-accent text-sm font-bold mt-4">✅ Saved successfully!</p>}
      <p className="text-center text-xs text-emerald-accent/40 mt-4">View your full history in the Dashboard.</p>
    </div>
  );
}
