import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Heart, Calendar, Activity, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateConsultationInvoice } from '../utils/generateInvoice';

export default function DashboardPage({ user }: { user: FirebaseUser }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [heartLogs, setHeartLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appq = query(collection(db, 'appointments'), where('userId', '==', user.uid));
        const appSnap = await getDocs(appq);
        setAppointments(appSnap.docs.map(d => ({id: d.id, ...d.data() as any})).sort((a: any, b: any) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime()));

        const heartq = query(collection(db, 'heart_logs'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
        const heartSnap = await getDocs(heartq);
        setHeartLogs(heartSnap.docs.map(d => d.data()));
        
        setLoading(false);
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="min-h-screen pt-48 px-6 flex justify-center"><div className="animate-spin w-12 h-12 border-4 border-emerald-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen pt-48 px-6 pb-20 max-w-7xl mx-auto">
      <div className="fixed inset-0 -z-10 bg-[url('/bg-page-dash.png')] bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-forest/90" />
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-2">Welcome back, {user.displayName?.split(' ')[0]}</h1>
        <p className="text-emerald-accent/60 text-lg">Here is your holistic health overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-xl">
          <div className="w-12 h-12 bg-rose-400/10 rounded-2xl flex items-center justify-center mb-4"><Heart className="text-rose-400" /></div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-accent/60 font-bold mb-2">Latest Heart Rate</p>
          <p className="text-3xl font-display font-bold text-cream">{heartLogs[0]?.heartRate ? `${heartLogs[0].heartRate} BPM` : 'No data'}</p>
        </div>
        <div className="bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-xl">
          <div className="w-12 h-12 bg-emerald-accent/10 rounded-2xl flex items-center justify-center mb-4"><Calendar className="text-emerald-accent" /></div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-accent/60 font-bold mb-2">Next Session</p>
          <p className="text-3xl font-display font-bold text-cream">{appointments[0]?.preferredDate || 'None'}</p>
        </div>
        <div className="bg-moss/40 p-8 rounded-[40px] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-4"><Activity className="text-blue-400" /></div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-accent/60 font-bold mb-2">Quick Action</p>
          <Link to="/chat" className="text-2xl font-display font-bold text-gradient flex items-center gap-2">Chat with AI <ArrowRight size={20} /></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-moss/20 p-8 rounded-[40px] border border-white/5">
          <h2 className="text-2xl font-display font-bold text-cream mb-6">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <div className="text-center py-10 opacity-50"><p>No appointments booked.</p></div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0,5).map(app => (
                <div key={app.id} className="bg-forest/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-cream">{app.doctorName || 'Doctor'}</h4>
                    <p className="text-xs text-emerald-accent/60 flex items-center gap-1"><Calendar size={12}/> {app.preferredDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 bg-emerald-accent/20 text-emerald-accent rounded-full border border-emerald-accent/30">{app.status}</span>
                    <button
                      onClick={() => generateConsultationInvoice({
                        patientName: user.displayName || 'Patient',
                        patientEmail: user.email || '',
                        doctorName: app.doctorName || 'Doctor',
                        specialization: 'Consultation',
                        problem: app.problem || 'Health Concern',
                        preferredDate: app.preferredDate,
                        amountPaid: app.amountPaid || 1,
                        bookingId: app.id,
                        createdAt: app.createdAt || new Date().toISOString(),
                      })}
                      className="p-1.5 bg-emerald-accent/10 text-emerald-accent rounded-lg border border-emerald-accent/20 hover:bg-emerald-accent/20 transition-colors flex items-center justify-center"
                      title="Download Invoice"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-moss/20 p-8 rounded-[40px] border border-white/5">
          <h2 className="text-2xl font-display font-bold text-cream mb-6">Recent Heart Logs</h2>
          {heartLogs.length === 0 ? (
            <div className="text-center py-10 opacity-50"><p>No logs recorded.</p></div>
          ) : (
             <div className="space-y-4">
              {heartLogs.slice(0,5).map((log, i) => (
                <div key={i} className="bg-forest/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Heart size={16} className={log.status === 'normal' ? 'text-emerald-accent' : 'text-rose-400'} />
                    <span className="font-bold text-cream">{log.heartRate} BPM</span>
                  </div>
                  <span className="text-xs text-emerald-accent/40">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
