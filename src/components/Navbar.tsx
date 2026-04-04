import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import { auth, logout } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  user: FirebaseUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-moss/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-accent p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Leaf className="text-forest w-5 h-5" />
          </div>
          <span className="text-2xl font-display font-bold text-gradient">Ayurcare+</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-4">
              <Link to="/dashboard" className="text-cream hover:text-emerald-accent transition-colors">Dashboard</Link>
              <Link to="/doctors" className="text-cream hover:text-emerald-accent transition-colors">Consult</Link>
              <Link to="/tools" className="text-cream hover:text-emerald-accent transition-colors">Tools</Link>
              <Link to="/guides" className="text-cream hover:text-emerald-accent transition-colors">Guides</Link>
              <Link to="/chat" className="text-cream hover:text-emerald-accent transition-colors">AI Chat</Link>
            </div>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-emerald-accent/20" referrerPolicy="no-referrer" />
              <button 
                onClick={handleLogout}
                className="text-emerald-accent/60 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-sm font-medium text-emerald-accent/60">Log in to book sessions</span>
          </div>
        )}
      </div>
    </nav>
  );
}
