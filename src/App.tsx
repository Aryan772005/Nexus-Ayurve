import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FloatingChatButton from './components/FloatingChatButton';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DoctorsPage from './pages/DoctorsPage';
import ToolsPage from './pages/ToolsPage';
import GuidesPage from './pages/GuidesPage';
import ChatPage from './pages/ChatPage';
import TopicPage from './pages/TopicPage';
import ShopPage from './pages/ShopPage';
import DiagnosisPage from './pages/DiagnosisPage';
import HealthCoachPage from './pages/HealthCoachPage';
import CalorieCheckerPage from './pages/CalorieCheckerPage';
import MealAnalysisPage from './pages/MealAnalysisPage';


export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    (window as any).showAuth = () => setShowAuth(true);
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
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
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-forest text-cream">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Leaf className="text-emerald-accent w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return (
        <div className="min-h-screen pt-24 text-center px-6">
          <h2 className="text-3xl font-display font-bold text-cream mb-4">Login Required</h2>
          <p className="text-emerald-accent/60 mb-8">Please sign in to access this page.</p>
          <button onClick={() => setShowAuth(true)} className="bg-emerald-accent text-forest px-8 py-3 rounded-full font-bold hover:bg-emerald-accent/90 transition-colors">
            Sign In
          </button>
        </div>
      );
    }
    return <>{children}</>;
  };

  const MainApp = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    return (
      <div className="min-h-screen flex flex-col bg-forest text-cream font-sans selection:bg-emerald-accent/20">
        <ScrollToTop />
        <Navbar user={user} onLogin={() => setShowAuth(true)} />
        
        <main className="flex-1 relative z-0">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage onLogin={() => setShowAuth(true)} user={user} />} />
              <Route path="/doctors" element={<DoctorsPage user={user} />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/topic/:id" element={<TopicPage />} />
              <Route path="/tools" element={<ToolsPage user={user} />} />
              <Route path="/shop" element={<ShopPage user={user} onLogin={() => setShowAuth(true)} />} />
              <Route path="/diagnosis" element={<DiagnosisPage user={user} />} />
              
              <Route path="/dashboard" element={<DashboardPage user={user!} />} />
              <Route path="/health-coach" element={<HealthCoachPage user={user} />} />
              <Route path="/calorie-checker" element={<CalorieCheckerPage />} />
              <Route path="/meal-analysis" element={<MealAnalysisPage />} />

              <Route path="/chat" element={<ChatPage user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <Footer />
        <FloatingChatButton />
        <FloatingWhatsAppButton />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}


