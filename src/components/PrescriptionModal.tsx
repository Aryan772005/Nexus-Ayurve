import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, CheckCircle2, ShieldCheck, FileText, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PrescriptionModal() {
  const { isPrescriptionOpen, closePrescription } = useCart();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isPrescriptionOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    const generatedId = 'RX-AYUR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setPhone('');
    setPatientName('');
    setSubmitted(false);
    closePrescription();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="absolute inset-0 bg-slate-900/65 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Upload Prescription</h3>
                <p className="text-xs text-slate-500">Fast doorstep delivery of genuine Ayurvedic medicines</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Upload Banner image & dropzone */}
                <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-5 text-center hover:bg-emerald-50/60 transition group cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img src={previewUrl} alt="Prescription preview" className="max-h-44 mx-auto rounded-xl object-contain border border-emerald-200 shadow-sm" />
                      <p className="text-xs font-bold text-emerald-800">{file?.name}</p>
                      <span className="text-[11px] text-emerald-600 underline">Tap to choose a different photo</span>
                    </div>
                  ) : file ? (
                    <div className="py-4 space-y-2">
                      <FileText size={36} className="mx-auto text-emerald-600" />
                      <p className="text-sm font-bold text-slate-800">{file.name}</p>
                      <p className="text-xs text-emerald-600">Prescription file attached</p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        Upload or Drag & Drop Prescription
                      </p>
                      <p className="text-xs text-slate-500">Supports JPG, PNG, or PDF up to 10MB</p>
                      <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs mt-2">
                        Browse Files
                      </span>
                    </div>
                  )}
                </div>

                {/* Patient & Phone Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (for updates)</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                </div>

                {/* 1mg Valid Prescription Guide */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertCircle size={14} />
                    Valid Prescription Guidelines:
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-amber-800/90 text-[11px]">
                    <li>Must mention Doctor's name, degree, and registration number</li>
                    <li>Clearly written medicine names, dosage & duration</li>
                    <li>Prescription must not be older than 6 months</li>
                  </ul>
                </div>

                {/* Trust guarantee */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Your prescription is confidential and verified solely by certified Ayurvedic Vaidyas.</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!file || phone.length < 10 || !patientName}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-98 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  Confirm & Upload Prescription <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* Success Confirmation */
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-display">Prescription Received!</h4>
                <div className="p-3 bg-slate-50 rounded-xl max-w-xs mx-auto border border-slate-200 text-xs text-slate-600">
                  Reference ID: <span className="font-mono font-bold text-emerald-700">{orderId}</span>
                </div>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-slate-900">{patientName}</span>! Our Ayurvedic pharmacist is reviewing your prescription. You will receive an SMS and WhatsApp message on <span className="font-semibold text-slate-900">+91 {phone}</span> with the itemized bill and delivery timeline shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition"
                  >
                    Done & Return to Store
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
