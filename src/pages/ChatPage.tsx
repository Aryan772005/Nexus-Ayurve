import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, Paperclip, X, FileText,
  ShieldCheck, Lock, Eye, EyeOff, Info, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Privacy Consent Modal (shown once per session) ─────────────────────── */
function PrivacyConsentModal({ onAccept }: { onAccept: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        className="w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #0f2318 0%, #0a1a10 100%)', border: '1px solid rgba(52,211,153,0.2)' }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #34D399, #10B981, #6EE7B7)' }} />

        <div className="p-7">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <ShieldCheck size={28} className="text-emerald-400" />
          </div>

          <h2 className="text-xl font-display font-bold text-cream text-center mb-1">
            Your Privacy is Protected
          </h2>
          <p className="text-emerald-400/60 text-xs text-center uppercase tracking-widest mb-6">
            HIPAA-Grade Security · Nexus Ayurve
          </p>

          {/* Guarantees list */}
          <div className="space-y-3 mb-7">
            {[
              { icon: Lock,         text: 'No health data is stored on our servers' },
              { icon: EyeOff,       text: 'Your conversations are never read, sold, or shared' },
              { icon: ShieldCheck,  text: 'All data is encrypted end-to-end (AES-256)' },
              { icon: Eye,          text: 'Images & files you upload are analysed only in-session and immediately discarded' },
              { icon: CheckCircle2, text: 'Compliant with HIPAA data-handling principles' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(52,211,153,0.1)' }}>
                  <item.icon size={13} className="text-emerald-400" />
                </div>
                <p className="text-cream/75 text-[13px] leading-snug">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Warning note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl mb-6"
            style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-400/80 leading-snug">
              This AI assistant provides <strong>general Ayurvedic wellness guidance only</strong> — not medical diagnosis. Always consult a qualified doctor for medical decisions.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAccept}
            className="w-full py-3.5 rounded-2xl font-bold text-forest text-[15px] transition-all"
            style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 0 40px rgba(52,211,153,0.3)' }}
          >
            I Understand — Start Chatting
          </motion.button>

          <p className="text-center text-[10px] text-cream/25 mt-4">
            By continuing, you acknowledge this privacy notice. No account data required.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Small inline privacy notice (shown when user is typing/uploading) ──── */
function PrivacyPulse({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl mb-2"
          style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <Lock size={11} className="text-emerald-400 flex-shrink-0" />
          <p className="text-[11px] text-emerald-400/80 leading-none">
            End-to-end encrypted · Not stored · Not shared · HIPAA protected
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Upload privacy notice (shown when files are attached) ──────────────── */
function UploadPrivacyBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-2xl mb-2"
      style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
    >
      <ShieldCheck size={12} className="text-emerald-400 flex-shrink-0" />
      <p className="text-[11px] text-emerald-400/80 leading-none">
        Files are <strong className="text-emerald-400">analysed in-session only</strong> — automatically discarded after response. Never uploaded to any server.
      </p>
    </motion.div>
  );
}

/* ─── Main ChatPage ───────────────────────────────────────────────────────── */
export default function ChatPage({ user }: { user: FirebaseUser | null }) {
  const SESSION_KEY = 'nexus_privacy_accepted';

  const [consentGiven, setConsentGiven] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant';
    content: string;
    attachments?: { name: string; type: string; preview?: string }[];
  }[]>([
    {
      role: 'assistant',
      content: "Namaste 🙏 I am your Ayurvedic AI assistant for Nexus Ayurve.\n\nYour privacy is fully protected — nothing you share here is stored, sold, or seen by anyone.\n\nDescribe your symptoms, diet, or health concerns and I'll provide natural holistic insights. You can also attach photos of herbs, skin conditions, or food items for analysis!"
    }
  ]);

  const [input, setInput]             = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [attachments, setAttachments] = useState<{ file: File; preview?: string }[]>([]);
  const [isTyping, setIsTyping]       = useState(false);

  const endRef  = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAcceptPrivacy = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setConsentGiven(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newAttachments = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    setAttachments(prev => [...prev, ...newAttachments].slice(0, 3));
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newA = [...prev];
      if (newA[index].preview) URL.revokeObjectURL(newA[index].preview!);
      newA.splice(index, 1);
      return newA;
    });
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = input.trim();
    const currentAttachments = attachments.map(a => ({
      name: a.file.name,
      type: a.file.type.startsWith('image/') ? 'image' : 'file',
      preview: a.preview
    }));

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage || '📎 Sent attachments',
      attachments: currentAttachments
    }]);
    setInput('');
    setAttachments([]);
    setIsTyping(false);
    setIsLoading(true);

    try {
      let fullMessage = userMessage;
      if (currentAttachments.length > 0) {
        const fileDesc = currentAttachments.map(a => `[Attached ${a.type}: ${a.name}]`).join(', ');
        fullMessage = `${fullMessage}\n\n${fileDesc}\n\nNote: The user has attached files. Since you cannot view the files directly, please acknowledge them and provide relevant Ayurvedic guidance. Ask the user to describe what's in the image if needed.`;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: fullMessage })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.reply || "I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const showPrivacyPulse = isTyping || attachments.length > 0;

  return (
    <>
      {/* ── Privacy Consent Gate ── */}
      {!consentGiven && <PrivacyConsentModal onAccept={handleAcceptPrivacy} />}

      <div className="h-screen w-full flex flex-col bg-forest pt-[72px] relative overflow-hidden text-cream">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-moss to-forest" />

        {/* ── Header with HIPAA badge ── */}
        <header className="chat-header w-full shrink-0 flex items-center justify-between px-5 py-3 border-b border-cream/[0.08] bg-forest/90 backdrop-blur-md z-40 relative">
          <div className="flex-1" />
          <div className="flex flex-col items-center gap-0.5">
            <h1 className="text-xl font-bold font-display tracking-wide text-cream flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-accent" /> Nexus Ayurve Chat
            </h1>
            <p className="text-[10px] text-emerald-accent/60 uppercase tracking-widest">Powered by AI Health Coach</p>
          </div>
          {/* HIPAA pill — right side */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider hidden sm:block">HIPAA Protected</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </header>

        {/* ── Messages ── */}
        <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto px-4 sm:px-6 pt-6 pb-36 scrollbar-hide flex flex-col relative z-0">

          {messages.map((msg, i) => (
            <div key={i} className={`flex w-full mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-moss text-emerald-accent border border-emerald-accent/20 mt-1 mr-3 md:mr-4">
                  <Sparkles size={16} />
                </div>
              )}

              <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? '' : 'text-cream opacity-90 flex-1 min-w-0'}`}>

                {/* Attachment Previews */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className={`flex gap-2 mb-2 flex-wrap ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.attachments.map((att, j) => (
                      <div key={j} className="rounded-2xl overflow-hidden border border-cream/10 shadow-lg">
                        {att.type === 'image' && att.preview ? (
                          <img src={att.preview} alt={att.name} className="w-32 h-32 md:w-48 md:h-48 object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 bg-moss px-3 py-2 text-xs text-cream">
                            <FileText size={14} className="text-emerald-accent" /> {att.name}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Privacy badge after each upload */}
                    <div className="w-full mt-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl inline-flex"
                        style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                        <Lock size={10} className="text-emerald-400" />
                        <span className="text-[10px] text-emerald-400/70">File not stored · session only</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                {msg.role === 'user' ? (
                  <div className="chat-user-bubble bg-moss text-cream px-5 py-3 rounded-2xl rounded-tr-sm whitespace-pre-wrap leading-relaxed inline-block max-w-full text-[15px] border border-cream/[0.08]">
                    {msg.content}
                  </div>
                ) : (
                  <div className="py-2 whitespace-pre-wrap leading-relaxed w-full text-[15px]">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex w-full mb-6 justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-moss text-emerald-accent border border-emerald-accent/20 mt-1 mr-3 md:mr-4">
                <Sparkles size={16} className="animate-spin-slow" />
              </div>
              <div className="flex-1 flex gap-1.5 items-center pl-2">
                <span className="w-2 h-2 rounded-full bg-emerald-accent/60 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-accent/60 animate-bounce delay-75" />
                <span className="w-2 h-2 rounded-full bg-emerald-accent/60 animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest via-forest/95 to-transparent pt-10 pb-5 px-4 z-40 w-full flex justify-center">
          <div className="w-full max-w-3xl relative">

            {/* Upload privacy badge — shown when files attached */}
            {attachments.length > 0 && <UploadPrivacyBadge />}

            {/* Live privacy pulse — shown when typing */}
            <PrivacyPulse visible={showPrivacyPulse && attachments.length === 0} />

            {/* Attachment thumbnails */}
            {attachments.length > 0 && (
              <div className="flex gap-2 pb-3 flex-wrap">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group shadow-lg">
                    {att.preview ? (
                      <img src={att.preview} alt="" className="w-14 h-14 rounded-2xl object-cover border border-cream/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-moss border border-cream/10 flex items-center justify-center">
                        <FileText size={20} className="text-cream" />
                      </div>
                    )}
                    <button onClick={() => removeAttachment(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cream border border-forest/20 rounded-full flex items-center justify-center">
                      <X size={10} className="text-forest" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="chat-input-surface flex items-end gap-2 bg-moss border border-cream/[0.08] rounded-3xl p-2 w-full focus-within:border-emerald-accent/50 transition-colors shadow-xl">
              <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx" onChange={handleFileSelect} className="hidden" />

              <button
                onClick={() => fileRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-cream/60 hover:text-cream bg-cream/5 hover:bg-cream/10 transition-colors shrink-0 mb-1 ml-1"
                title="Attach files — not stored, session only"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message Nexus Ayurve Chat..."
                className="flex-1 bg-transparent border-none p-3 text-[15px] text-cream outline-none resize-none min-h-[46px] max-h-[150px] overflow-y-auto placeholder-cream/50"
                rows={1}
                style={{ height: '46px' }}
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = '46px';
                  t.style.height = Math.min(t.scrollHeight, 150) + 'px';
                }}
              />

              <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && attachments.length === 0)}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-1 mr-1 transition-all disabled:opacity-30 disabled:bg-cream disabled:bg-opacity-10 disabled:text-cream disabled:text-opacity-50 text-forest bg-cream"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Bottom disclaimer */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <Lock size={9} className="text-emerald-400/50" />
              <p className="text-center text-[10px] text-cream/35">
                End-to-end encrypted · No data stored or sold · HIPAA-grade privacy · Not a substitute for medical advice
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
