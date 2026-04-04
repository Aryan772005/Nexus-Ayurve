import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
import DoctorCard from '../components/DoctorCard';
import { doctors } from '../data/doctors';
import { Search } from 'lucide-react';

export default function DoctorsPage({ user }: { user: FirebaseUser | null }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-48 px-6 pb-20 max-w-7xl mx-auto">
      <div className="fixed inset-0 -z-10" style={{backgroundImage: "url('/bg-page-shop.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(10,15,13,0.92) 0%, rgba(5,30,20,0.88) 100%)'}} />
      </div>
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Ayurvedic Experts</h1>
        <p className="text-emerald-accent/60 text-lg">Consult top-rated Indian doctors specializing in diverse Ayurvedic fields for just ₹1.</p>
        
        <div className="mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-accent/50" />
          <input 
            type="text" 
            placeholder="Search by name or specialization (e.g. Panchakarma)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-moss/30 border border-white/10 rounded-2xl text-cream focus:outline-none focus:border-emerald-accent"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDoctors.map((doc, i) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <DoctorCard 
              doctor={doc} 
              user={user} 
              onBookingSuccess={() => {}}
            />
          </motion.div>
        ))}
        {filteredDoctors.length === 0 && (
          <div className="col-span-full text-center py-20 text-emerald-accent/60">
            No doctors found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
