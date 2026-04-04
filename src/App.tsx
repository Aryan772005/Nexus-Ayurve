import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  User, 
  LogOut, 
  ChevronRight, 
  Activity, 
  ShieldCheck,
  Leaf,
  Sparkles,
  Phone
} from 'lucide-react';
import { auth, loginWithGoogle, logout, db } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, setDoc } from 'firebase/firestore';

// --- Types ---
interface HeartLog {
  heartRate: number;
  status: string;
  timestamp: string;
}

interface Appointment {
  id: string;
  name: string;
  problem: string;
  preferredDate: string;
}

interface AIResult {
  possibleDisease: string;
  ayurvedicSuggestion: string;
  precautions: string[];
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai' | 'appointments' | 'heart'>('dashboard');
  
  // State for features
  const [symptoms, setSymptoms] = useState('');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [heartRate, setHeartRate] = useState('');
  const [heartLogs, setHeartLogs] = useState<HeartLog[]>([]);
  const [heartLogMessage, setHeartLogMessage] = useState('');
  
  const [appointment, setAppointment] = useState({ name: '', age: '', problem: '', preferredDate: '' });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookingMessage, setBookingMessage] = useState('');
  const [aiSaveMessage, setAiSaveMessage] = useState('');

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (u) => {
        if (u) {
          // Sync user with Firestore directly
          try {
            await setDoc(doc(db, 'users', u.uid), {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              lastLogin: new Date().toISOString()
            }, { merge: true });
          } catch (err) {
            console.error("User sync failed:", err);
          }
        }
        setUser(u);
        setLoading(false);
      }, (error) => {
        console.error("Auth state change error:", error);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.error("Auth setup error:", err);
      setLoading(false);
    }
  }, []);

  // --- API Calls ---
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const token = await user?.getIdToken();
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      return res;
    } catch (err) {
      console.error(`Fetch error for ${url}:`, err);
      throw err;
    }
  };

  const handleAIAnalysis = async () => {
    if (!symptoms) return;
    setAiLoading(true);
    try {
      const res = await fetchWithAuth('/api/analyze-symptoms', {
        method: 'POST',
        body: JSON.stringify({ symptoms })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      alert("AI analysis failed. Please check if NVIDIA_API_KEY is correctly set in the backend.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogHeartRate = async () => {
    if (!heartRate || !user) return;
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
      setHeartRate('');
      setHeartLogMessage('Heart rate saved successfully!');
      setTimeout(() => setHeartLogMessage(''), 3000);
      fetchHeartHistory();
    } catch (err) {
      console.error("Heart rate logging failed:", err);
    }
  };

  const fetchHeartHistory = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'heart_logs'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => doc.data() as HeartLog);
      setHeartLogs(logs);
    } catch (err) {
      console.error("Failed to fetch heart history:", err);
    }
  };

  const handleBookAppointment = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        name: appointment.name,
        age: appointment.age,
        problem: appointment.problem,
        preferredDate: appointment.preferredDate
      });
      setBookingMessage('Appointment saved! Call 9475002048 to confirm.');
      setTimeout(() => setBookingMessage(''), 5000);
      setAppointment({ name: '', age: '', problem: '', preferredDate: '' });
      fetchAppointments();
    } catch (err) {
      console.error("Appointment booking failed:", err);
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      apps.sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime());
      setAppointments(apps);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHeartHistory();
      fetchAppointments();
    }
  }, [user]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-forest">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="text-emerald-accent w-12 h-12" />
      </motion.div>
    </div>
  );

  if (!user) return <LandingPage onLogin={loginWithGoogle} />;

  return (
    <div className="min-h-screen bg-forest flex flex-col md:flex-row text-cream">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-moss/40 border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="bg-emerald-accent p-2 rounded-xl">
            <Leaf className="text-forest w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gradient">Ayurcare+</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={20} />} label="Dashboard" />
          <NavItem active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<Sparkles size={20} />} label="AI Assistant" />
          <NavItem active={activeTab === 'heart'} onClick={() => setActiveTab('heart')} icon={<Heart size={20} />} label="Heart Logs" />
          <NavItem active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} icon={<Calendar size={20} />} label="Appointments" />
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border-2 border-emerald-accent/20" referrerPolicy="no-referrer" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-cream truncate">{user.displayName}</p>
              <p className="text-xs text-emerald-accent/60 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 text-emerald-accent/60 hover:text-rose-400 transition-colors text-sm font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <header className="mb-10">
                <h2 className="text-5xl font-display font-bold text-gradient mb-2">Welcome back, {user.displayName?.split(' ')[0]}</h2>
                <p className="text-emerald-accent/60 text-lg">Your holistic health journey continues today.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                  title="Heart Rate" 
                  value={heartLogs[0]?.heartRate ? `${heartLogs[0].heartRate} BPM` : 'No data'} 
                  subtitle={heartLogs[0]?.status || 'Start logging'}
                  icon={<Heart className="text-rose-400" />}
                  color="bg-rose-400/10"
                />
                <StatCard 
                  title="Next Appointment" 
                  value={appointments[0]?.preferredDate || 'None'} 
                  subtitle={appointments[0]?.name || 'Book a session'}
                  icon={<Calendar className="text-emerald-accent" />}
                  color="bg-emerald-accent/10"
                />
                <StatCard 
                  title="AI Health Score" 
                  value="Optimal" 
                  subtitle="Based on recent logs"
                  icon={<ShieldCheck className="text-blue-400" />}
                  color="bg-blue-400/10"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-moss/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl">
                  <h3 className="text-2xl font-display font-bold mb-6 text-gradient">Recent Heart Logs</h3>
                  <div className="space-y-4">
                    {heartLogs.slice(0, 5).map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-forest/40 rounded-3xl border border-white/5 hover:border-emerald-accent/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] ${log.status === 'normal' ? 'bg-emerald-accent' : 'bg-rose-400'}`} />
                          <span className="font-medium text-cream group-hover:text-emerald-accent transition-colors">{log.heartRate} BPM</span>
                        </div>
                        <span className="text-xs text-emerald-accent/40 font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {heartLogs.length === 0 && (
                      <div className="text-center py-16">
                        <Heart className="w-12 h-12 text-emerald-accent/10 mx-auto mb-4" />
                        <p className="text-emerald-accent/40">No logs yet. Start tracking your vitals.</p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="bg-moss/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl">
                  <h3 className="text-2xl font-display font-bold mb-6 text-gradient">Upcoming Appointments</h3>
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((app, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-forest/40 rounded-3xl border border-white/5 hover:border-emerald-accent/20 transition-all group">
                        <div>
                          <p className="font-bold text-cream group-hover:text-emerald-accent transition-colors">{app.name}</p>
                          <p className="text-xs text-emerald-accent/40">{app.problem}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-accent bg-emerald-accent/10 px-3 py-1.5 rounded-full border border-emerald-accent/10">{app.preferredDate}</span>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <div className="text-center py-16">
                        <Calendar className="w-12 h-12 text-emerald-accent/10 mx-auto mb-4" />
                        <p className="text-emerald-accent/40">No appointments yet. Book a session with an expert.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
              <div className="bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-accent/10 p-4 rounded-3xl">
                    <Sparkles className="text-emerald-accent w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold">AI Ayurvedic Assistant</h2>
                    <p className="text-emerald-accent/60">Describe your symptoms for a holistic analysis.</p>
                  </div>
                </div>

                <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. I have a mild headache and feel bloated after meals..."
                  className="w-full h-40 p-6 bg-forest/40 rounded-3xl border border-white/5 focus:ring-2 focus:ring-emerald-accent/20 resize-none text-cream placeholder:text-emerald-accent/20 mb-6 outline-none"
                />

                <button 
                  onClick={handleAIAnalysis}
                  disabled={aiLoading || !symptoms}
                  className="w-full bg-emerald-accent text-forest py-4 rounded-2xl font-bold text-lg hover:bg-emerald-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {aiLoading ? "Analyzing..." : "Get Ayurvedic Analysis"}
                </button>

                {aiResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 bg-emerald-accent/5 rounded-[32px] border border-emerald-accent/10">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-emerald-accent font-bold text-xl">Analysis Result</h4>
                      <button 
                        onClick={async () => {
                          if (!user || !aiResult) return;
                          try {
                            await addDoc(collection(db, 'health_analyses'), {
                              userId: user.uid,
                              symptoms,
                              possibleDisease: aiResult.possibleDisease,
                              ayurvedicSuggestion: aiResult.ayurvedicSuggestion,
                              precautions: aiResult.precautions,
                              timestamp: new Date().toISOString()
                            });
                            setAiSaveMessage('Analysis saved to your records!');
                            setTimeout(() => setAiSaveMessage(''), 3000);
                          } catch (err) {
                            console.error("Failed to save analysis:", err);
                          }
                        }}
                        className="text-xs font-bold text-emerald-accent bg-emerald-accent/10 px-4 py-2 rounded-full border border-emerald-accent/20 hover:bg-emerald-accent/20 transition-all"
                      >
                        Save Analysis
                      </button>
                    </div>

                    {aiSaveMessage && (
                      <p className="text-emerald-accent text-xs font-bold mb-4 animate-pulse">{aiSaveMessage}</p>
                    )}

                    <div className="space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Possible Condition</p>
                        <p className="text-cream text-lg">{aiResult.possibleDisease}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-1">Ayurvedic Suggestion</p>
                        <p className="text-cream italic leading-relaxed">{aiResult.ayurvedicSuggestion}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-accent/60 font-bold mb-2">Precautions</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {aiResult.precautions.map((p, i) => (
                            <li key={i} className="flex items-center gap-2 text-emerald-accent/80 text-sm">
                              <div className="w-1.5 h-1.5 bg-emerald-accent rounded-full" /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'heart' && (
            <motion.div key="heart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-sm">
                  <h2 className="text-3xl font-serif font-bold mb-2">Log Heart Rate</h2>
                  <p className="text-emerald-accent/60 mb-8">Track your pulse to monitor your Vata, Pitta, and Kapha balance.</p>
                  
                  <div className="relative mb-6">
                    <input 
                      type="number" 
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="BPM"
                      className="w-full text-6xl font-serif text-center py-10 bg-forest/40 rounded-3xl border border-white/5 focus:ring-0 text-cream outline-none"
                    />
                    <span className="absolute bottom-4 right-8 text-emerald-accent/20 font-bold">BPM</span>
                  </div>

                  <button 
                    onClick={handleLogHeartRate}
                    className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all"
                  >
                    Save & Log Measurement
                  </button>

                  {heartLogMessage && (
                    <p className="mt-4 text-center text-emerald-accent font-bold text-sm animate-bounce">{heartLogMessage}</p>
                  )}
                </div>

                <div className="bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-sm overflow-hidden flex flex-col">
                  <h3 className="text-xl font-serif font-bold mb-6">History</h3>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                    {heartLogs.map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-forest/40 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${log.status === 'normal' ? 'bg-emerald-accent/10 text-emerald-accent' : 'bg-rose-400/10 text-rose-400'}`}>
                            <Heart size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-cream">{log.heartRate} BPM</p>
                            <p className="text-[10px] uppercase tracking-widest text-emerald-accent/40">{log.status}</p>
                          </div>
                        </div>
                        <p className="text-xs text-emerald-accent/40">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-sm">
                  <h2 className="text-3xl font-serif font-bold mb-6">Book Session</h2>
                  <div className="space-y-4">
                    <Input label="Patient Name" value={appointment.name} onChange={(v) => setAppointment({...appointment, name: v})} />
                    <Input label="Age" type="number" value={appointment.age} onChange={(v) => setAppointment({...appointment, age: v})} />
                    <Input label="Health Concern" value={appointment.problem} onChange={(v) => setAppointment({...appointment, problem: v})} />
                    <Input label="Preferred Date" type="date" value={appointment.preferredDate} onChange={(v) => setAppointment({...appointment, preferredDate: v})} />
                    
                    <button 
                      onClick={handleBookAppointment}
                      className="w-full bg-emerald-accent text-forest py-4 rounded-2xl font-bold hover:bg-emerald-accent/90 transition-all mt-4"
                    >
                      Save & Request Appointment
                    </button>

                    {bookingMessage && (
                      <div className="mt-6 p-4 bg-emerald-accent/5 rounded-2xl border border-emerald-accent/10 flex items-center gap-3">
                        <Phone className="text-emerald-accent" size={20} />
                        <p className="text-emerald-accent font-medium text-sm">{bookingMessage}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                  <h3 className="text-xl font-serif font-bold px-4">Your Appointments</h3>
                  {appointments.map((app) => (
                    <div key={app.id} className="bg-moss/40 p-6 rounded-[32px] border border-white/5 shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-bold text-cream text-lg">{app.name}</p>
                        <p className="text-emerald-accent/60 text-sm">{app.problem}</p>
                        <div className="flex items-center gap-2 mt-2 text-emerald-accent font-medium text-xs">
                          <Calendar size={14} /> {app.preferredDate}
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            await deleteDoc(doc(db, 'appointments', app.id));
                            fetchAppointments();
                          } catch (err) {
                            console.error("Failed to delete appointment:", err);
                          }
                        }}
                        className="text-emerald-accent/20 hover:text-rose-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Subcomponents ---

function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-forest overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-accent/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-emerald-accent/5 rounded-full blur-[120px]" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-accent/10 text-emerald-accent text-sm font-bold mb-8 border border-emerald-accent/20"
          >
            <Sparkles size={16} /> AI-Powered Holistic Wellness
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-bold text-gradient leading-tight mb-8"
          >
            Ayurcare<span className="text-emerald-accent">+</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-emerald-accent/60 mb-12 leading-relaxed"
          >
            Ancient wisdom meets modern intelligence. Monitor your health, analyze symptoms, and book consultations with Ayurvedic experts.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onLogin}
            className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            Get Started <ChevronRight />
          </motion.button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-moss/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Sparkles className="text-emerald-accent" />}
            title="AI Symptom Checker"
            desc="Get instant Ayurvedic insights based on your symptoms using our advanced AI assistant."
          />
          <FeatureCard 
            icon={<Heart className="text-rose-400" />}
            title="Vitals Tracking"
            desc="Monitor your heart rate and vitals to understand your body's natural rhythm."
          />
          <FeatureCard 
            icon={<Calendar className="text-emerald-accent" />}
            title="Expert Consultations"
            desc="Book sessions with certified Ayurvedic practitioners for personalized care."
          />
        </div>
      </section>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
        active 
          ? 'bg-emerald-accent/10 text-emerald-accent shadow-sm border border-emerald-accent/10' 
          : 'text-emerald-accent/40 hover:text-emerald-accent/60 hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value, subtitle, icon, color }: { title: string, value: string, subtitle: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-moss/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl hover:border-emerald-accent/20 transition-all group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-accent/40 font-bold mb-2">{title}</p>
      <p className="text-3xl font-display font-bold text-cream mb-2">{value}</p>
      <p className="text-sm text-emerald-accent/20 font-medium">{subtitle}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-moss/40 backdrop-blur-xl p-12 rounded-[56px] border border-white/5 shadow-2xl hover:shadow-emerald-accent/5 transition-all group hover:-translate-y-2">
      <div className="mb-8 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-3xl font-display font-bold mb-6 text-gradient">{title}</h3>
      <p className="text-emerald-accent/60 leading-relaxed text-lg">{desc}</p>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string, value: any, onChange: (v: any) => void, type?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-emerald-accent/40 font-bold mb-2 px-2">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-forest/40 rounded-2xl border border-white/5 focus:ring-2 focus:ring-emerald-accent/20 text-cream outline-none"
      />
    </div>
  );
}
