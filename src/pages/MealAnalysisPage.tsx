import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, RefreshCw, CheckCircle, AlertCircle, Leaf, Flame, Heart,
  Zap, Coffee, Sparkles, ShieldCheck, Activity, Pill, Droplet, Apple,
  ChevronRight, Info, Compass, Shield
} from 'lucide-react';

interface Micronutrient {
  name: string;
  amount: string;
  daily_value?: string;
  benefit: string;
}

interface AyurvedicProfile {
  dominant_dosha: string;
  dosha_effect: string;
  rasa: string[];
  virya: string;
  vipaka: string;
  agni_impact: string;
}

interface FoodResult {
  food_name: string;
  portion_size: string;
  calories: string;
  health_category: string;
  ayurvedic_nature: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
    fiber: string;
  };
  vitamins: Micronutrient[];
  minerals: Micronutrient[];
  ayurvedic_profile: AyurvedicProfile;
  key_ingredients: string[];
  suggestion: string;
}

export default function MealAnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'macros' | 'micros' | 'ayurveda'>('all');

  const healthColor = (cat: string) => {
    if (!cat) return '#10B981';
    const c = cat.toLowerCase();
    if (c.includes('healthy')) return '#10B981';
    if (c.includes('moderate')) return '#F59E0B';
    return '#EF4444';
  };

  const handleFile = async (file: File) => {
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 768;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        } else {
          if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(base64);
          callAPI(base64);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const callAPI = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/food-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        const rawErr = data.error || '';
        if (rawErr.includes('429') || rawErr.includes('quota')) {
          throw new Error('Google AI free tier reached its per-minute rate limit. Please wait 30 seconds and try again.');
        }
        throw new Error(rawErr || 'Analysis failed');
      }
      setResult(data);
    } catch (err: any) {
      const msg = err?.message || 'Failed to analyse meal. Please try again.';
      setError(msg.includes('GoogleGenerativeAI') ? 'Google AI is temporarily busy. Please retry in a few moments.' : msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 relative overflow-hidden bg-forest">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold mb-4 border border-emerald-500/20">
            <Sparkles size={14} className="text-emerald-500" /> AI Multimodal Nutrition &amp; Ayurveda Lab
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-cream mb-3">
            Holistic <span className="text-emerald-600">Meal Analysis</span>
          </h1>
          <p className="text-cream/60 max-w-xl mx-auto text-sm md:text-base">
            Upload or capture your food to discover complete macronutrients, essential vitamins, vital minerals, and Ayurvedic bio-energetic insights.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-emerald-500/50 rounded-3xl p-12 md:p-16 flex flex-col items-center gap-5 transition-all group bg-white/60 dark:bg-moss/20 hover:bg-emerald-500/5 shadow-sm hover:shadow-md"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={34} className="text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-cream font-bold text-xl mb-1">Drop or capture your meal photo</p>
                <p className="text-cream/50 text-sm">JPG, PNG, WebP supported · High resolution recommended</p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs text-cream/60 font-semibold pt-2">
                <span className="flex items-center gap-1.5"><Camera size={14} className="text-emerald-600" /> Instant Camera Capture</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-amber-500" /> Complete Macros &amp; Micros</span>
                <span className="flex items-center gap-1.5"><Leaf size={14} className="text-emerald-600" /> Full Ayurvedic Dosha Profiling</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview & Scanner State */}
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-black/5 dark:bg-moss/20 max-h-96 flex items-center justify-center shadow-lg">
                <img src={imagePreview} alt="Food meal" className="w-full h-full object-cover max-h-96" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <Sparkles size={22} className="absolute inset-0 m-auto text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white mb-1">Deciphering Meal Matrix…</p>
                      <p className="text-white/70 text-xs md:text-sm">Calculating calories, vitamins, minerals &amp; Ayurvedic dosha chemistry</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-sm"
                  >
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm mb-0.5">Analysis Issue</p>
                      <p className="text-xs text-red-500/80">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comprehensive Result Report */}
              <AnimatePresence>
                {result && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Header Card */}
                    <div className="bg-white dark:bg-moss/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1.5 uppercase tracking-wider">
                            <CheckCircle size={15} /> Verified Nutri-Ayurvedic Scan
                          </div>
                          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-cream">
                            {result.food_name}
                          </h2>
                          {result.portion_size && (
                            <p className="text-xs text-cream/50 mt-1 font-medium">
                              Estimated Serving: <span className="text-cream/80 font-semibold">{result.portion_size}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold border"
                            style={{
                              borderColor: `${healthColor(result.health_category)}40`,
                              backgroundColor: `${healthColor(result.health_category)}15`,
                              color: healthColor(result.health_category)
                            }}
                          >
                            ● {result.health_category}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
                            🌿 {result.ayurvedic_nature}
                          </span>
                        </div>
                      </div>

                      {/* Primary Macro Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
                        {/* Calories */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                          <Flame size={20} className="text-amber-500 mx-auto mb-1.5" />
                          <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600/70">Energy</p>
                          <p className="text-xl md:text-2xl font-black text-amber-600">{result.calories}</p>
                        </div>

                        {/* Protein */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                          <Activity size={20} className="text-blue-500 mx-auto mb-1.5" />
                          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600/70">Protein</p>
                          <p className="text-xl md:text-2xl font-black text-blue-600">{result.macros?.protein || 'N/A'}</p>
                        </div>

                        {/* Carbs */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                          <Apple size={20} className="text-amber-500 mx-auto mb-1.5" />
                          <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600/70">Carbohydrates</p>
                          <p className="text-xl md:text-2xl font-black text-amber-600">{result.macros?.carbs || 'N/A'}</p>
                        </div>

                        {/* Fats & Fiber */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                          <Droplet size={20} className="text-emerald-500 mx-auto mb-1.5" />
                          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/70">Fats / Fiber</p>
                          <p className="text-base md:text-lg font-black text-emerald-600">
                            {result.macros?.fats || 'N/A'} <span className="text-xs font-normal text-cream/50">/ {result.macros?.fiber || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Navigation tabs for detailed breakdown */}
                      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-3 mb-6 overflow-x-auto text-xs md:text-sm font-bold">
                        <button
                          onClick={() => setActiveTab('all')}
                          className={`px-3.5 py-1.5 rounded-xl transition-all ${
                            activeTab === 'all'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-cream/60 hover:text-cream bg-gray-100 dark:bg-white/5'
                          }`}
                        >
                          Complete Overview
                        </button>
                        <button
                          onClick={() => setActiveTab('micros')}
                          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                            activeTab === 'micros'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-cream/60 hover:text-cream bg-gray-100 dark:bg-white/5'
                          }`}
                        >
                          <Pill size={14} /> Vitamins &amp; Minerals ({result.vitamins?.length + result.minerals?.length || 0})
                        </button>
                        <button
                          onClick={() => setActiveTab('ayurveda')}
                          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                            activeTab === 'ayurveda'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-cream/60 hover:text-cream bg-gray-100 dark:bg-white/5'
                          }`}
                        >
                          <Leaf size={14} /> Ayurvedic Dosha Science
                        </button>
                      </div>

                      {/* TAB CONTENT: MICROS (Vitamins & Minerals) */}
                      {(activeTab === 'all' || activeTab === 'micros') && (
                        <div className="space-y-6 mb-6">
                          {/* Vitamins Section */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-base md:text-lg font-display font-bold text-cream flex items-center gap-2">
                                <Sparkles size={17} className="text-amber-500" />
                                Essential Vitamins Detected
                              </h3>
                              <span className="text-[11px] font-semibold text-cream/40">Clinical Estimates</span>
                            </div>

                            {result.vitamins && result.vitamins.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {result.vitamins.map((vit, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-start gap-3 hover:border-amber-500/30 transition-all"
                                  >
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                      V
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-xs md:text-sm text-cream">{vit.name}</h4>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold text-amber-600">{vit.amount}</span>
                                          {vit.daily_value && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                                              {vit.daily_value} DV
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-[11px] text-cream/60 mt-0.5 leading-relaxed">{vit.benefit}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-cream/40 italic">Standard trace vitamins present.</p>
                            )}
                          </div>

                          {/* Minerals Section */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-base md:text-lg font-display font-bold text-cream flex items-center gap-2">
                                <ShieldCheck size={17} className="text-emerald-500" />
                                Vital Minerals &amp; Trace Elements
                              </h3>
                              <span className="text-[11px] font-semibold text-cream/40">Bio-available Ions</span>
                            </div>

                            {result.minerals && result.minerals.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {result.minerals.map((min, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-start gap-3 hover:border-emerald-500/30 transition-all"
                                  >
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                      M
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-xs md:text-sm text-cream">{min.name}</h4>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold text-emerald-600">{min.amount}</span>
                                          {min.daily_value && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                                              {min.daily_value} DV
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-[11px] text-cream/60 mt-0.5 leading-relaxed">{min.benefit}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-cream/40 italic">Standard trace minerals present.</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB CONTENT: AYURVEDIC DOSHA ANALYSIS */}
                      {(activeTab === 'all' || activeTab === 'ayurveda') && (
                        <div className="space-y-4 pt-2 mb-6">
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-3">
                              <Leaf size={18} />
                              <span>Ayurvedic Bio-energetic Profile (Dravyaguna Assessment)</span>
                            </div>

                            <p className="text-xs md:text-sm text-cream/80 leading-relaxed mb-4">
                              {result.ayurvedic_profile?.dosha_effect || result.ayurvedic_nature}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-emerald-500/15">
                              {/* Rasa (Tastes) */}
                              <div className="bg-white/60 dark:bg-black/20 p-2.5 rounded-xl border border-emerald-500/10">
                                <p className="text-[10px] uppercase font-bold text-cream/40 tracking-wider mb-1">Rasa (Taste)</p>
                                <p className="text-xs font-bold text-cream">
                                  {result.ayurvedic_profile?.rasa?.join(', ') || 'Mixed'}
                                </p>
                              </div>

                              {/* Virya (Thermal Potency) */}
                              <div className="bg-white/60 dark:bg-black/20 p-2.5 rounded-xl border border-emerald-500/10">
                                <p className="text-[10px] uppercase font-bold text-cream/40 tracking-wider mb-1">Virya (Potency)</p>
                                <p className="text-xs font-bold text-cream">
                                  {result.ayurvedic_profile?.virya || 'Neutral'}
                                </p>
                              </div>

                              {/* Vipaka (Post-Digestive Effect) */}
                              <div className="bg-white/60 dark:bg-black/20 p-2.5 rounded-xl border border-emerald-500/10">
                                <p className="text-[10px] uppercase font-bold text-cream/40 tracking-wider mb-1">Vipaka (Post-Digest)</p>
                                <p className="text-xs font-bold text-cream">
                                  {result.ayurvedic_profile?.vipaka || 'Sweet (Madhura)'}
                                </p>
                              </div>

                              {/* Agni Impact */}
                              <div className="bg-white/60 dark:bg-black/20 p-2.5 rounded-xl border border-emerald-500/10">
                                <p className="text-[10px] uppercase font-bold text-cream/40 tracking-wider mb-1">Agni (Digestion)</p>
                                <p className="text-xs font-bold text-cream truncate">
                                  {result.ayurvedic_profile?.agni_impact || 'Moderate'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Ingredients Identified */}
                      {result.key_ingredients && result.key_ingredients.length > 0 && (
                        <div className="mb-6">
                          <p className="text-[11px] font-bold text-cream/50 uppercase tracking-wider mb-2">
                            Detected Ingredients:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.key_ingredients.map((ing, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-cream/80"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vaidya's Custom Advice Box */}
                      {result.suggestion && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                          <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-0.5 uppercase tracking-wider">
                              Vaidya's Dining Recommendation
                            </p>
                            <p className="text-xs md:text-sm text-cream/90 leading-relaxed italic">
                              "{result.suggestion}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-moss/40 border border-gray-200 dark:border-white/10 text-cream/70 hover:text-cream font-bold text-sm transition-all hover:border-gray-300 dark:hover:border-white/20"
                >
                  <RefreshCw size={16} /> Analyse Another Meal
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                >
                  <Upload size={16} /> Upload New Meal Photo
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
