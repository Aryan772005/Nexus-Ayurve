import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Zap, Activity, Shield,
  ArrowRight, Apple, Heart, Stethoscope, Droplets, Info, AlertTriangle,
  Flame, ShieldAlert, Utensils, Smile, CheckCircle
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

export default function HealthCoachPage({ user }: { user: FirebaseUser | null }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };
  
  // Form State
  const [formData, setFormData] = useState({
    age: '25',
    gender: 'Male',
    height: '175',
    weight: '70',
    goal: 'Maintenance',
    activityLevel: 'Medium',
    foodPreference: 'Veg',
    conditions: 'None',
    bpm: '72',
    caloriesToday: '1200',
    skinType: 'Combination',
    hairCondition: 'Normal' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);

    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocal ? 'http://localhost:3000/api/health-coach' : '/api/health-coach';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If not JSON, it might be a Vercel/Server error HTML
        if (text.includes('A server error occurred')) {
          throw new Error('AI Engine Timeout (Vercel 10s limit). Please try with a shorter goal or wait a moment.');
        }
        throw new Error(`Invalid server response: ${text.substring(0, 50)}...`);
      }

      if (res.ok) {
        setReport(data);
      } else {
        let errorMsg = data.error || 'Unknown error';
        if (data.error === 'AI response parsing failed' && data.raw) {
          errorMsg += `: ${data.raw.substring(0, 300)}...`;
        }
        setReport({ error: `Error connecting to AI Neural Core: ${errorMsg}` });
      }
    } catch (err: any) {
      setReport({ error: `Neural network analysis failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen pt-24 pb-20 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full filter blur-[120px] opacity-[0.05] pointer-events-none bg-emerald-accent" />
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full filter blur-[90px] opacity-[0.08] pointer-events-none bg-blue-500" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block w-20 h-20 rounded-full bg-gradient-to-br from-emerald-accent/20 to-transparent border border-emerald-accent/30 flex items-center justify-center mb-6 mx-auto">
            <Brain size={40} className="text-emerald-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
            AI Holistic Health Coach
          </h1>
          <p className="text-emerald-accent/60 max-w-2xl mx-auto">
            Input your biological metrics & lifestyle data. Our neural network will generate a highly personalized, Indian-context wellness blueprint.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE: Input Form */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="bg-moss/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              
              <h2 className="text-xl font-display font-bold text-cream mb-6 flex items-center gap-2">
                <Target size={20} className="text-emerald-accent" /> Parameters
              </h2>
              
              <form onSubmit={handleAnalyze} className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none appearance-none transition-colors">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Height (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Weight (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Current Goal</label>
                  <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none appearance-none transition-colors">
                    <option>Weight Loss</option><option>Maintenance</option><option>Muscle Gain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Activity Level</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none appearance-none transition-colors">
                    <option>Low (Sedentary)</option><option>Medium (Active)</option><option>High (Athlete)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Food Preference</label>
                  <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none appearance-none transition-colors">
                    <option>Veg (Budget-friendly)</option><option>Non-Veg</option><option>Vegan</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Avg BPM</label>
                    <input type="number" name="bpm" value={formData.bpm} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors" />
                  </div>
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Calories Today</label>
                    <input type="number" name="caloriesToday" value={formData.caloriesToday} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Food Items Consumed</label>
                    <textarea 
                      name="foodList" 
                      value={(formData as any).foodList || ''} 
                      onChange={handleChange} 
                      placeholder="e.g. 2 Roti, Dal, 1 Cup Curd..."
                      className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors h-20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">BPM History (Trends)</label>
                    <textarea 
                      name="bpmArray" 
                      value={(formData as any).bpmArray || '72, 75, 71, 73, 70'} 
                      onChange={handleChange} 
                      placeholder="Comma separated: 70, 72, 75..."
                      className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none transition-colors h-20 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Skin Type</label>
                    <select name="skinType" value={formData.skinType} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none appearance-none transition-colors">
                      <option>Oily</option><option>Dry</option><option>Combination</option><option>Sensitive</option>
                    </select>
                  </div>
                   <div>
                    <label className="block text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Hair Issue</label>
                    <select name="hairCondition" value={formData.hairCondition} onChange={handleChange} className="w-full bg-forest/50 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-emerald-accent outline-none appearance-none transition-colors">
                      <option>Normal</option><option>Hairfall</option><option>Dandruff</option><option>Dryness</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-emerald-accent/20 text-emerald-accent/50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-accent to-teal-400 text-forest hover:opacity-90 shadow-lg hover:shadow-emerald-accent/20'}`}>
                    {loading ? (
                       <><div className="w-5 h-5 border-2 border-emerald-accent border-t-transparent rounded-full animate-spin" /> Neural Sync...</>
                    ) : (
                       <><Brain size={20} /> Generate AI Blueprint</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Output Dashboard */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-8">
            <div className="bg-moss/20 backdrop-blur-md border border-white/5 rounded-[32px] p-6 shadow-2xl relative min-h-[850px] flex flex-col">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="w-32 h-32 rounded-full border border-emerald-accent/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-2 border-emerald-accent border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-4 border border-amber-500/50 border-b-transparent rounded-full animate-spin direction-reverse" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
                        <Activity size={32} className="text-emerald-accent animate-pulse" />
                     </div>
                     <h3 className="text-xl font-display font-bold text-cream mt-8 mb-2">Analyzing Biomarkers</h3>
                     <p className="text-emerald-accent/60 text-sm max-w-xs text-center">Processing doshas, macronutrients, and metabolic indicators...</p>
                  </motion.div>
                ) : report ? (
                  report.error ? (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                      <ShieldAlert size={48} className="text-red-400 mb-4" />
                      <h3 className="text-xl font-bold text-red-400 mb-2">System Error</h3>
                      <p className="text-cream/70">{report.error}</p>
                    </motion.div>
                  ) : (
                    <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full overflow-y-auto pr-4 custom-scrollbar flex-grow space-y-6">
                      
                      {/* Header Section */}
                      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/5 rounded-2xl p-6 border border-emerald-accent/20">
                        <div>
                          <h2 className="text-2xl font-display font-bold text-cream flex items-center gap-2">
                              Optimal Wellness Blueprint
                          </h2>
                          <p className="text-emerald-accent/70 mt-1">Personalized holistic analysis powered by Ayurvedic Intelligence.</p>
                        </div>
                      </div>

                      {/* Health & Alerts Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-forest/50 p-6 rounded-2xl border border-white/5">
                          <h3 className="text-lg font-bold text-emerald-accent flex items-center gap-2 mb-3">
                            <Activity size={18} /> Health Analysis
                          </h3>
                          <p className="text-cream/80 text-sm leading-relaxed">{report.healthAnalysis}</p>
                        </div>
                        {report.alerts && report.alerts.length > 0 && (
                          <div className="bg-red-900/20 p-6 rounded-2xl border border-red-500/20">
                            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-3">
                              <AlertTriangle size={18} /> Risk Alerts
                            </h3>
                            <ul className="space-y-2">
                              {report.alerts.map((a: string, i: number) => (
                                <li key={i} className="text-cream/80 text-sm flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Nutrition Matrix */}
                      <div className="bg-moss/40 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-emerald-accent flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                          <Flame size={20} /> Nutrition Matrix
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-forest/50 rounded-xl p-4 text-center border border-emerald-accent/10">
                            <p className="text-emerald-accent/60 text-xs font-bold uppercase tracking-wider mb-1">Calories</p>
                            <p className="text-2xl font-bold text-cream">{report.calories?.required}</p>
                          </div>
                          <div className="bg-forest/50 rounded-xl p-4 text-center border border-amber-500/20">
                            <p className="text-amber-500/60 text-xs font-bold uppercase tracking-wider mb-1">Protein</p>
                            <p className="text-2xl font-bold text-amber-500">{report.calories?.protein}g</p>
                          </div>
                          <div className="bg-forest/50 rounded-xl p-4 text-center border border-blue-400/20">
                            <p className="text-blue-400/60 text-xs font-bold uppercase tracking-wider mb-1">Carbs</p>
                            <p className="text-2xl font-bold text-blue-400">{report.calories?.carbs}g</p>
                          </div>
                          <div className="bg-forest/50 rounded-xl p-4 text-center border border-purple-400/20">
                            <p className="text-purple-400/60 text-xs font-bold uppercase tracking-wider mb-1">Fats</p>
                            <p className="text-2xl font-bold text-purple-400">{report.calories?.fats}g</p>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <h4 className="font-bold text-cream flex items-center gap-2"><Utensils size={16} className="text-emerald-accent" /> Diet Plan</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-forest/30 p-4 rounded-xl">
                              <span className="text-amber-400 font-bold block mb-1">Breakfast</span>
                              <span className="text-cream/80 text-sm block min-h-[40px]">{report.dietPlan?.breakfast}</span>
                            </div>
                            <div className="bg-forest/30 p-4 rounded-xl">
                              <span className="text-amber-400 font-bold block mb-1">Lunch</span>
                              <span className="text-cream/80 text-sm block min-h-[40px]">{report.dietPlan?.lunch}</span>
                            </div>
                            <div className="bg-forest/30 p-4 rounded-xl">
                              <span className="text-amber-400 font-bold block mb-1">Snacks</span>
                              <span className="text-cream/80 text-sm block min-h-[40px]">{report.dietPlan?.snacks}</span>
                            </div>
                            <div className="bg-forest/30 p-4 rounded-xl">
                              <span className="text-amber-400 font-bold block mb-1">Dinner</span>
                              <span className="text-cream/80 text-sm block min-h-[40px]">{report.dietPlan?.dinner}</span>
                            </div>
                          </div>
                          {report.foodAnalysis && (
                             <p className="text-emerald-accent/80 text-sm italic mt-4 px-4 border-l-2 border-emerald-accent">{report.foodAnalysis}</p>
                          )}
                        </div>
                      </div>

                      {/* Hair and Skin */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-forest/50 p-6 rounded-2xl border border-white/5">
                          <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2 mb-3">
                            <Droplets size={18} /> Hair Care
                          </h3>
                          <p className="text-cream/80 text-sm mb-3"><span className="text-blue-400/80 font-bold">Issue:</span> {report.hairCare?.issue || 'Normal'}</p>
                          <ul className="space-y-2">
                            {report.hairCare?.remedies?.map((r: string, i: number) => (
                              <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-forest/50 p-6 rounded-2xl border border-white/5">
                          <h3 className="text-lg font-bold text-pink-400 flex items-center gap-2 mb-3">
                            <Smile size={18} /> Skin Care
                          </h3>
                          <p className="text-cream/80 text-sm mb-3"><span className="text-pink-400/80 font-bold">Routine:</span> {report.skinCare?.routine || 'Routine recommended'}</p>
                          <ul className="space-y-2">
                            {report.skinCare?.remedies?.map((r: string, i: number) => (
                              <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Fitness + Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-forest/50 p-6 rounded-2xl border border-white/5">
                          <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-3">
                            <Zap size={18} /> Fitness & Lifestyle
                          </h3>
                          <p className="text-cream/80 text-sm">{report.fitness}</p>
                        </div>
                        <div className="bg-forest/50 p-6 rounded-2xl border border-white/5">
                          <h3 className="text-lg font-bold text-emerald-accent flex items-center gap-2 mb-3">
                            <Heart size={18} /> Recommendations
                          </h3>
                          <ul className="space-y-2">
                            {report.recommendations?.map((r: string, i: number) => (
                              <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                                <CheckCircle size={14} className="text-emerald-accent mt-0.5 shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Ayurvedic Quick Tips */}
                      {report.tips && (
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden group hover:bg-blue-600/20 transition-all">
                             <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                             <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                Tip: Hair
                             </h4>
                             <p className="text-blue-100/80 text-sm leading-relaxed">{report.tips.hair}</p>
                          </div>
                          <div className="bg-pink-600/10 border border-pink-500/20 p-5 rounded-2xl relative overflow-hidden group hover:bg-pink-600/20 transition-all">
                             <div className="absolute -top-6 -right-6 w-16 h-16 bg-pink-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                             <h4 className="text-pink-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                Tip: Skin
                             </h4>
                             <p className="text-pink-100/80 text-sm leading-relaxed">{report.tips.skin}</p>
                          </div>
                          <div className="bg-emerald-600/10 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group hover:bg-emerald-600/20 transition-all">
                             <div className="absolute -top-6 -right-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                             <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                Tip: Health
                             </h4>
                             <p className="text-emerald-100/80 text-sm leading-relaxed">{report.tips.health}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Actionable Summary */}
                      <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-accent/10 to-teal-400/10 p-6 rounded-2xl border border-emerald-accent/30 mt-4">
                        <h3 className="text-lg font-bold text-emerald-accent flex items-center gap-2 mb-4">
                          <Target size={18} /> Action Plan for Tomorrow
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {report.summary?.map((step: string, i: number) => (
                            <div key={i} className="bg-forest/60 py-3 px-4 rounded-lg flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-accent/20 text-emerald-accent text-xs font-bold shrink-0">{i+1}</span>
                              <span className="text-cream/90 text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                    </motion.div>
                  )
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Shield size={40} className="text-white/20" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-cream mb-2">Awaiting Data Input</h3>
                    <p className="text-white/40 max-w-md mx-auto">Fill in your health parameters on the left and initialize the neural network to receive your holistic Ayurveda & wellness blueprint in structured format.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
