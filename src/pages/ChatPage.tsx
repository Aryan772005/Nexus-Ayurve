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
    <div className="h-screen w-full flex flex-col bg-forest pt-[72px] relative overflow-hidden text-cream">
      {/* Background that fits AyurCare theme but sleek */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-moss to-forest" />
      
      {/* Sleek Header */}
      <header className="w-full shrink-0 flex items-center justify-center py-4 border-b border-cream/5 bg-forest/90 backdrop-blur-md z-40 relative">
        <div className="flex flex-col items-center gap-1">
           <h1 className="text-xl font-bold font-display tracking-wide text-cream flex items-center gap-2">
             <Sparkles size={18} className="text-emerald-accent" /> Ayurcare Chat
           </h1>
           <p className="text-[10px] text-emerald-accent/60 uppercase tracking-widest">Powered by AI Health Coach</p>
        </div>
      </header>

      {/* Main chat area edge-to-edge */}
      <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto px-4 sm:px-6 pt-6 pb-32 scrollbar-hide flex flex-col relative z-0">
        
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
                </div>
              )}
              
              {/* Message Bubble/Text */}
              {msg.role === 'user' ? (
                <div className="bg-moss text-cream px-5 py-3 rounded-2xl rounded-tr-sm whitespace-pre-wrap leading-relaxed inline-block max-w-full text-[15px] border border-cream/5">
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

      {/* Input Area Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest via-forest/95 to-transparent pt-12 pb-6 px-4 z-40 w-full flex justify-center">
        
        <div className="w-full max-w-3xl relative">
          
          {/* Attachment Preview Strip above input */}
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

          <div className="flex items-end gap-2 bg-moss border border-cream/10 rounded-3xl p-2 w-full focus-within:border-emerald-accent/50 focus-within:bg-moss/90 transition-colors shadow-xl">
            {/* Hidden file input */}
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx" onChange={handleFileSelect} className="hidden" />
            
            <button 
              onClick={() => fileRef.current?.click()} 
              className="w-10 h-10 rounded-full flex items-center justify-center text-cream/60 hover:text-cream bg-cream/5 hover:bg-cream/10 transition-colors shrink-0 mb-1 ml-1" 
              title="Attach files"
            >
              <Paperclip size={18} />
            </button>
            
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder="Message Ayurcare Chat..."
              className="flex-1 bg-transparent border-none p-3 text-[15px] text-cream outline-none resize-none min-h-[46px] max-h-[150px] overflow-y-auto placeholder-cream/50"
              rows={1}
              style={{
                 height: "46px"
              }}
              onInput={(e) => {
                 const target = e.target as HTMLTextAreaElement;
                 target.style.height = "46px";
                 target.style.height = Math.min(target.scrollHeight, 150) + "px";
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
          
          <p className="text-center text-[10px] text-cream/40 mt-3 hidden md:block">
            Ayurcare Chat can make mistakes. Consider verifying important Ayurvedic and medical advice.
          </p>

        </div>
      </div>
    </div>
  );
}
