import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle, X } from 'lucide-react';
import { Doctor } from '../data/doctors';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface DoctorCardProps {
  doctor: Doctor;
  user: FirebaseUser | null;
  onBookingSuccess: () => void;
}

export default function DoctorCard({ doctor, user, onBookingSuccess }: DoctorCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [showSimulatedPayment, setShowSimulatedPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [problem, setProblem] = useState('');
  const [date, setDate] = useState('');

  const initiateBooking = () => {
    if (!user) {
      alert("Please login to book a consultation.");
      return;
    }
    setIsBooking(true);
  };

  const handleSimulatedPayment = async () => {
    if (!problem || !date) {
      alert("Please fill in the problem and preferred date");
      return;
    }

    setShowSimulatedPayment(true);

    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'appointments'), {
          userId: user?.uid,
          name: user?.displayName,
          doctorId: doctor.id,
          doctorName: doctor.name,
          problem,
          preferredDate: date,
          amountPaid: 1,
          status: "Paid & Confirmed",
          createdAt: new Date().toISOString()
        });

        setShowSimulatedPayment(false);
        setIsBooking(false);
        setProblem('');
        setDate('');
        setShowSuccess(true); // 🎉 Show success modal
        onBookingSuccess();
      } catch (err) {
        console.error("Booking failed:", err);
        alert("Booking failed. Try again.");
        setShowSimulatedPayment(false);
      }
    }, 2000);
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      {/* ✅ Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #1b4332 0%, #0f2d1e 100%)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: '24px',
              padding: '40px 32px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.1)',
              animation: 'successPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(52,211,153,0.5)', padding: '4px',
              }}
            >
              <X size={18} />
            </button>

            {/* Animated check icon */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'iconPulse 1.5s ease-in-out infinite',
            }}>
              <CheckCircle style={{ color: '#34d399', width: '40px', height: '40px' }} />
            </div>

            <h2 style={{
              fontSize: '22px', fontWeight: 800, color: '#ecfdf5',
              marginBottom: '8px', letterSpacing: '-0.02em',
            }}>
              🎉 Appointment Booked!
            </h2>
            <p style={{ color: 'rgba(52,211,153,0.8)', fontSize: '14px', marginBottom: '24px' }}>
              Payment processed successfully
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.25)', borderRadius: '14px',
              padding: '16px', marginBottom: '24px', textAlign: 'left',
              border: '1px solid rgba(52,211,153,0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Doctor</span>
                <span style={{ color: '#ecfdf5', fontSize: '13px', fontWeight: 700 }}>{doctor.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Date</span>
                <span style={{ color: '#ecfdf5', fontSize: '13px', fontWeight: 700 }}>{formatDate(date)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Amount Paid</span>
                <span style={{ color: '#34d399', fontSize: '13px', fontWeight: 700 }}>₹1 ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Status</span>
                <span style={{
                  color: '#34d399', fontSize: '12px', fontWeight: 700,
                  background: 'rgba(52,211,153,0.15)', padding: '2px 10px',
                  borderRadius: '99px',
                }}>Confirmed ✓</span>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.5 }}>
              The doctor will contact you on your preferred date.<br />
              For support: <a href="mailto:aryansinghtariani@gmail.com" style={{ color: '#34d399' }}>aryansinghtariani@gmail.com</a>
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              style={{
                marginTop: '20px', width: '100%',
                background: 'linear-gradient(135deg, #34d399, #059669)',
                color: '#052e16', border: 'none', borderRadius: '12px',
                padding: '12px', fontSize: '14px', fontWeight: 800,
                cursor: 'pointer', transition: 'opacity 0.2s',
              }}
            >
              Done
            </button>
          </div>

          <style>{`
            @keyframes successPop {
              from { transform: scale(0.7); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes iconPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.3); }
              50% { box-shadow: 0 0 0 12px rgba(52,211,153,0); }
            }
          `}</style>
        </div>
      )}

      {/* Doctor Card */}
      <div className="bg-moss/40 border border-white/5 rounded-3xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 hover:border-emerald-accent/20">
        <div className="h-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent z-10" />
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <div className="flex items-center gap-1 bg-forest/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 text-xs font-bold text-cream">
              <Star className="text-emerald-accent" size={12} fill="currentColor" />
              {doctor.rating} <span className="opacity-60 font-normal">({doctor.reviews})</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-cream mb-1 flex items-center gap-2">
            {doctor.name} <ShieldCheck className="text-blue-400" size={16} />
          </h3>
          <p className="text-emerald-accent font-medium text-sm mb-4">{doctor.specialization}</p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-xs text-emerald-accent/60">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-accent/50" /> {doctor.experience} Experience
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-accent/60">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-accent/50" /> {doctor.languages.join(", ")}
            </div>
          </div>

          <p className="text-sm text-cream/70 line-clamp-3 mb-6 leading-relaxed">
            {doctor.about}
          </p>

          {!isBooking ? (
            <button
              onClick={initiateBooking}
              className="w-full bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 py-3 rounded-xl font-bold hover:bg-emerald-accent hover:text-forest transition-colors"
            >
              Consult for ₹1
            </button>
          ) : (
            <div className="space-y-3 bg-forest/50 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-emerald-accent">Consultation Request</p>
              <input
                type="text"
                placeholder="Primary health concern..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full p-2 bg-moss/50 rounded-lg text-sm text-cream border border-white/5 focus:border-emerald-accent focus:outline-none"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-moss/50 rounded-lg text-sm text-cream border border-white/5 focus:border-emerald-accent focus:outline-none"
              />

              {showSimulatedPayment ? (
                <div className="w-full bg-emerald-accent text-forest py-2 rounded-xl font-bold text-center text-sm animate-pulse opacity-80">
                  Processing ₹1 Payment...
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsBooking(false)}
                    className="w-1/3 border border-white/10 text-cream/70 py-2 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulatedPayment}
                    className="w-2/3 bg-emerald-accent text-forest py-2 rounded-xl font-bold text-sm hover:bg-emerald-accent/90 transition-colors"
                  >
                    Pay ₹1 & Book
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
