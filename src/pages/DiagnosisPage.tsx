import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Upload, ArrowRight, ArrowLeft, Volume2, Search, Heart, Activity, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import BodyMap from '../components/BodyMap';
import { analyzeDosha, DoshaDiagnosis } from '../services/doshaEngine';
import { generateDietPlan, DietRoutine } from '../services/dietPlanner';
import { fallbackAnalyzeFood, FoodAnalysisResult } from '../services/foodAnalyzer';

export default function DiagnosisPage({ user }: { user: FirebaseUser | null }) {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [diagnosis, setDiagnosis] = useState<DoshaDiagnosis | null>(null);
  const [dietPlan, setDietPlan] = useState<DietRoutine | null>(null);
  const [foodAnalysis, setFoodAnalysis] = useState<any | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Voice Input (Speech to Text) ---
  useEffect(() => {
    let recognition: any;
    if (isListening && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works for Indian English + basic Hindi terms

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTextInput((prev) => prev ? prev + " " + finalTranscript.trim() : finalTranscript.trim());
        }
      };

      recognition.start();
    }
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  // --- Voice Output (Text to Speech) ---
  const speakDiagnosis = () => {
    if (!diagnosis || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const textToSpeak = `Based on your symptoms, I have detected a ${diagnosis.dosha} imbalance. 
    ${diagnosis.reason}. 
    I recommend the following remedies: ${diagnosis.remedies.join(", ")}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Try to find an Indian voice, fallback to default English
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi'));
    if (indianVoice) utterance.voice = indianVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSymptomAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textInput.trim()) return;
    
    // simplistic split by comma or space if long
    const newSymptoms = textInput.split(/[,]+/).map(s => s.trim()).filter(Boolean);
    const merged = new Set([...symptoms, ...newSymptoms]);
    setSymptoms(Array.from(merged));
    setTextInput('');
  };

  const handleRemoveSymptom = (s: string) => {
    setSymptoms(symptoms.filter(sym => sym !== s));
  };

  const handleBodyMapSelect = (newSymptoms: string[]) => {
    setSymptoms(newSymptoms);
  };

  const processAI = async () => {
    setIsProcessing(true);
    setStep(2); // Move to loading step
    
    // Artificial delay for UI dramatic effect
    setTimeout(() => {
      const result = analyzeDosha(symptoms);
      const plan = generateDietPlan(result.dosha);
      setDiagnosis(result);
      setDietPlan(plan);
      setIsProcessing(false);
      setStep(3); // Move to results step
    }, 2500);
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodError, setFoodError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instantly show preview
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setIsProcessing(true);
    setFoodError(null);
    try {
      console.log("Sending image to API...");
      const res = await fetch('/api/food-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageBase64: base64 })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Unable to analyze image. Please try again.");
      }
      
      console.log("Image analysis success:", data);
      setFoodAnalysis(data);
      setShowFoodModal(true);
    } catch (err: any) {
      console.error("Image analysis error:", err);
      setFoodError(err.message || "Unable to analyze image. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-forest pt-40 px-4 md:px-8 pb-20 flex flex-col relative overflow-hidden">
      {/* Decorative background matching HomePage */}
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

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">

      {/* Progress Header */}
      <div className="mb-8 relative z-20">
        <div className="flex justify-between text-sm text-emerald-accent/60 mb-2 font-bold uppercase tracking-wider">
          <span>Symptoms</span>
          <span>Diagnosis</span>
          <span>Food Scan</span>
          <span>Routine</span>
        </div>
        <div className="h-2 bg-moss/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-accent to-green-300"
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* === STEP 1: Input Symptoms === */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col w-full relative z-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">What's bothering you?</h1>
              <p className="text-emerald-accent/60 text-lg">Click on the body map, type, or speak your symptoms.</p>
            </div>

            <div className="bg-moss/30 p-4 md:p-8 rounded-[40px] border border-white/5 shadow-2xl flex flex-col">
              <BodyMap onSymptomSelect={handleBodyMapSelect} />

              <div className="mt-8 border-t border-white/5 pt-8">
                <form onSubmit={handleSymptomAdd} className="flex gap-4 items-center flex-wrap md:flex-nowrap">
                  <div className="relative flex-1 min-w-[200px] w-full">
                    <input 
                      type="text" 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="e.g. Acid reflux, joint pain..."
                      className="w-full bg-forest/40 border border-white/10 rounded-2xl p-4 pl-12 text-cream focus:border-emerald-accent outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-accent/40" size={20} />
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      type="button"
                      onClick={() => setIsListening(!isListening)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-lg ${
                        isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-forest border border-white/10 text-emerald-accent hover:border-emerald-accent focus:border-emerald-accent'
                      }`}
                    >
                      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button 
                      type="submit"
                      className="flex-1 md:flex-none bg-emerald-accent/20 text-emerald-accent px-6 h-14 rounded-2xl font-bold hover:bg-emerald-accent hover:text-forest transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 flex justify-center pb-4">
                <button 
                  onClick={processAI}
                  disabled={symptoms.length === 0}
                  className="bg-emerald-accent text-forest px-12 py-4 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 focus:bg-emerald-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all"
                >
                  Analyze Dosha <ArrowRight />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* === STEP 2: Loading State === */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center flex-col"
          >
            <div className="w-32 h-32 relative mb-8">
              <div className="absolute inset-0 border-4 border-emerald-accent/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-accent rounded-full border-t-transparent animate-spin"></div>
              <Activity className="absolute inset-0 m-auto text-emerald-accent" size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-cream mb-2">Analyzing Dosha Matrix</h2>
            <p className="text-emerald-accent/60">Cross-referencing 5,000+ years of Ayurvedic intelligence...</p>
          </motion.div>
        )}

        {/* === STEP 3 & 4: Diagnosis Results === */}
        {step === 3 && diagnosis && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-cream mb-4">Your AI Diagnosis</h1>
              <button 
                onClick={speakDiagnosis}
                className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              >
                <Volume2 size={16} /> Listen to Result
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Card */}
              <div className="lg:col-span-1 bg-moss/40 border border-white/5 rounded-[30px] p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-accent/10 rounded-full blur-3xl"></div>
                <h3 className="text-sm uppercase tracking-widest text-emerald-accent/60 font-bold mb-2">Dominant Imbalance</h3>
                <h2 className="text-5xl font-display font-bold text-emerald-accent mb-6">{diagnosis.dosha}</h2>
                <p className="text-cream/80 text-lg leading-relaxed">{diagnosis.reason}</p>
              </div>

              {/* Details column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-forest/60 border border-white/5 rounded-[30px] p-8 flex-1">
                  <h3 className="text-xl font-display font-bold text-cream mb-4 flex items-center gap-2"><AlertCircle className="text-rose-400"/> Primary Health Issues</h3>
                  <ul className="space-y-3">
                    {diagnosis.issues.map((i, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-cream/70"><span className="w-1.5 h-1.5 rounded-full bg-rose-400/50"></span> {i}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-forest/60 border border-white/5 rounded-[30px] p-8 flex-1">
                  <h3 className="text-xl font-display font-bold text-cream mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-400"/> Recommended Remedies</h3>
                  <ul className="space-y-3">
                    {diagnosis.remedies.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-cream/70"><span className="w-1.5 h-1.5 rounded-full bg-green-400/50"></span> {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button onClick={() => setStep(4)} className="bg-emerald-accent text-forest px-10 py-4 rounded-full text-lg font-bold flex items-center gap-2 hover:bg-emerald-accent/90 transition-all">
                Continue to Diet Plan <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* === STEP 5: Food Scanner === */}
        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
          >
            <div className="w-24 h-24 bg-emerald-accent/10 rounded-full flex items-center justify-center mb-6">
              <Coffee className="text-emerald-accent" size={40} />
            </div>
            <h1 className="text-4xl font-display font-bold text-cream mb-4">Analyze Your Meal</h1>
            <p className="text-emerald-accent/60 mb-10 text-lg">
              Upload a picture of your food. Our AI will analyze its calories, macronutrients, and suitability for your <strong>{diagnosis?.dosha || 'body'}</strong> dosha.
            </p>

            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />

            {isProcessing ? (
               <div className="flex flex-col items-center gap-4">
                 {imagePreview && (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2">
                       <img src={imagePreview} alt="Food Preview" className="w-full h-full object-cover" />
                    </div>
                 )}
                 <div className="w-12 h-12 border-4 border-emerald-accent border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-cream font-bold">Scanning nutrients...</p>
               </div>
            ) : (
              <div className="flex gap-4 flex-col md:flex-row">
                <button 
                  onClick={() => setStep(7)} // Skip to routine
                  className="px-8 py-4 rounded-full font-bold text-emerald-accent/60 hover:text-emerald-accent transition-colors"
                >
                  Skip for now
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-accent text-forest px-10 py-4 rounded-full text-lg font-bold shadow-2xl flex items-center justify-center gap-3 hover:bg-emerald-accent/90 transition-all hover:-translate-y-1"
                >
                  <Upload size={20} /> Upload Food Image
                </button>
              </div>
            )}
            
            {foodError && (
              <p className="text-rose-400 mt-6 font-bold">{foodError}</p>
            )}
          </motion.div>
        )}

        {/* === STEP 7: Final Routine === */}
        {step === 7 && dietPlan && diagnosis && (
          <motion.div 
            key="step7"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-display font-bold text-cream mb-4">Your Personalized Routine</h1>
              <p className="text-emerald-accent/60 text-lg">Optimized for balancing {diagnosis.dosha}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-accent/20 before:to-transparent">
              
              {[
                { time: "07:00 AM", title: "Morning Detox", desc: dietPlan.morning },
                { time: "09:00 AM", title: "Nourishing Breakfast", desc: dietPlan.breakfast },
                { time: "01:30 PM", title: "Balanced Lunch", desc: dietPlan.lunch },
                { time: "05:00 PM", title: "Herbal Evening", desc: dietPlan.evening },
                { time: "08:00 PM", title: "Light Dinner", desc: dietPlan.dinner },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-forest shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <div className="w-3 h-3 bg-emerald-accent rounded-full"></div>
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-moss/40 border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-emerald-accent font-bold text-sm bg-emerald-accent/10 px-2.5 py-1 rounded-full">{item.time}</span>
                      <h3 className="font-bold text-cream">{item.title}</h3>
                    </div>
                    <p className="text-cream/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center pb-10">
              <button onClick={() => window.location.href='/dashboard'} className="bg-emerald-accent text-forest px-10 py-4 rounded-full font-bold shadow-lg hover:bg-emerald-accent/90 transition-all inline-block hover:scale-105">
                Save to Dashboard
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* AI Food Analysis Modal */}
      <AnimatePresence>
        {showFoodModal && foodAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowFoodModal(false); setStep(7); }}></div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-forest border border-emerald-accent/30 rounded-[30px] p-8 max-w-lg w-full shadow-2xl z-10"
            >
               <button 
                 onClick={() => { setShowFoodModal(false); setStep(7); }}
                 className="absolute top-4 right-4 text-emerald-accent/60 hover:text-emerald-accent"
               >
                 ✕
               </button>
               
               <h2 className="text-3xl font-display font-bold text-cream mb-6 text-center">Nutrition Report</h2>
               
               {imagePreview && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img src={imagePreview} alt="Dish" className="w-full h-full object-cover" />
                  </div>
               )}

               <div className="space-y-4">
                 <p className="text-2xl font-bold text-cream text-center mb-6">{foodAnalysis.food_name}</p>
                 
                 <div className="flex justify-between items-center bg-moss/50 p-4 rounded-xl border border-white/5">
                   <span className="text-emerald-accent/80 font-bold">Approx Calories</span>
                   <span className="text-yellow-400 font-bold text-xl">{foodAnalysis.calories}</span>
                 </div>
                 
                 <div className="flex justify-between items-center bg-moss/50 p-4 rounded-xl border border-white/5">
                   <span className="text-emerald-accent/80 font-bold">Health Category</span>
                   <span className="text-blue-400 font-bold text-lg">{foodAnalysis.health_category || foodAnalysis.health_rating || "Unknown"}</span>
                 </div>

                 <div className="flex justify-between items-center bg-moss/50 p-4 rounded-xl items-start border border-white/5">
                   <span className="text-emerald-accent/80 font-bold shrink-0">Ayurvedic Nature</span>
                   <span className="text-rose-400 font-bold text-right pl-4">{foodAnalysis.ayurvedic_nature || "Neutral"}</span>
                 </div>
                 
                 {(foodAnalysis.suggestion || foodAnalysis.protein) && (
                   <p className="text-sm text-cream/70 italic text-center mt-4 border-t border-white/5 pt-4">
                     "{foodAnalysis.suggestion || 'Good choice for a balanced diet.'}"
                   </p>
                 )}
               </div>

               <button 
                 onClick={() => { setShowFoodModal(false); setStep(7); }}
                 className="w-full bg-emerald-accent text-forest mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-accent/90 transition-all shadow-xl"
               >
                 View Full Daily Routine <ArrowRight size={20} />
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
