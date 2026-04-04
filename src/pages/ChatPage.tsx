import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User as UserIcon, Paperclip, Image, X, FileText } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

export default function ChatPage({ user }: { user: FirebaseUser | null }) {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string, attachments?: {name: string, type: string, preview?: string}[]}[]>([
    { role: 'assistant', content: "Namaste 🙏 I am your Ayurvedic AI assistant. Describe your symptoms, diet, or health concerns, and I will provide natural holistic insights.\n\nYou can also attach photos of herbs, skin conditions, or food items for analysis!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<{file: File, preview?: string}[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newAttachments = files.map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        file,
        preview: isImage ? URL.createObjectURL(file) : undefined
      };
    });
    setAttachments(prev => [...prev, ...newAttachments].slice(0, 3)); // max 3 files
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

    setMessages(prev => [...prev, { role: 'user', content: userMessage || '📎 Sent attachments', attachments: currentAttachments }]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      // Build message with attachment context
      let fullMessage = userMessage;
      if (currentAttachments.length > 0) {
        const fileDesc = currentAttachments.map(a => `[Attached ${a.type}: ${a.name}]`).join(', ');
        fullMessage = `${fullMessage}\n\n${fileDesc}\n\nNote: The user has attached files. Since you cannot view the files directly, please acknowledge them and provide relevant Ayurvedic guidance based on the description provided. Ask the user to describe what's in the image if needed.`;
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
      console.error("Chat error:", err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-44 px-4 pb-0 max-w-4xl mx-auto flex flex-col h-screen">
      <div className="fixed inset-0 -z-10" style={{backgroundImage: "url('/bg-page-dash.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(5,10,15,0.94) 0%, rgba(2,10,8,0.92) 100%)'}} />
      </div>
      <header className="mb-6 mt-4 text-center shrink-0">
        <h1 className="text-3xl font-display font-bold text-cream">AI Ayurvedic Assistant</h1>
        <p className="text-emerald-accent/60 text-sm">Ask me about your health, diet, or Ayurvedic remedies</p>
      </header>

      <div className="flex-1 bg-moss/20 border border-white/5 rounded-t-[40px] p-4 md:p-8 flex flex-col overflow-hidden relative shadow-2xl">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-accent/20 text-emerald-accent' : 'bg-blue-400/20 text-blue-400'}`}>
                {msg.role === 'user' ? <UserIcon size={18} /> : <Sparkles size={18} />}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                {/* Attachment Previews */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className={`flex gap-2 mb-2 flex-wrap ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.attachments.map((att, j) => (
                      <div key={j} className="rounded-xl overflow-hidden border border-white/10">
                        {att.type === 'image' && att.preview ? (
                          <img src={att.preview} alt={att.name} className="w-32 h-32 object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 bg-forest/60 px-3 py-2 text-xs text-cream">
                            <FileText size={14} className="text-emerald-accent" /> {att.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className={`p-4 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-emerald-accent text-forest font-medium rounded-tr-none' : 'bg-forest/60 text-cream border border-white/5 shadow-md rounded-tl-none leading-relaxed'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 flex-row">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-400/20 text-blue-400">
                <Sparkles size={18} className="animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-forest/40 border border-white/5 flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-accent/60 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-accent/60 animate-bounce delay-75" />
                <span className="w-2 h-2 rounded-full bg-emerald-accent/60 animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Attachment Preview Strip */}
        {attachments.length > 0 && (
          <div className="flex gap-2 pt-3 flex-wrap">
            {attachments.map((att, i) => (
              <div key={i} className="relative group">
                {att.preview ? (
                  <img src={att.preview} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-forest/60 border border-white/10 flex items-center justify-center">
                    <FileText size={20} className="text-emerald-accent/60" />
                  </div>
                )}
                <button onClick={() => removeAttachment(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/5 flex gap-3 shrink-0 items-end">
          {/* Hidden file input */}
          <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx" onChange={handleFileSelect} className="hidden" />
          
          <button onClick={() => fileRef.current?.click()} className="w-12 h-14 rounded-2xl bg-forest/60 border border-white/10 flex items-center justify-center text-emerald-accent/60 hover:text-emerald-accent hover:border-emerald-accent/30 transition-colors shrink-0" title="Attach files">
            <Paperclip size={20} />
          </button>
          
          <textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Type your symptoms or questions..."
            className="flex-1 bg-forest/60 border border-white/10 rounded-2xl p-4 text-cream focus:border-emerald-accent outline-none resize-none h-14"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="bg-emerald-accent text-forest w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50 hover:bg-emerald-accent/90 shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
