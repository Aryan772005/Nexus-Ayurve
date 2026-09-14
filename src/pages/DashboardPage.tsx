import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Shield, Activity, Brain, Zap, Heart, TrendingUp, AlertTriangle, CheckCircle, Flame, Moon, ArrowRight, Clock,
  ReceiptText, BarChart2, Download, FileText, Eye,
  CreditCard, Package, Stethoscope,
  Calendar, IndianRupee, LayoutDashboard, Loader2,
  ShoppingBag, UserCircle } from 'lucide-react';
import { WellnessRing, MiniLineChart, RadarChart, HistoryChart } from '../components/dashboard/DashboardCharts';
import { BarChart, MultiLineChart, DonutChart } from '../components/dashboard/AnalyticsCharts';
import { useUserDashboard, DashInvoice } from '../hooks/useUserDashboard';
import { useNavigate } from 'react-router-dom';
import '../components/dashboard/dashboard.css';

// ─── Animated counter ───
function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.round(start));
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return val;
}

// ─── Invoice PDF Generator ───
function generateInvoicePDF(inv: DashInvoice, userName: string) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${inv.id.slice(0, 8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #10B981; padding-bottom: 20px; }
    .brand-name { font-size: 26px; font-weight: 800; }
    .brand-name span { color: #10B981; }
    .brand-sub { font-size: 11px; color: #6B7280; margin-top: 3px; }
    .inv-id { font-size: 20px; font-weight: 700; color: #10B981; }
    .inv-date { font-size: 12px; color: #6B7280; margin-top: 4px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; background: ${inv.status === 'paid' ? '#D1FAE5' : '#FEF3C7'}; color: ${inv.status === 'paid' ? '#065F46' : '#92400E'}; margin-top: 6px; }
    .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .billing-box { background: #F9FAFB; border-radius: 10px; padding: 16px; }
    .billing-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280; margin-bottom: 6px; }
    .billing-name { font-weight: 700; font-size: 14px; }
    .billing-detail { font-size: 12px; color: #6B7280; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #0A0F0D; color: #fff; }
    thead th { padding: 12px 14px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    tbody tr { border-bottom: 1px solid #E5E7EB; }
    tbody td { padding: 12px 14px; font-size: 13px; color: #374151; }
    .total-row td { font-weight: 700; color: #065F46; font-size: 14px; background: #F0FDF4; padding: 14px; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">🌿 Ayur<span>Care</span><sup style="font-size:12px;color:#10B981">+</sup></div>
      <div class="brand-sub">Holistic Ayurvedic Health & Wellness Platform</div>
      <div class="brand-sub">support@Nexus Ayurve.health | www.Nexus Ayurve.health</div>
    </div>
    <div style="text-align:right">
      <div class="inv-id">INV-${inv.id.slice(0, 8).toUpperCase()}</div>
      <div class="inv-date">${new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <span class="badge">${inv.status.toUpperCase()}</span>
    </div>
  </div>
  <div class="billing-grid">
    <div class="billing-box">
      <div class="billing-label">Billed To</div>
      <div class="billing-name">${userName || 'Valued Customer'}</div>
      <div class="billing-detail">Nexus Ayurve Member</div>
    </div>
    <div class="billing-box">
      <div class="billing-label">Service</div>
      <div class="billing-name">${inv.service}</div>
      ${inv.doctor ? `<div class="billing-detail">${inv.doctor}</div>` : ''}
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>
      ${inv.items.map(item => `<tr><td>${item.name}</td><td>${item.qty}</td><td style="text-align:right">₹${item.price.toLocaleString()}</td><td style="text-align:right">₹${(item.price * item.qty).toLocaleString()}</td></tr>`).join('')}
      <tr class="total-row"><td colspan="3" style="text-align:right">Total Amount</td><td style="text-align:right">₹${inv.amount.toLocaleString()}</td></tr>
    </tbody>
  </table>
  <div class="footer">
    <p>Thank you for choosing Nexus Ayurve. Computer-generated invoice — no signature required.</p>
    <p style="margin-top:6px">Queries: support@Nexus Ayurve.health | +91 1800-AYUR-CARE</p>
  </div>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) win.onload = () => { win.print(); URL.revokeObjectURL(url); };
}

// ─── Tab type ───
type Tab = 'overview' | 'analytics' | 'invoices';
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',  icon: <LayoutDashboard size={15} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
  { id: 'invoices',  label: 'Invoices',  icon: <ReceiptText size={15} /> },
];

// ─── Empty State Component ───
const EmptyState = ({ icon, title, sub, cta, onCta }: {
  icon: React.ReactNode; title: string; sub: string; cta?: string; onCta?: () => void;
}) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.08)' }}>
      <span className="text-emerald-accent/40">{icon}</span>
    </div>
    <h3 className="text-sm font-bold text-cream/60 mb-1">{title}</h3>
    <p className="text-xs text-cream/30 mb-4">{sub}</p>
    {cta && onCta && (
      <button onClick={onCta} className="px-5 py-2 rounded-xl bg-emerald-accent text-forest text-xs font-bold uppercase tracking-widest hover:bg-emerald-accent/90 transition-colors">
        {cta}
      </button>
    )}
  </div>
);

// ─── Main Dashboard ───
export default function DashboardPage({ user }: { user: FirebaseUser | null }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [previewInvoice, setPreviewInvoice] = useState<DashInvoice | null>(null);
  const [anomalyState, setAnomalyState] = useState<'stable' | 'alert'>('stable');

  // ── Real Firestore data ──
  const { invoices, stats, heartLogs, loading } = useUserDashboard(user?.uid);

  const userName = user?.displayName || 'Guest';
  const firstName = userName.split(' ')[0];

  // Animated counters from real stats
  const wellnessScore   = useCountUp(loading ? 0 : stats.wellnessScore);
  const heartRateVal    = useCountUp(loading ? 0 : (stats.latestHeartRate || 0));
  const streakVal       = useCountUp(loading ? 0 : stats.streak);
  const totalSpendVal   = useCountUp(loading ? 0 : stats.totalSpend);
  const sessionCountVal = useCountUp(loading ? 0 : stats.totalAppointments);
  const orderCountVal   = useCountUp(loading ? 0 : stats.totalOrders);

  useEffect(() => {
    const id = setInterval(() => setAnomalyState(s => s === 'stable' ? 'alert' : 'stable'), 9000);
    return () => clearInterval(id);
  }, []);

  // Chart data derived from real stats
  const barData = stats.monthlySpend.map(m => ({ label: m.month, value: m.amount, color: '#10B981' }));
  const heartTrend = stats.weeklyHeartRates;
  const heartLabels = stats.weekLabels;
  const metricDatasets = [
    { label: 'Heart Rate', data: heartTrend, color: '#F87171' },
    { label: 'Sessions',   data: stats.monthlySpend.map(m => m.sessions * 10), color: '#10B981' },
  ];

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => invoiceFilter === 'all' || inv.status === invoiceFilter);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] } });
  const slideIn = {
    initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 }, transition: { duration: 0.35 } };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-emerald-accent animate-spin mx-auto mb-4" />
          <p className="text-cream/50 text-sm">Loading your health data…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div {...fadeUp()} className="glass-card p-12 text-center max-w-sm">
          <UserCircle size={48} className="text-emerald-accent/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-cream mb-2">Sign In to View Dashboard</h2>
          <p className="text-cream/40 text-sm mb-6">Your personal health data, invoices, and analytics are waiting.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-xl bg-emerald-accent text-forest font-bold text-sm hover:bg-emerald-accent/90 transition-colors"
          >
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 md:pt-24 md:pb-20 px-4 md:px-6 max-w-[1440px] mx-auto">

      {/* Header */}
      <motion.div {...fadeUp()} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 mt-4 md:mt-6 gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-cream tracking-tight">
            Welcome, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-emerald-accent/50 text-[10px] md:text-sm mt-1 flex items-center gap-1.5 md:gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-accent animate-pulse" />
            {invoices.length > 0
              ? `${invoices.length} Record${invoices.length !== 1 ? 's' : ''} found — Live Firestore Sync`
              : 'No activity yet — Book a consultation to get started'}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-forest/40 border border-white/5 text-[9px] md:text-[11px] font-bold text-cream/60 backdrop-blur-md flex items-center gap-1.5 md:gap-2 uppercase tracking-widest">
            <Clock size={12} className="md:w-[14px] md:h-[14px] text-emerald-accent" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/5 border border-emerald-accent/20 flex items-center justify-center overflow-hidden shadow-xl shadow-emerald-accent/5">
            {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <Activity size={16} className="md:w-[20px] md:h-[20px] text-emerald-accent" />}
          </div>
        </div>
      </motion.div>

      {/* Tab Bar */}
      <motion.div {...fadeUp(0.05)} className="flex flex-nowrap gap-0.5 md:gap-1 mb-4 sm:mb-8 p-0.5 md:p-1 rounded-[14px] md:rounded-2xl bg-forest/60 border border-white/5 backdrop-blur-md w-full sm:w-fit overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => { setTab(t.id); setPreviewInvoice(null); }}
            className={`flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-emerald-accent text-forest shadow-lg shadow-emerald-accent/20' : 'text-cream/40 hover:text-cream/70'
            }`}
          >
            {t.icon}{t.label}
            {t.id === 'invoices' && invoices.length > 0 && (
              <span className="ml-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-accent/20 text-emerald-accent text-[9px] md:text-[10px] font-bold flex items-center justify-center">
                {invoices.length}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {tab === 'overview' && (
          <motion.div key="overview" {...slideIn}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Wellness Ring */}
              <motion.div {...fadeUp(0.05)} className="lg:col-span-8 glass-card relative overflow-hidden min-h-[300px] flex items-center justify-center">
                <div className="pulse-ring opacity-20" />
                <div className="pulse-ring opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-accent/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center py-8">
                  <WellnessRing score={wellnessScore} size={190} />
                  <div className="mt-6 text-center px-8">
                    <h2 className="text-2xl font-display font-bold text-cream">AI Wellness Index</h2>
                    <p className="text-xs text-emerald-accent/60 mt-1">
                      {stats.totalAppointments + stats.totalOrders > 0
                        ? `Derived from ${stats.totalAppointments} consultations & ${stats.totalOrders} orders`
                        : 'Book your first consultation to build your wellness score'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <span className={`smart-tag py-1 px-4 text-[10px] ${wellnessScore >= 80 ? 'green' : wellnessScore >= 60 ? 'gold' : 'red'}`}>
                      {wellnessScore >= 80 ? 'Optimal' : wellnessScore >= 60 ? 'Fair' : 'Needs Attention'}
                    </span>
                    {stats.totalAppointments > 0 && (
                      <span className="text-[10px] text-cream/30 font-bold uppercase tracking-widest">
                        {stats.totalAppointments} Session{stats.totalAppointments !== 1 ? 's' : ''} Tracked
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Heart Rate Trend */}
              <motion.div {...fadeUp(0.1)} className="lg:col-span-4 glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.1)' }}>
                    <Heart size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#F87171' }} />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Heart Trend</h3>
                </div>
                {heartLogs.length > 0 ? (
                  <>
                    <div className="text-center mb-3 md:mb-4">
                      <p className="text-3xl md:text-4xl font-bold text-cream">{heartRateVal}</p>
                      <p className="text-[10px] md:text-xs text-cream/30 mt-1">BPM — Latest reading</p>
                    </div>
                    <MiniLineChart data={heartLogs.slice(0, 7).reverse().map(l => l.heartRate)} color="#F87171" height={80} />
                    <div className="flex justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-[9px] md:text-[10px] text-cream/30">Avg</p>
                        <p className="text-xs md:text-sm font-bold text-cream">{stats.avgHeartRate} BPM</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] md:text-[10px] text-cream/30">Readings</p>
                        <p className="text-xs md:text-sm font-bold text-cream">{heartLogs.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] md:text-[10px] text-cream/30">Status</p>
                        <p className="text-xs md:text-sm font-bold text-emerald-accent">
                          {stats.avgHeartRate && stats.avgHeartRate >= 60 && stats.avgHeartRate <= 100 ? 'Normal' : 'Monitor'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon={<Heart size={20} className="md:w-[24px] md:h-[24px]" />}
                    title="No Heart Data Yet"
                    sub="Record your heart rate using the health tools"
                    cta="Log Heart Rate"
                    onCta={() => navigate('/tools')}
                  />
                )}
              </motion.div>

              {/* Stats Row */}
              {[
                { label: 'Consultations', value: `${sessionCountVal}`, iconEl: <Stethoscope size={14} className="md:w-[16px] md:h-[16px]" />, iconColor: '#60A5FA', bg: 'rgba(96,165,250,0.1)', desc: 'Total sessions', trend: stats.totalAppointments > 0 ? 'Paid & Verified' : 'Book one!', delay: 0.12 },
                { label: 'Orders', value: `${orderCountVal}`, iconEl: <ShoppingBag size={14} className="md:w-[16px] md:h-[16px]" />, iconColor: '#FBBF24', bg: 'rgba(245,158,11,0.1)', desc: 'Product orders', trend: stats.totalOrders > 0 ? `₹${stats.totalOrders * 100}+ est.` : 'Shop now', delay: 0.16 },
                { label: 'Streak', value: `${streakVal}d`, iconEl: <Zap size={14} className="md:w-[16px] md:h-[16px]" />, iconColor: '#34D399', bg: 'rgba(52,211,153,0.1)', desc: 'Active days', trend: streakVal > 0 ? '🔥 Keep going' : 'Start today', delay: 0.2 },
                { label: 'Wellness', value: `${wellnessScore}%`, iconEl: <TrendingUp size={14} className="md:w-[16px] md:h-[16px]" />, iconColor: '#A78BFA', bg: 'rgba(167,139,250,0.1)', desc: 'Score', trend: wellnessScore >= 80 ? '↑ Excellent' : '↑ Improving', delay: 0.24 },
              ].map((c, i) => (
                <motion.div key={i} {...fadeUp(c.delay)} className="lg:col-span-3 stat-widget p-3 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                      <span style={{ color: c.iconColor }}>{c.iconEl}</span>
                    </div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30">{c.label}</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-cream">{c.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[9px] md:text-[10px] text-emerald-accent/40">{c.desc}</p>
                    <span className="text-[9px] md:text-[10px] font-bold text-emerald-accent">{c.trend}</span>
                  </div>
                </motion.div>
              ))}

              {/* Dosha Radar */}
              <motion.div {...fadeUp(0.2)} className="lg:col-span-4 glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <Brain size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#FBBF24' }} />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Prakriti Hub</h3>
                </div>
                <div className="flex justify-center -mt-4">
                  <RadarChart vata={45} pitta={72} kapha={32} />
                </div>
                <div className="space-y-2 mt-4">
                  <p className="text-[9px] md:text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mb-2 md:mb-3">AI Suggestions</p>
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-forest/40 border border-white/5 flex items-center gap-2 md:gap-3">
                    <span className="text-lg md:text-xl">🌿</span>
                    <span className="text-[11px] md:text-xs text-cream/70">Warm Tulsi Tea for Pitta balance.</span>
                  </div>
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-forest/40 border border-white/5 flex items-center gap-2 md:gap-3">
                    <span className="text-lg md:text-xl">🫚</span>
                    <span className="text-[11px] md:text-xs text-cream/70">Morning ginger for Vata grounding.</span>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div {...fadeUp(0.25)} className="lg:col-span-8 glass-card p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)' }}>
                      <Activity size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#A78BFA' }} />
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Recent Activity</h3>
                  </div>
                  {invoices.length > 0 && (
                    <button
                      onClick={() => setTab('invoices')}
                      className="text-[10px] text-emerald-accent font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1"
                    >
                      View All <ArrowRight size={10} />
                    </button>
                  )}
                </div>
                {invoices.length > 0 ? (
                  <div className="space-y-2 md:space-y-3">
                    {invoices.slice(0, 5).map((inv, i) => (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-2 md:p-3 rounded-lg md:rounded-xl bg-forest/30 border border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: inv.type === 'consultation' ? 'rgba(96,165,250,0.1)' : 'rgba(245,158,11,0.1)' }}>
                            {inv.type === 'consultation'
                              ? <Stethoscope size={11} className="md:w-[13px] md:h-[13px]" style={{ color: '#60A5FA' }} />
                              : <ShoppingBag size={11} className="md:w-[13px] md:h-[13px]" style={{ color: '#FBBF24' }} />}
                          </div>
                          <div>
                            <p className="text-[11px] md:text-xs font-medium text-cream">{inv.service}</p>
                            <p className="text-[9px] md:text-[10px] text-cream/30">{new Date(inv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs md:text-sm font-bold text-cream">₹{inv.amount.toLocaleString()}</p>
                          <span className={`text-[8px] md:text-[9px] font-bold uppercase ${inv.status === 'paid' ? 'text-emerald-accent' : 'text-amber-400'}`}>
                            {inv.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<ReceiptText size={24} />}
                    title="No Activity Yet"
                    sub="Your consultations and orders will appear here"
                    cta="Book a Consultation"
                    onCta={() => navigate('/doctors')}
                  />
                )}
                <button
                  onClick={() => navigate('/health-coach')}
                  className="w-full mt-4 md:mt-6 py-3 md:py-4 rounded-xl bg-forest/40 border border-white/5 text-emerald-accent text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-emerald-accent/10 transition-all flex items-center justify-center gap-1.5 md:gap-2 group"
                >
                  Launch AI Health Blueprint 
                </button>
              </motion.div>

              {/* Anomaly Scan */}
              <motion.div {...fadeUp(0.3)} className={`lg:col-span-6 glass-card p-4 md:p-6 ${anomalyState === 'alert' ? 'anomaly-card alert' : 'anomaly-card stable'}`}>
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: anomalyState === 'alert' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' }}>
                    {anomalyState === 'alert' ? <AlertTriangle size={14} className="md:w-[16px] md:h-[16px] text-red-400" /> : <Shield size={14} className="md:w-[16px] md:h-[16px] text-emerald-accent" />}
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Neural Scan</h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={anomalyState} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="text-center py-6">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 border-2 ${anomalyState === 'alert' ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-accent/5 border-emerald-accent/20 breathe'}`}>
                      {anomalyState === 'alert' ? <Shield size={32} className="text-red-400" /> : <CheckCircle size={32} className="text-emerald-accent" />}
                    </div>
                    <h4 className={`text-xl font-display font-bold ${anomalyState === 'alert' ? 'text-red-400' : 'text-emerald-accent'}`}>
                      {anomalyState === 'alert' ? 'Anomaly Detected' : 'Vitals Stable'}
                    </h4>
                    <p className="text-xs text-cream/40 mt-2 max-w-[220px] mx-auto">
                      {anomalyState === 'alert'
                        ? stats.latestHeartRate && (stats.latestHeartRate < 60 || stats.latestHeartRate > 100)
                          ? `Heart rate ${stats.latestHeartRate} BPM is outside optimal range.`
                          : 'Irregular pattern detected. Consider scheduling a check-up.'
                        : 'All tracked biomarkers within standard Ayurvedic range.'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Spend Summary */}
              <motion.div {...fadeUp(0.35)} className="lg:col-span-6 glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <IndianRupee size={14} className="md:w-[16px] md:h-[16px] text-emerald-accent" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Spend Overview</h3>
                </div>
                {stats.totalSpend > 0 ? (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-4xl font-bold text-cream">₹{totalSpendVal.toLocaleString()}</p>
                      <p className="text-xs text-cream/30 mt-1">Total lifetime spend on Nexus Ayurve</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-forest/40 border border-white/5">
                        <p className="text-[10px] text-cream/30 uppercase tracking-widest mb-1">Consultations</p>
                        <p className="text-lg font-bold text-blue-400">₹{invoices.filter(i => i.type === 'consultation').reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-forest/40 border border-white/5">
                        <p className="text-[10px] text-cream/30 uppercase tracking-widest mb-1">Products</p>
                        <p className="text-lg font-bold text-amber-400">₹{invoices.filter(i => i.type === 'order').reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon={<IndianRupee size={24} />}
                    title="No Transactions Yet"
                    sub="Your spending history will appear here after your first booking"
                    cta="Book Consultation"
                    onCta={() => navigate('/doctors')}
                  />
                )}
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* ══════════════ ANALYTICS TAB ══════════════ */}
        {tab === 'analytics' && (
          <motion.div key="analytics" {...slideIn}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* KPI Cards */}
              {[
                { label: 'Total Spend',    value: `₹${totalSpendVal.toLocaleString()}`,   iconEl: <IndianRupee size={16} />, iconColor: '#34D399', bg: 'rgba(16,185,129,0.1)',   desc: 'Lifetime',    trend: stats.totalSpend > 0 ? 'From real data' : 'No spend yet',   delay: 0 },
                { label: 'Consultations',  value: `${sessionCountVal}`,                    iconEl: <Stethoscope size={16} />, iconColor: '#60A5FA', bg: 'rgba(96,165,250,0.1)',   desc: 'All time',    trend: stats.totalAppointments > 0 ? 'Paid & Confirmed' : 'Book one!', delay: 0.06 },
                { label: 'Orders',         value: `${orderCountVal}`,                      iconEl: <Package size={16} />,     iconColor: '#FBBF24', bg: 'rgba(245,158,11,0.1)',   desc: 'Purchased',   trend: stats.totalOrders > 0 ? 'Via Nexus Ayurve' : 'Shop now',         delay: 0.12 },
                { label: 'Wellness Score', value: `${wellnessScore}/100`,                  iconEl: <TrendingUp size={16} />,  iconColor: '#A78BFA', bg: 'rgba(167,139,250,0.1)', desc: 'Computed',    trend: wellnessScore >= 60 ? '↑ Good' : '↑ Improve',                  delay: 0.18 },
              ].map((c, i) => (
                <motion.div key={i} {...fadeUp(c.delay)} className="lg:col-span-3 stat-widget">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                      <span style={{ color: c.iconColor }}>{c.iconEl}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-cream/30">{c.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-cream">{c.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-emerald-accent/40">{c.desc}</p>
                    <span className="text-[10px] font-bold text-emerald-accent">{c.trend}</span>
                  </div>
                </motion.div>
              ))}

              {/* Monthly Spend Bar Chart */}
              <motion.div {...fadeUp(0.1)} className="lg:col-span-7 glass-card p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                      <BarChart2 size={14} className="md:w-[16px] md:h-[16px] text-emerald-accent" />
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Monthly Spend</h3>
                  </div>
                  <span className="smart-tag green text-[8px] md:text-[9px]">Real data</span>
                </div>
                {stats.totalSpend > 0 ? (
                  <BarChart data={barData} height={180} unit="₹" />
                ) : (
                  <EmptyState icon={<BarChart2 size={24} />} title="No Spend Data" sub="Data appears after your first consultation or order" />
                )}
              </motion.div>

              {/* Spend Breakdown Donut */}
              <motion.div {...fadeUp(0.15)} className="lg:col-span-5 glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <CreditCard size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#FBBF24' }} />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Spend Breakdown</h3>
                </div>
                {stats.totalSpend > 0 ? (
                  <DonutChart segments={stats.categoryBreakdown} size={180} />
                ) : (
                  <EmptyState icon={<CreditCard size={24} />} title="No Data Yet" sub="Breakdown appears once you have transactions" />
                )}
              </motion.div>

              {/* Heart Rate Trend (12-week) */}
              <motion.div {...fadeUp(0.2)} className="lg:col-span-12 glass-card p-4 md:p-6">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.1)' }}>
                      <Activity size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#F87171' }} />
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">12-Week Health Trend</h3>
                  </div>
                  <span className="smart-tag blue text-[9px]">{heartLogs.length} readings</span>
                </div>
                {heartLogs.length > 0 ? (
                  <MultiLineChart datasets={metricDatasets} labels={heartLabels} height={200} />
                ) : (
                  <EmptyState
                    icon={<Activity size={24} />}
                    title="No Heart Rate Data"
                    sub="Log your heart rate via Health Tools to see your weekly trend"
                    cta="Log Heart Rate"
                    onCta={() => navigate('/tools')}
                  />
                )}
              </motion.div>

              {/* Consultations by Month */}
              <motion.div {...fadeUp(0.25)} className="lg:col-span-6 glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.1)' }}>
                    <Calendar size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#60A5FA' }} />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Sessions / Month</h3>
                </div>
                {stats.totalAppointments > 0 ? (
                  <BarChart
                    data={stats.monthlySpend.map(m => ({ label: m.month, value: m.sessions, color: '#60A5FA' }))}
                    height={160}
                    label="Consultations per month"
                  />
                ) : (
                  <EmptyState icon={<Calendar size={20} className="md:w-[24px] md:h-[24px]" />} title="No Sessions Yet" sub="Book a consultation to track your visit history" />
                )}
              </motion.div>

              {/* Orders by Month */}
              <motion.div {...fadeUp(0.3)} className="lg:col-span-6 glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <ShoppingBag size={14} className="md:w-[16px] md:h-[16px]" style={{ color: '#FBBF24' }} />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-cream uppercase tracking-widest">Spend / Month</h3>
                </div>
                {stats.totalSpend > 0 ? (
                  <BarChart
                    data={stats.monthlySpend.map(m => ({ label: m.month, value: m.amount, color: '#FBBF24' }))}
                    height={160}
                    unit="₹"
                    label="Monthly spend"
                  />
                ) : (
                  <EmptyState icon={<ShoppingBag size={24} />} title="No Spend Data" sub="Order herbal products to track spending trends" />
                )}
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* ══════════════ INVOICES TAB ══════════════ */}
        {tab === 'invoices' && (
          <motion.div key="invoices" {...slideIn}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Summary KPIs */}
              {[
                { label: 'Total Records',  value: invoices.length,                                    iconEl: <FileText size={14} className="md:w-[16px] md:h-[16px]" />,   iconColor: '#34D399', bg: 'rgba(16,185,129,0.1)', delay: 0 },
                { label: 'Consultations',  value: invoices.filter(i => i.type === 'consultation').length, iconEl: <Stethoscope size={14} className="md:w-[16px] md:h-[16px]" />, iconColor: '#60A5FA', bg: 'rgba(96,165,250,0.1)', delay: 0.06 },
                { label: 'Product Orders', value: invoices.filter(i => i.type === 'order').length,    iconEl: <Package size={14} className="md:w-[16px] md:h-[16px]" />,    iconColor: '#FBBF24', bg: 'rgba(245,158,11,0.1)', delay: 0.12 },
                { label: 'Total Billed',   value: `₹${invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}`, iconEl: <IndianRupee size={14} className="md:w-[16px] md:h-[16px]" />, iconColor: '#A78BFA', bg: 'rgba(167,139,250,0.1)', delay: 0.18 },
              ].map((c, i) => (
                <motion.div key={i} {...fadeUp(c.delay)} className="lg:col-span-3 stat-widget p-3 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                      <span style={{ color: c.iconColor }}>{c.iconEl}</span>
                    </div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30">{c.label}</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-cream">{c.value}</p>
                </motion.div>
              ))}

              {/* Filter Chips */}
              <div className="lg:col-span-12 flex items-center gap-1.5 md:gap-3 flex-wrap">
                <span className="text-[10px] md:text-xs text-cream/40 uppercase tracking-widest">Filter:</span>
                {(['all', 'paid', 'pending'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setInvoiceFilter(f)}
                    className={`px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                      invoiceFilter === f
                        ? 'bg-emerald-accent text-forest'
                        : 'bg-forest/40 border border-white/5 text-cream/40 hover:text-cream/70'
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <span className="text-[10px] md:text-xs text-cream/20 ml-auto">
                  {filteredInvoices.length} record{filteredInvoices.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Invoice Table or Empty */}
              <motion.div {...fadeUp(0.1)} className="lg:col-span-12 glass-card overflow-hidden">
                {filteredInvoices.length === 0 ? (
                  <EmptyState
                    icon={<ReceiptText size={20} className="md:w-[28px] md:h-[28px]" />}
                    title={invoices.length === 0 ? 'No Invoices Generated Yet' : 'No matching records'}
                    sub={invoices.length === 0
                      ? 'Invoices are generated automatically after you pay for a consultancy or place an order.'
                      : 'Try changing the filter'}
                    cta={invoices.length === 0 ? 'Book Consultation for ₹1' : undefined}
                    onCta={() => navigate('/doctors')}
                  />
                ) : (
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[700px]">
                      {/* Table header */}
                      <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-forest/30">
                        <span className="col-span-1 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30">Type</span>
                        <span className="col-span-3 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30">Service</span>
                        <span className="col-span-2 md:col-span-3 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30">Doctor / Items</span>
                        <span className="col-span-2 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30">Date</span>
                        <span className="col-span-2 md:col-span-1 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30 text-right">Amount</span>
                        <span className="col-span-1 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30 text-center">Status</span>
                        <span className="col-span-1 text-[9px] md:text-[10px] uppercase tracking-widest text-cream/30 text-center">Actions</span>
                      </div>

                      {filteredInvoices.map((inv, i) => (
                        <motion.div
                          key={inv.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.015] transition-colors items-center"
                        >
                          {/* Type icon */}
                          <div className="col-span-1 flex items-center">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: inv.type === 'consultation' ? 'rgba(96,165,250,0.1)' : 'rgba(245,158,11,0.1)' }}>
                              {inv.type === 'consultation'
                                ? <Stethoscope size={11} className="md:w-[13px] md:h-[13px]" style={{ color: '#60A5FA' }} />
                                : <ShoppingBag size={11} className="md:w-[13px] md:h-[13px]" style={{ color: '#FBBF24' }} />}
                            </div>
                          </div>

                          {/* Service */}
                          <div className="col-span-3 flex items-center">
                            <div>
                              <p className="text-[11px] md:text-xs font-semibold text-cream leading-tight">{inv.service}</p>
                              <p className="text-[9px] md:text-[10px] text-cream/30 font-mono mt-0.5">INV-{inv.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                          </div>

                          {/* Doctor / Items */}
                          <div className="col-span-2 md:col-span-3 flex items-center">
                            <p className="text-[11px] md:text-xs text-cream/60 truncate">
                              {inv.type === 'consultation' ? inv.doctor : `${inv.items.length} item${inv.items.length !== 1 ? 's' : ''}`}
                            </p>
                          </div>

                          {/* Date */}
                          <div className="col-span-2 flex items-center">
                            <p className="text-[11px] md:text-xs text-cream/50">
                              {new Date(inv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>

                          {/* Amount */}
                          <div className="col-span-2 md:col-span-1 flex items-center justify-end">
                            <p className="text-[11px] md:text-sm font-bold text-cream">₹{inv.amount.toLocaleString()}</p>
                          </div>

                          {/* Status */}
                          <div className="col-span-1 flex items-center justify-center">
                            <span className={`smart-tag ${inv.status === 'paid' ? 'green' : 'gold'} text-[8px] md:text-[9px]`}>
                              {inv.status}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex items-center justify-center gap-1">
                            <button
                              onClick={() => setPreviewInvoice(previewInvoice?.id === inv.id ? null : inv)}
                              className="w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                              style={{ background: 'rgba(96,165,250,0.1)' }}
                              title="Preview"
                            >
                              <Eye size={10} className="md:w-[12px] md:h-[12px]" style={{ color: '#60A5FA' }} />
                            </button>
                            <button
                              onClick={() => generateInvoicePDF(inv, userName)}
                              className="w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                              style={{ background: 'rgba(16,185,129,0.1)' }}
                              title="Download PDF"
                            >
                              <Download size={10} className="md:w-[12px] md:h-[12px] text-emerald-accent" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Invoice Preview Panel */}
              <AnimatePresence>
                {previewInvoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="lg:col-span-12 glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                          <FileText size={16} className="text-emerald-accent" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-cream">Invoice Preview</h3>
                          <p className="text-[10px] text-cream/40 font-mono mt-0.5">INV-{previewInvoice.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateInvoicePDF(previewInvoice, userName)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-accent text-forest text-xs font-bold uppercase tracking-widest hover:bg-emerald-accent/90 transition-colors shadow-lg shadow-emerald-accent/20"
                      >
                        <Download size={13} /> Download PDF
                      </button>
                    </div>

                    {/* Preview card */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {/* Header */}
                      <div className="px-8 py-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                          <p className="text-xl font-display font-bold text-cream">🌿 Nexus Ayurve<span className="text-emerald-accent">+</span></p>
                          <p className="text-[11px] text-cream/40 mt-1">Holistic Ayurvedic Health & Wellness</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-accent font-mono">INV-{previewInvoice.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-[11px] text-cream/40 mt-1">{new Date(previewInvoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          <span className={`smart-tag ${previewInvoice.status === 'paid' ? 'green' : 'gold'} text-[9px] mt-1 inline-block`}>
                            {previewInvoice.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Billing */}
                      <div className="px-8 py-5 grid grid-cols-2 gap-6 border-b border-white/5">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-cream/30 mb-1">Billed To</p>
                          <p className="text-sm font-bold text-cream">{userName}</p>
                          <p className="text-xs text-cream/40">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-cream/30 mb-1">Service</p>
                          <p className="text-sm font-bold text-cream">{previewInvoice.service}</p>
                          {previewInvoice.doctor && <p className="text-xs text-cream/40">{previewInvoice.doctor}</p>}
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="px-8 py-5">
                        <div className="grid grid-cols-12 gap-4 mb-3">
                          <span className="col-span-6 text-[10px] uppercase tracking-widest text-cream/30">Item</span>
                          <span className="col-span-2 text-[10px] uppercase tracking-widest text-cream/30 text-center">Qty</span>
                          <span className="col-span-2 text-[10px] uppercase tracking-widest text-cream/30 text-right">Rate</span>
                          <span className="col-span-2 text-[10px] uppercase tracking-widest text-cream/30 text-right">Total</span>
                        </div>
                        {previewInvoice.items.map((item, i) => (
                          <div key={i} className="grid grid-cols-12 gap-4 py-3 border-t border-white/5">
                            <span className="col-span-6 text-xs text-cream/80">{item.name}</span>
                            <span className="col-span-2 text-xs text-cream/50 text-center">{item.qty}</span>
                            <span className="col-span-2 text-xs text-cream/50 text-right">₹{item.price.toLocaleString()}</span>
                            <span className="col-span-2 text-xs font-bold text-cream text-right">₹{(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="grid grid-cols-12 gap-4 py-4 border-t-2 mt-2" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                          <span className="col-span-10 text-xs font-bold text-cream text-right uppercase tracking-widest">Total Amount</span>
                          <span className="col-span-2 text-sm font-bold text-emerald-accent text-right">₹{previewInvoice.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
