import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Sparkles, AlertCircle, CheckCircle2, ChevronRight,
  Flame, Wind, Droplets, Heart, ArrowRight, RefreshCw, MessageSquare,
  Calendar, User, Barcode, ShieldAlert, Check, X, Info, Zap, Coffee,
  ExternalLink, Lock, CheckCheck
} from 'lucide-react';
import { KNOWN_PACKAGED_SNACKS } from '../data/foods_dosha_db';

// Types
type TabType = 'scan' | 'chat' | 'routine' | 'profile';
type ScanCategory = 'fresh' | 'packaged';
type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    dosha: DoshaType;
    subtitle: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "How would you describe your digestion pattern?",
    options: [
      { text: "Irregular & easily bloated", dosha: "Vata", subtitle: "Variable hunger, gas after raw or dry foods" },
      { text: "Fierce & fast (get hangry easily)", dosha: "Pitta", subtitle: "Strong appetite, occasional acidity or burning" },
      { text: "Slow & steady (can skip meals easily)", dosha: "Kapha", subtitle: "Heavy digestion, feel sluggish after heavy meals" }
    ]
  },
  {
    id: 2,
    question: "What is your typical sleep quality?",
    options: [
      { text: "Light & interrupted", dosha: "Vata", subtitle: "Trouble falling asleep, active racing mind" },
      { text: "Moderate & intense", dosha: "Pitta", subtitle: "Wake up alert, vivid or colorful dreams" },
      { text: "Deep & heavy", dosha: "Kapha", subtitle: "Can easily sleep 8-10 hours, hard to wake up early" }
    ]
  },
  {
    id: 3,
    question: "How do your mind & body respond to college or work stress?",
    options: [
      { text: "Anxiety & restlessness", dosha: "Vata", subtitle: "Overthinking, scattered thoughts, physical jitters" },
      { text: "Irritability & perfectionism", dosha: "Pitta", subtitle: "Impatient, critical, short temper under pressure" },
      { text: "Withdrawal & resistance to change", dosha: "Kapha", subtitle: "Procrastination, emotional eating, comfort seeking" }
    ]
  },
  {
    id: 4,
    question: "How is your energy throughout the day?",
    options: [
      { text: "Bursts of high energy, then quick burnout", dosha: "Vata", subtitle: "Inconsistent stamina, afternoon slump" },
      { text: "Sharp, goal-driven, and high stamina", dosha: "Pitta", subtitle: "Steady drive, sometimes push past exhaustion" },
      { text: "Slow to get going, but strong sustained endurance", dosha: "Kapha", subtitle: "Prefers a gentle start, calm steady rhythm" }
    ]
  },
  {
    id: 5,
    question: "Which weather or climate bothers you the most?",
    options: [
      { text: "Cold, dry, and windy days", dosha: "Vata", subtitle: "Loves warm soups, woolen clothes, and sunny rooms" },
      { text: "Hot, humid summer afternoons", dosha: "Pitta", subtitle: "Needs AC, loves cool drinks, hates spicy heat" },
      { text: "Cold, rainy, and damp overcast days", dosha: "Kapha", subtitle: "Feels congested and lethargic when it's dreary" }
    ]
  }
];

export default function AyurCoachPage() {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState<TabType>('scan');
  const [scanCategory, setScanCategory] = useState<ScanCategory>('fresh');

  // Dosha Profile state
  const [userDosha, setUserDosha] = useState<DoshaType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScores, setQuizScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });

  // Scan & Quota state
  const [scanCount, setScanCount] = useState<number>(0);
  const [userTier, setUserTier] = useState<'free' | 'basic' | 'premium'>('free');
  const [showPaywall, setShowPaywall] = useState(false);

  // Fresh Scan State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [freshImage, setFreshImage] = useState<string | null>(null);
  const [isScanningFresh, setIsScanningFresh] = useState(false);
  const [scanLoadingMsg, setScanLoadingMsg] = useState('Reading your dosha...');
  const [freshResult, setFreshResult] = useState<any>(null);
  const [freshError, setFreshError] = useState<string | null>(null);

  // Packaged Scan State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [packagedImage, setPackagedImage] = useState<string | null>(null);
  const [isScanningPackaged, setIsScanningPackaged] = useState(false);
  const [packagedResult, setPackagedResult] = useState<any>(null);
  const [packagedError, setPackagedError] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: "Namaste! I'm your AyurCoach. Ask me about any symptom like bloating, acidity, late-night exam stress, or canteen food remedies."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Init from localStorage
  useEffect(() => {
    const savedDosha = localStorage.getItem('ayurcoach_user_dosha') as DoshaType;
    if (savedDosha) {
      setUserDosha(savedDosha);
    } else {
      setShowQuiz(true);
    }

    const savedCount = parseInt(localStorage.getItem('ayurcoach_scans_count') || '0', 10);
    setScanCount(savedCount);

    const savedTier = (localStorage.getItem('ayurcoach_user_tier') as any) || 'free';
    setUserTier(savedTier);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Quota verification
  const checkCanScan = () => {
    if (userTier !== 'free') return true;
    if (scanCount >= 3) {
      setShowPaywall(true);
      return false;
    }
    return true;
  };

  const incrementScanCount = () => {
    const next = scanCount + 1;
    setScanCount(next);
    localStorage.setItem('ayurcoach_scans_count', next.toString());
  };

  // Quiz Handling
  const handleAnswerQuiz = (dosha: DoshaType) => {
    const nextScores = { ...quizScores, [dosha]: quizScores[dosha] + 1 };
    setQuizScores(nextScores);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate dominant
      let winner: DoshaType = 'Vata';
      let maxScore = nextScores.Vata;
      if (nextScores.Pitta > maxScore) {
        winner = 'Pitta';
        maxScore = nextScores.Pitta;
      }
      if (nextScores.Kapha > maxScore) {
        winner = 'Kapha';
      }

      setUserDosha(winner);
      localStorage.setItem('ayurcoach_user_dosha', winner);
      setShowQuiz(false);
      setQuizStep(0);
    }
  };

  // Fresh Scan Execution
  const handleFreshFile = (file: File) => {
    if (!checkCanScan()) return;
    setFreshResult(null);
    setFreshError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFreshImage(base64);
      executeFreshScan(base64);
    };
    reader.readAsDataURL(file);
  };

  const executeFreshScan = async (base64: string) => {
    setIsScanningFresh(true);
    setScanLoadingMsg('Identifying meal with computer vision...');

    const timer1 = setTimeout(() => setScanLoadingMsg('Checking Indian food database & spices...'), 1200);
    const timer2 = setTimeout(() => setScanLoadingMsg(`Assessing impact for ${userDosha || 'your'} dosha...`), 2500);

    try {
      const res = await fetch('/api/ayurcoach-food-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, userDosha })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        if (text.includes('A server error occurred') || text.includes('FUNCTION_INVOCATION')) {
          throw new Error('AI Vision server is temporarily compiling. Please retry in a few seconds.');
        }
        throw new Error('Could not parse food scan response.');
      }
      if (!res.ok) throw new Error(data?.error || 'Scan analysis failed');

      setFreshResult(data);
      incrementScanCount();
    } catch (err: any) {
      setFreshError(err.message || 'Could not analyze meal. Please check image.');
    } finally {
      setIsScanningFresh(false);
    }
  };

  // Packaged Scan Execution
  const executePackagedScan = async (barcodeVal?: string, imageVal?: string) => {
    if (!checkCanScan()) return;
    setPackagedResult(null);
    setPackagedError(null);

    const cleanBarcode = barcodeVal ? barcodeVal.trim().replace(/[^0-9]/g, '') : '';

    // Instant local response for known Indian snacks (Maggi, Haldiram, Parle-G, etc.)
    if (cleanBarcode && KNOWN_PACKAGED_SNACKS[cleanBarcode]) {
      const cached = KNOWN_PACKAGED_SNACKS[cleanBarcode];
      setPackagedResult({
        scan_mode: 'barcode',
        product_name: cached.product_name,
        brand: cached.brand,
        ingredients_detected: cached.ingredients_text,
        flagged_ingredients: cached.flagged_ingredients,
        ayurvedic_verdict: cached.ayurvedic_verdict,
        dosha_impact: cached.dosha_impact,
        primary_concern: cached.primary_concern,
        healthier_snack_alternatives: cached.healthier_snack_alternatives,
        student_tip: cached.student_tip
      });
      incrementScanCount();
      setIsScanningPackaged(false);
      return;
    }

    setIsScanningPackaged(true);

    try {
      const res = await fetch('/api/ayurcoach-label-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: barcodeVal,
          imageBase64: imageVal,
          userDosha
        })
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        if (text.includes('A server error occurred') || text.includes('FUNCTION_INVOCATION')) {
          throw new Error('AI Engine Timeout. The server is busy, please retry in a moment.');
        }
        throw new Error('Could not parse package response.');
      }
      if (!res.ok) throw new Error(data?.error || 'Label scan failed');

      setPackagedResult(data);
      incrementScanCount();
    } catch (err: any) {
      setPackagedError(err.message || 'Could not process label.');
    } finally {
      setIsScanningPackaged(false);
    }
  };

  const handlePackagedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPackagedImage(base64);
      executePackagedScan(undefined, base64);
    };
    reader.readAsDataURL(file);
  };

  // Chat Execution
  const handleSendChat = async (presetText?: string) => {
    const msg = presetText || chatInput.trim();
    if (!msg || isChatLoading) return;

    const newHistory = [...chatMessages, { role: 'user' as const, text: msg }];
    setChatMessages(newHistory);
    if (!presetText) setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ayurcoach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          userDosha,
          history: newHistory.map(m => ({ role: m.role, content: m.text }))
        })
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Could not parse chat response.');
      }
      if (!res.ok) throw new Error(data?.error || 'Failed to get remedy');

      setChatMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'I had trouble connecting to Vaidya knowledge base. Try warm cumin-ginger tea in the meantime!' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Upgrades
  const handleUpgrade = (tier: 'basic' | 'premium') => {
    setUserTier(tier);
    localStorage.setItem('ayurcoach_user_tier', tier);
    setShowPaywall(false);
  };

  // Helper colors
  const doshaIcon = (d?: string) => {
    switch (d?.toLowerCase()) {
      case 'vata': return <Wind className="w-5 h-5 text-sky-500" />;
      case 'pitta': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'kapha': return <Droplets className="w-5 h-5 text-emerald-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getDoshaImpactBadge = (effect: string) => {
    const e = effect?.toLowerCase();
    if (e === 'increases') {
      return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30">Aggravates (↑)</span>;
    }
    if (e === 'decreases') {
      return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">Pacifies / Balances (↓)</span>;
    }
    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300">Neutral (—)</span>;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D3A2F] font-sans pb-24 selection:bg-[#6B8E6F]/20">
      {/* Top Banner / Mobile Shell Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#ECE3D6] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6B8E6F] text-white flex items-center justify-center font-bold text-base shadow-sm">
              🌿
            </div>
            <div>
              <h1 className="text-lg font-display font-extrabold tracking-tight text-[#2D3A2F] leading-none">
                Ayur<span className="text-[#6B8E6F]">Coach</span>
              </h1>
              <p className="text-[10px] text-[#6B8E6F] font-semibold tracking-wider uppercase mt-0.5">
                AI Food &amp; Dosha Lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userDosha ? (
              <button
                onClick={() => setShowQuiz(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8EFE9] text-[#4E6B52] border border-[#6B8E6F]/30 hover:bg-[#6B8E6F]/20 transition-all"
              >
                {doshaIcon(userDosha)}
                <span>{userDosha}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowQuiz(true)}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#D97736] text-white shadow-sm"
              >
                Take Quiz
              </button>
            )}

            <button
              onClick={() => setShowPaywall(true)}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[#ECE3D6] text-[#2D3A2F]/80 flex items-center gap-1"
            >
              {userTier === 'free' ? `${scanCount}/3 free` : userTier.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container constrained to clean mobile-first view */}
      <main className="max-w-md mx-auto px-4 pt-4">

        {/* ══════════════════════════════════════════════════════
            TAB 1: HOME / SCAN FOOD (PRIMARY DEMO FEATURE)
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'scan' && (
          <div className="space-y-4">
            {/* Category Toggle: Fresh Food vs Packaged Item */}
            <div className="bg-[#ECE3D6]/70 p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setScanCategory('fresh')}
                className={`flex-1 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scanCategory === 'fresh'
                    ? 'bg-[#4E6B52] text-white shadow-sm'
                    : 'text-[#2D3A2F]/70 hover:text-[#2D3A2F]'
                }`}
              >
                🍲 Cooked / Fresh Meal
              </button>
              <button
                onClick={() => setScanCategory('packaged')}
                className={`flex-1 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scanCategory === 'packaged'
                    ? 'bg-[#4E6B52] text-white shadow-sm'
                    : 'text-[#2D3A2F]/70 hover:text-[#2D3A2F]'
                }`}
              >
                📦 Packaged Snack
              </button>
            </div>

            {/* ── FRESH FOOD SCAN FLOW ── */}
            {scanCategory === 'fresh' && (
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFreshFile(e.target.files[0])}
                />

                {/* Upload Action Area */}
                {!freshImage && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-[#6B8E6F]/40 hover:border-[#4E6B52] bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-3 transition-all hover:bg-[#E8EFE9]/30 shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#E8EFE9] text-[#4E6B52] flex items-center justify-center shadow-inner">
                      <Camera size={28} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-lg text-[#2D3A2F]">Scan Cooked Meal</p>
                      <p className="text-xs text-[#2D3A2F]/60 mt-0.5">Paratha, Thali, Biryani, Samosa, Khichdi, etc.</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97736]/10 text-[#D97736] text-xs font-bold mt-2">
                      <Sparkles size={13} /> Gemini Vision + 80+ Indian Food DB
                    </div>
                  </div>
                )}

                {/* Scan Progress Overlay / Preview */}
                {freshImage && (
                  <div className="relative rounded-3xl overflow-hidden bg-black/5 border border-[#ECE3D6] shadow-md">
                    <img src={freshImage} alt="Scanned meal" className="w-full h-56 object-cover" />

                    {isScanningFresh && (
                      <div className="absolute inset-0 bg-[#2D3A2F]/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-5 text-center">
                        <div className="w-12 h-12 border-4 border-[#E8EFE9]/30 border-t-[#D97736] rounded-full animate-spin mb-3" />
                        <p className="font-bold text-sm tracking-wide">{scanLoadingMsg}</p>
                        <p className="text-xs text-white/70 mt-1">Extracting dosha bio-energetics</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Fresh Scan Error */}
                {freshError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{freshError}</span>
                  </div>
                )}

                {/* ── FRESH RESULT CARD ── */}
                {freshResult && !isScanningFresh && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#ECE3D6] rounded-3xl p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[#ECE3D6] pb-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B8E6F] uppercase tracking-wider">
                          <CheckCircle2 size={14} />
                          {freshResult.source === 'database_match' ? 'Database Match' : 'Gemini AI Analysis'}
                        </div>
                        <h2 className="text-xl font-display font-extrabold text-[#2D3A2F] mt-0.5">
                          {freshResult.food_name}
                        </h2>
                        <p className="text-xs text-[#2D3A2F]/50 font-medium">{freshResult.nature}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        freshResult.health_rating === 'Healthy'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : freshResult.health_rating === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {freshResult.health_rating}
                      </span>
                    </div>

                    {/* Dosha Impact Matrix */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D3A2F]/50 mb-2">
                        Dosha Energetic Impact
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6]">
                          <div className="flex items-center justify-center gap-1 text-xs font-bold text-sky-600 mb-1">
                            <Wind size={13} /> Vata
                          </div>
                          {getDoshaImpactBadge(freshResult.dosha_effect?.vata)}
                        </div>

                        <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6]">
                          <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600 mb-1">
                            <Flame size={13} /> Pitta
                          </div>
                          {getDoshaImpactBadge(freshResult.dosha_effect?.pitta)}
                        </div>

                        <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6]">
                          <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 mb-1">
                            <Droplets size={13} /> Kapha
                          </div>
                          {getDoshaImpactBadge(freshResult.dosha_effect?.kapha)}
                        </div>
                      </div>
                    </div>

                    {/* Impact on User's Specific Dosha */}
                    {userDosha && (
                      <div className="p-3 rounded-2xl bg-[#E8EFE9]/50 border border-[#6B8E6F]/20 text-xs">
                        <span className="font-bold text-[#4E6B52]">For your {userDosha} body type: </span>
                        <span>
                          {freshResult.dosha_effect?.[userDosha.toLowerCase()] === 'increases'
                            ? `⚠️ May aggravate your ${userDosha} (leads to imbalance or fatigue). Consume in moderation.`
                            : freshResult.dosha_effect?.[userDosha.toLowerCase()] === 'decreases'
                            ? `✅ Excellent choice! Helps soothe and balance your ${userDosha}.`
                            : `⚖️ Neutral impact on your ${userDosha}. Eat mindfully.`}
                        </span>
                      </div>
                    )}

                    {/* Ayurvedic Reasoning */}
                    <div className="text-xs text-[#2D3A2F]/80 leading-relaxed bg-[#FDFBF7] p-3 rounded-2xl border border-[#ECE3D6]">
                      <p className="font-semibold text-[#2D3A2F] mb-1">Ayurvedic Breakdown:</p>
                      <p>{freshResult.reason}</p>
                    </div>

                    {/* Healthier Alternative Box */}
                    <div className="p-4 rounded-2xl bg-[#D97736]/10 border border-[#D97736]/30 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#D97736] font-bold text-xs uppercase tracking-wider">
                        <Sparkles size={14} /> Healthier Ayurvedic Alternative
                      </div>
                      <p className="text-xs md:text-sm font-bold text-[#2D3A2F]">
                        {freshResult.healthier_alternative}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setFreshImage(null);
                        setFreshResult(null);
                      }}
                      className="w-full py-2.5 rounded-xl border border-[#ECE3D6] text-xs font-bold text-[#2D3A2F]/70 hover:bg-[#FDFBF7] transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={13} /> Scan Another Fresh Meal
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* ── PACKAGED SNACK / LABEL SCAN FLOW ── */}
            {scanCategory === 'packaged' && (
              <div className="space-y-4">
                {/* Barcode input or Sample Picker */}
                <div className="bg-white border border-[#ECE3D6] rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4E6B52] uppercase tracking-wider">
                    <Barcode size={16} /> Barcode Scan or Label Photo
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 13-digit barcode (e.g. 8901030383709)"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#ECE3D6] bg-[#FDFBF7] focus:outline-none focus:border-[#4E6B52]"
                    />
                    <button
                      onClick={() => barcodeInput.trim() && executePackagedScan(barcodeInput.trim())}
                      disabled={isScanningPackaged || !barcodeInput.trim()}
                      className="px-4 py-2 bg-[#4E6B52] text-white rounded-xl text-xs font-bold hover:bg-[#3D5541] disabled:opacity-50 transition-all shadow-sm"
                    >
                      Lookup
                    </button>
                  </div>

                  {/* Sample Indian snack barcodes */}
                  <div>
                    <p className="text-[10px] text-[#2D3A2F]/50 font-semibold mb-1.5">Try sample Indian snack barcodes:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => {
                          setBarcodeInput('8901030383709');
                          executePackagedScan('8901030383709');
                        }}
                        className="text-[11px] px-2 py-1 rounded-lg bg-[#ECE3D6]/60 hover:bg-[#ECE3D6] font-medium"
                      >
                        Maggi Noodles
                      </button>
                      <button
                        onClick={() => {
                          setBarcodeInput('8901491101837');
                          executePackagedScan('8901491101837');
                        }}
                        className="text-[11px] px-2 py-1 rounded-lg bg-[#ECE3D6]/60 hover:bg-[#ECE3D6] font-medium"
                      >
                        Haldiram Bhujia
                      </button>
                      <button
                        onClick={() => {
                          setBarcodeInput('8901719101050');
                          executePackagedScan('8901719101050');
                        }}
                        className="text-[11px] px-2 py-1 rounded-lg bg-[#ECE3D6]/60 hover:bg-[#ECE3D6] font-medium"
                      >
                        Parle-G
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#ECE3D6]">
                    <label className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#6B8E6F]/30 hover:border-[#4E6B52] bg-[#E8EFE9]/20 flex items-center justify-center gap-2 text-xs font-bold text-[#4E6B52] cursor-pointer">
                      <Camera size={15} /> Upload Ingredients Label Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handlePackagedFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                {/* Loading indicator */}
                {isScanningPackaged && (
                  <div className="p-6 rounded-3xl bg-white border border-[#ECE3D6] text-center space-y-2">
                    <div className="w-8 h-8 border-3 border-[#E8EFE9] border-t-[#4E6B52] rounded-full animate-spin mx-auto" />
                    <p className="font-bold text-xs text-[#2D3A2F]">Checking Open Food Facts &amp; Groq Llama 70B...</p>
                    <p className="text-[11px] text-[#2D3A2F]/50">Screening for maida, palm oil, INS additives</p>
                  </div>
                )}

                {/* Error */}
                {packagedError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{packagedError}</span>
                  </div>
                )}

                {/* ── PACKAGED RESULT CARD ── */}
                {packagedResult && !isScanningPackaged && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#ECE3D6] rounded-3xl p-5 shadow-sm space-y-4"
                  >
                    <div className="border-b border-[#ECE3D6] pb-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4E6B52] uppercase tracking-wider mb-1">
                        <CheckCheck size={13} /> {packagedResult.scan_mode === 'barcode' ? 'Open Food Facts Verified' : 'Label OCR Decoded'}
                      </div>
                      <h2 className="text-xl font-display font-extrabold text-[#2D3A2F]">
                        {packagedResult.product_name}
                      </h2>
                      {packagedResult.brand && (
                        <p className="text-xs text-[#2D3A2F]/50 font-semibold">{packagedResult.brand}</p>
                      )}
                    </div>

                    {/* Flagged Ingredients */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D3A2F]/50 mb-2">
                        Flagged Harmful Additives &amp; Flours
                      </p>
                      {packagedResult.flagged_ingredients?.length > 0 ? (
                        <div className="space-y-2">
                          {packagedResult.flagged_ingredients.map((flag: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                              <div className="flex items-center justify-between font-bold text-red-700">
                                <span>⚠️ {flag.ingredient}</span>
                                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-red-500/20">{flag.risk} Risk</span>
                              </div>
                              <p className="text-[11px] text-[#2D3A2F]/80 mt-1">{flag.ayurvedic_impact}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                          ✅ No major processed red-flags (maida, palm oil) detected!
                        </div>
                      )}
                    </div>

                    {/* Plain Language Verdict */}
                    <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6] text-xs space-y-1">
                      <p className="font-bold text-[#2D3A2F]">Ayurvedic Verdict for Students:</p>
                      <p className="text-[#2D3A2F]/80 leading-relaxed">{packagedResult.ayurvedic_verdict}</p>
                    </div>

                    {/* Healthier Snack Alternatives */}
                    <div className="p-4 rounded-2xl bg-[#E8EFE9] border border-[#6B8E6F]/30 space-y-2">
                      <div className="flex items-center gap-1 text-[#4E6B52] font-bold text-xs uppercase tracking-wider">
                        <Sparkles size={14} /> Clean Indian Snack Swaps
                      </div>
                      <ul className="text-xs space-y-1 text-[#2D3A2F]/90">
                        {packagedResult.healthier_snack_alternatives?.map((swap: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#4E6B52] font-bold">✓</span>
                            <span>{swap}</span>
                          </li>
                        ))}
                      </ul>
                      {packagedResult.student_tip && (
                        <p className="text-[11px] text-[#4E6B52] font-medium pt-1 border-t border-[#6B8E6F]/20 italic">
                          💡 Quick tip: {packagedResult.student_tip}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setPackagedResult(null);
                        setBarcodeInput('');
                      }}
                      className="w-full py-2.5 rounded-xl border border-[#ECE3D6] text-xs font-bold text-[#2D3A2F]/70 hover:bg-[#FDFBF7] transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={13} /> Scan Another Snack
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: REMEDY CHAT / ASK A SYMPTOM
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'chat' && (
          <div className="bg-white border border-[#ECE3D6] rounded-3xl p-4 shadow-sm flex flex-col h-[520px]">
            {/* Header */}
            <div className="border-b border-[#ECE3D6] pb-3 mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-[#2D3A2F]">Vaidya Remedy Chat</h3>
                <p className="text-[11px] text-[#6B8E6F] font-semibold">
                  Personalized for {userDosha || 'Vata-Pitta'} Students
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8EFE9] text-[#4E6B52] font-bold">
                Online
              </span>
            </div>

            {/* Quick symptom pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
              {['Hostel bloating', 'Acidity & heartburn', 'Late night exam fatigue', 'Insomnia & racing thoughts'].map((symptom, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(symptom)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FDFBF7] border border-[#ECE3D6] text-[#2D3A2F]/70 hover:border-[#4E6B52] hover:text-[#4E6B52] transition-all shrink-0"
                >
                  {symptom}
                </button>
              ))}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#4E6B52] text-white rounded-br-none shadow-sm'
                        : 'bg-[#FDFBF7] text-[#2D3A2F] border border-[#ECE3D6] rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6] text-[11px] text-[#2D3A2F]/60 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#4E6B52] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#4E6B52] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#4E6B52] rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>Brewing herbal remedy...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <div className="pt-3 border-t border-[#ECE3D6] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type your symptom (e.g. gas, acidity)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#ECE3D6] bg-[#FDFBF7] focus:outline-none focus:border-[#4E6B52]"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={isChatLoading || !chatInput.trim()}
                className="px-3.5 py-2 bg-[#4E6B52] text-white rounded-xl text-xs font-bold hover:bg-[#3D5541] disabled:opacity-40 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3: WEEKLY ROUTINE (DOSHA-BASED)
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'routine' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#ECE3D6] rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-extrabold text-base text-[#2D3A2F]">
                    {userDosha || 'Vata'} Weekly Bio-Schedule
                  </h3>
                  <p className="text-xs text-[#2D3A2F]/60">
                    Designed for student hostel routines &amp; young professional workdays
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8EFE9] text-[#4E6B52]">
                  {userDosha || 'Vata'} Protocol
                </span>
              </div>

              {/* Dinacharya Checklist */}
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97736] mb-1">
                    1. Morning Dinacharya (6:30 AM – 7:30 AM)
                  </p>
                  <ul className="text-xs text-[#2D3A2F]/80 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Ushapan:</strong> Drink 1 glass of warm copper-infused or plain warm water with lemon.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Oil Pulling (Gandusha):</strong> 1 tsp sesame or coconut oil swished for 3 minutes to cleanse oral Ama.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Pranayama:</strong> 5 minutes of Nadi Shodhana (Alternate Nostril Breathing) to center the nervous system.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#4E6B52] mb-1">
                    2. Ideal Meal Timings &amp; Diet
                  </p>
                  <ul className="text-xs text-[#2D3A2F]/80 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Breakfast (8:30 AM):</strong> Warm, easily digestible food (Poha, Upma, or warm oats with cinnamon).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Lunch (12:30 PM - 1:30 PM):</strong> Heaviest meal of the day when Agni (sun) is at its peak. Dal, subzi, roti/rice.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Light Dinner (before 8:00 PM):</strong> Soups, Khichdi, or steamed moong dal. No raw salads or cold curd at night.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#ECE3D6]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-sky-600 mb-1">
                    3. Night Exam / Wind-down Ritual (10:00 PM)
                  </p>
                  <ul className="text-xs text-[#2D3A2F]/80 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Golden Milk (Haldi Doodh):</strong> Warm milk or almond milk with a pinch of nutmeg and turmeric for deep REM sleep.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span><strong>Pada Abhyanga:</strong> Rub 2 drops of sesame oil or ghee on your soles to pull mental heat down.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4E6B52] font-bold">✓</span>
                      <span>Screens off 30 mins before sleep to prevent Vata-Pitta restlessness.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 4: PROFILE & PRICING TIERS
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* User Dosha Card */}
            <div className="bg-white border border-[#ECE3D6] rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#2D3A2F]">
                    Your Constitution: {userDosha || 'Vata'}
                  </h3>
                  <p className="text-xs text-[#6B8E6F] font-semibold">
                    Dominant Bio-energy Pattern
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] flex items-center justify-center">
                  {doshaIcon(userDosha || 'Vata')}
                </div>
              </div>

              <p className="text-xs text-[#2D3A2F]/80 leading-relaxed bg-[#FDFBF7] p-3 rounded-2xl border border-[#ECE3D6]">
                {userDosha === 'Pitta'
                  ? 'Pitta governs metabolism, body temperature, and sharp intellect. Your focus is staying cool, avoiding harsh oils, and managing anger or hyper-acidity.'
                  : userDosha === 'Kapha'
                  ? 'Kapha governs bodily structure, endurance, and lubrication. Your focus is eating light, warm, spiced foods to prevent lethargy and congestion.'
                  : 'Vata governs motion, creativity, and nervous system impulse. Your focus is warm, grounding, moist foods and regular sleep routines to avoid anxiety.'}
              </p>

              <button
                onClick={() => {
                  setQuizStep(0);
                  setQuizScores({ Vata: 0, Pitta: 0, Kapha: 0 });
                  setShowQuiz(true);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-[#4E6B52] bg-[#E8EFE9]/50 border border-[#6B8E6F]/20 hover:bg-[#E8EFE9] transition-all"
              >
                Retake 5-Question Dosha Quiz
              </button>
            </div>

            {/* Subscription & Pricing Tiers */}
            <div className="bg-white border border-[#ECE3D6] rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="font-display font-bold text-base text-[#2D3A2F]">Subscription Tiers</h4>
                <p className="text-xs text-[#2D3A2F]/60">Affordable student plans tailored for India</p>
              </div>

              {/* Free Tier */}
              <div className={`p-4 rounded-2xl border transition-all ${
                userTier === 'free' ? 'border-[#4E6B52] bg-[#E8EFE9]/30' : 'border-[#ECE3D6] bg-[#FDFBF7]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2D3A2F]">Free Explorer</span>
                  <span className="font-bold text-xs text-[#4E6B52]">₹0 / month</span>
                </div>
                <p className="text-[11px] text-[#2D3A2F]/60 mt-1">3 meal/snack scans per month</p>
                <div className="mt-2 text-xs font-semibold text-[#4E6B52]">
                  Used this month: {scanCount} of 3 scans
                </div>
              </div>

              {/* Basic Tier */}
              <div className={`p-4 rounded-2xl border transition-all ${
                userTier === 'basic' ? 'border-[#4E6B52] bg-[#E8EFE9]/30' : 'border-[#ECE3D6] bg-[#FDFBF7]'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#2D3A2F]">AyurCoach Basic</span>
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#D97736]/15 text-[#D97736] font-bold">Popular</span>
                  </div>
                  <span className="font-bold text-xs text-[#D97736]">₹49 / month</span>
                </div>
                <p className="text-[11px] text-[#2D3A2F]/60 mt-1">Unlimited fresh &amp; packaged scans + Personalized weekly routine</p>
                <button
                  onClick={() => handleUpgrade('basic')}
                  className="mt-3 w-full py-2 rounded-xl bg-[#4E6B52] text-white text-xs font-bold hover:bg-[#3D5541] transition-all shadow-sm"
                >
                  {userTier === 'basic' ? 'Current Active Plan' : 'Upgrade to Basic (₹49)'}
                </button>
              </div>

              {/* Premium Tier */}
              <div className={`p-4 rounded-2xl border transition-all ${
                userTier === 'premium' ? 'border-[#4E6B52] bg-[#E8EFE9]/30' : 'border-[#ECE3D6] bg-[#FDFBF7]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2D3A2F]">AyurCoach Premium</span>
                  <span className="font-bold text-xs text-[#D97736]">₹99 / month</span>
                </div>
                <p className="text-[11px] text-[#2D3A2F]/60 mt-1">Unlimited scans + Unlimited 24/7 symptom chat + Monthly PDF report</p>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="mt-3 w-full py-2 rounded-xl bg-[#D97736] text-white text-xs font-bold hover:bg-[#C85A17] transition-all shadow-sm"
                >
                  {userTier === 'premium' ? 'Current Active Plan' : 'Upgrade to Premium (₹99)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            ALWAYS-VISIBLE DISCLAIMER FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer className="pt-6 pb-2 text-center">
          <p className="text-[11px] text-[#2D3A2F]/50 leading-relaxed font-medium">
            Not a substitute for medical treatment — Ayurvedic lifestyle guidance only.
          </p>
        </footer>
      </main>

      {/* ══════════════════════════════════════════════════════
          BOTTOM NAVIGATION BAR (4 TABS)
      ══════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#ECE3D6] py-2 px-4 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
              activeTab === 'scan' ? 'text-[#4E6B52] font-bold' : 'text-[#2D3A2F]/50 hover:text-[#2D3A2F]'
            }`}
          >
            <Camera size={19} className={activeTab === 'scan' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px]">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
              activeTab === 'chat' ? 'text-[#4E6B52] font-bold' : 'text-[#2D3A2F]/50 hover:text-[#2D3A2F]'
            }`}
          >
            <MessageSquare size={19} className={activeTab === 'chat' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px]">Remedy</span>
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
              activeTab === 'routine' ? 'text-[#4E6B52] font-bold' : 'text-[#2D3A2F]/50 hover:text-[#2D3A2F]'
            }`}
          >
            <Calendar size={19} className={activeTab === 'routine' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px]">Routine</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-[#4E6B52] font-bold' : 'text-[#2D3A2F]/50 hover:text-[#2D3A2F]'
            }`}
          >
            <User size={19} className={activeTab === 'profile' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          ONBOARDING DOSHA QUIZ MODAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#FDFBF7] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#ECE3D6] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#ECE3D6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪷</span>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-[#2D3A2F]">Discover Your Dominant Dosha</h3>
                    <p className="text-[11px] text-[#6B8E6F] font-semibold">Question {quizStep + 1} of {QUIZ_QUESTIONS.length}</p>
                  </div>
                </div>
                {userDosha && (
                  <button onClick={() => setShowQuiz(false)} className="text-[#2D3A2F]/50 hover:text-[#2D3A2F]">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#ECE3D6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4E6B52] transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="font-bold text-sm text-[#2D3A2F] leading-snug">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h4>

                <div className="space-y-2">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerQuiz(opt.dosha)}
                      className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#ECE3D6] hover:border-[#4E6B52] hover:bg-[#E8EFE9]/40 transition-all shadow-sm group"
                    >
                      <p className="text-xs font-bold text-[#2D3A2F] group-hover:text-[#4E6B52]">
                        {opt.text}
                      </p>
                      <p className="text-[11px] text-[#2D3A2F]/50 mt-0.5">
                        {opt.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          PAYWALL MODAL (FREE QUOTA EXCEEDED)
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FDFBF7] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#ECE3D6] space-y-4 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#D97736]/10 text-[#D97736] flex items-center justify-center mx-auto">
                <Lock size={26} />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-lg text-[#2D3A2F]">
                  Monthly Free Limit Reached
                </h3>
                <p className="text-xs text-[#2D3A2F]/60 mt-1">
                  You've used all 3 free scans for this month. Upgrade to unlimited scans to keep eating for your dosha!
                </p>
              </div>

              <div className="space-y-2 text-left pt-1">
                <button
                  onClick={() => handleUpgrade('basic')}
                  className="w-full p-3.5 rounded-2xl bg-[#4E6B52] text-white flex items-center justify-between text-xs font-bold hover:bg-[#3D5541] transition-all shadow-sm"
                >
                  <div>
                    <p>AyurCoach Basic</p>
                    <p className="text-[10px] text-white/70 font-normal">Unlimited Fresh &amp; Packaged Scans</p>
                  </div>
                  <span>₹49 / mo</span>
                </button>

                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full p-3.5 rounded-2xl bg-[#D97736] text-white flex items-center justify-between text-xs font-bold hover:bg-[#C85A17] transition-all shadow-sm"
                >
                  <div>
                    <p>AyurCoach Premium</p>
                    <p className="text-[10px] text-white/70 font-normal">+ Unlimited 24/7 Chat &amp; Reports</p>
                  </div>
                  <span>₹99 / mo</span>
                </button>
              </div>

              <button
                onClick={() => setShowPaywall(false)}
                className="text-xs font-bold text-[#2D3A2F]/50 hover:text-[#2D3A2F]"
              >
                Close for now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
