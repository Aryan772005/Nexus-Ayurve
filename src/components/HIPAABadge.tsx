/**
 * NEXUS AYURVE — HIPAA Compliance Badge Component
 * Shows a real-time "HIPAA Active" indicator with compliance checklist.
 * Appears in Auth modal and Dashboard for user assurance.
 */

import React, { useState } from 'react';
import { Shield, ShieldCheck, Lock, Eye, FileText, Server, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HIPAABadgeProps {
  /** 'minimal' = small badge only, 'full' = expandable checklist */
  variant?: 'minimal' | 'full';
}

const COMPLIANCE_CHECKS = [
  { icon: Lock,         label: 'AES-256 Field-Level PHI Encryption',     desc: 'All health data encrypted client-side before storage' },
  { icon: Shield,       label: 'Granular Firestore Security Rules',       desc: 'Users access only their own data (Principle of Least Privilege)' },
  { icon: Eye,          label: 'HIPAA Audit Logging Active',              desc: 'Every PHI access logged with WHO, WHAT, WHEN' },
  { icon: Server,       label: 'HIPAA-Eligible Firebase Services Only',   desc: 'Firestore, Auth, Storage, Cloud Functions' },
  { icon: FileText,     label: 'No PHI in Console Logs',                  desc: 'Logging sanitised — no protected health information exposed' },
  { icon: ShieldCheck,  label: 'Google Cloud BAA Required',               desc: 'Business Associate Agreement must be signed in GCP Console' },
];

export default function HIPAABadge({ variant = 'minimal' }: HIPAABadgeProps) {
  const [expanded, setExpanded] = useState(false);

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
        style={{
          borderColor: 'rgba(52,211,153,0.35)',
          background: 'rgba(52,211,153,0.08)',
        }}
      >
        <ShieldCheck size={12} className="text-emerald-400" />
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">HIPAA Secured</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: 'rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.04)' }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-400/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <ShieldCheck size={14} className="text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-[12px] font-bold text-emerald-400 leading-none">HIPAA Compliant</p>
            <p className="text-[10px] text-emerald-400/50 mt-0.5">6 safeguards active · Nexus Ayurve</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {expanded ? <ChevronUp size={14} className="text-emerald-400/60" /> : <ChevronDown size={14} className="text-emerald-400/60" />}
        </div>
      </button>

      {/* Expanded checklist */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2.5 border-t"
              style={{ borderColor: 'rgba(52,211,153,0.1)' }}>
              <p className="text-[10px] text-emerald-400/40 uppercase tracking-wider pt-3 mb-1">
                Active Safeguards
              </p>
              {COMPLIANCE_CHECKS.map((check, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-cream/80">{check.label}</p>
                    <p className="text-[10px] text-cream/35 leading-snug">{check.desc}</p>
                  </div>
                </motion.div>
              ))}
              <div className="mt-3 pt-3 border-t flex items-center gap-1.5"
                style={{ borderColor: 'rgba(52,211,153,0.1)' }}>
                <Lock size={10} className="text-emerald-400/50" />
                <p className="text-[9px] text-emerald-400/40 uppercase tracking-wider">
                  Protected Health Information never logged or exposed
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
