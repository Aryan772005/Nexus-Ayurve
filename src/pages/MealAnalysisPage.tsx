import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle, Leaf, Flame, Heart, Zap, Coffee } from 'lucide-react';

interface FoodResult {
  food_name: string;
  calories: string;
  health_category: string;
  ayurvedic_nature: string;
  suggestion: string;
}

export default function MealAnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const healthColor = (cat: string) => {
    if (!cat) return '#34D399';
    const c = cat.toLowerCase();
    if (c.includes('healthy')) return '#34D399';
    if (c.includes('moderate')) return '#FBBF24';
    return '#F87171';
  };

  const handleFile = async (file: File) => {
    setResult(null);
    setError(null);

    // Compress + preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 512;
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
          const base64 = canvas.toDataURL('image/jpeg', 0.6);
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
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyse meal. Please try again.');
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
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-orange-500/10 rounded-full blur-[150px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.08, 0.04] }} transition={{ duration: 14, repeat: Infinity, delay: 3 }}
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-emerald-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 text-sm font-bold mb-5 border border-orange-500/20">
            <Camera size={16} /> AI Meal Analyser
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
            Analyse Your <span className="text-gradient">Meal</span>
          </h1>
          <p className="text-cream/50 max-w-xl mx-auto">
            Upload a photo of your food and our AI will instantly reveal its calories, nutrition profile, and personalised Ayurvedic insights.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {!imagePreview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/10 hover:border-orange-500/40 rounded-3xl p-16 flex flex-col items-center gap-5 transition-all group bg-moss/20 hover:bg-orange-500/5"
            >
              <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={36} className="text-orange-400" />
              </div>
              <div className="text-center">
                <p className="text-cream font-bold text-xl mb-1">Drop your meal photo here</p>
                <p className="text-cream/40 text-sm">or click to browse · JPG, PNG, WEBP</p>
              </div>
              <div className="flex items-center gap-6 text-xs text-cream/30 font-semibold">
                <span className="flex items-center gap-1"><Camera size={13} /> Camera supported</span>
                <span className="flex items-center gap-1"><Zap size={13} /> Instant AI analysis</span>
                <span className="flex items-center gap-1"><Leaf size={13} /> Ayurvedic insights</span>
              </div>
            </button>
          ) : (
            <div className="space-y-6">
              {/* Image preview + analyzing overlay */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-moss/20 aspect-video flex items-center justify-center">
                <img src={imagePreview} alt="Food" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-forest/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full" />
                      <div className="absolute inset-0 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      <Coffee size={20} className="absolute inset-0 m-auto text-orange-400" />
                    </div>
                    <p className="text-cream font-bold">Analysing your meal…</p>
                    <p className="text-cream/40 text-sm">Detecting nutrients &amp; Ayurvedic profile</p>
                  </div>
                )}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && !isAnalyzing && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm mb-1">Analysis Failed</p>
                      <p className="text-xs text-red-400/70">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result card */}
              <AnimatePresence>
                {result && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-moss/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle size={20} className="text-emerald-accent" />
                      <h2 className="text-xl font-display font-bold text-cream">Meal Report</h2>
                    </div>

                    <h3 className="text-3xl font-display font-bold text-cream mb-6 text-center">{result.food_name}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {/* Calories */}
                      <div className="bg-forest/50 rounded-2xl p-5 text-center border border-amber-500/20">
                        <Flame size={20} className="text-amber-400 mx-auto mb-2" />
                        <p className="text-[10px] uppercase tracking-widest text-amber-400/60 font-bold mb-1">Calories</p>
                        <p className="text-2xl font-bold text-amber-400">{result.calories}</p>
                      </div>
                      {/* Health Category */}
                      <div className="bg-forest/50 rounded-2xl p-5 text-center border border-white/5">
                        <Heart size={20} className="mx-auto mb-2" style={{ color: healthColor(result.health_category) }} />
                        <p className="text-[10px] uppercase tracking-widest text-cream/40 font-bold mb-1">Health Category</p>
                        <p className="text-lg font-bold" style={{ color: healthColor(result.health_category) }}>{result.health_category}</p>
                      </div>
                      {/* Ayurvedic */}
                      <div className="bg-forest/50 rounded-2xl p-5 text-center border border-emerald-accent/20">
                        <Leaf size={20} className="text-emerald-accent mx-auto mb-2" />
                        <p className="text-[10px] uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Ayurvedic Nature</p>
                        <p className="text-lg font-bold text-emerald-accent">{result.ayurvedic_nature}</p>
                      </div>
                    </div>

                    {/* Suggestion */}
                    {result.suggestion && (
                      <div className="bg-emerald-accent/5 border border-emerald-accent/20 rounded-2xl p-5">
                        <p className="text-[10px] uppercase tracking-widest text-emerald-accent/60 font-bold mb-2">Ayurvedic Insight</p>
                        <p className="text-cream/80 text-sm leading-relaxed italic">"{result.suggestion}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <button onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-moss/40 border border-white/10 text-cream/60 hover:text-cream font-bold text-sm transition-all hover:border-white/20">
                  <RefreshCw size={16} /> Analyse Another
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm transition-all hover:bg-orange-400 shadow-lg shadow-orange-500/20">
                  <Upload size={16} /> Upload New Photo
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
