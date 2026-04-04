import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User as UserIcon } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

const NVIDIA_API_KEY = "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";

export default function ChatPage({ user }: { user: FirebaseUser | null }) {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: "Namaste 🙏 I am your Ayurvedic AI assistant. Describe your symptoms, diet, or health concerns, and I will provide natural holistic insights." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `As an Ayurvedic health assistant for Ayurcare+, analyze the following query and provide a helpful, detailed response. If the user describes symptoms, suggest possible Ayurvedic conditions, remedies, herbs, diet changes, and precautions. If the user asks about diet, yoga, or lifestyle, give Ayurvedic recommendations. Always be compassionate and professional.

User query: ${userMessage}

Respond in a friendly, informative way. Use bullet points for lists. Do NOT respond in JSON format - respond in natural, readable text.`;

      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: "You are a knowledgeable and compassionate Ayurvedic health assistant. Provide helpful advice based on Ayurvedic principles including dosha balancing, herbal remedies, yoga, pranayama, and diet recommendations. Always recommend consulting a qualified Ayurvedic doctor for serious conditions." },
            { role: "user", content: prompt }
          ],
          temperature: 0.4,
          top_p: 0.8,
          max_tokens: 1024,
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`NVIDIA API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

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
    <div className="min-h-screen pt-24 px-4 pb-0 max-w-4xl mx-auto flex flex-col h-screen">
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
              <div className={`p-4 max-w-[80%] rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-emerald-accent text-forest font-medium rounded-tr-none' : 'bg-forest/60 text-cream border border-white/5 shadow-md rounded-tl-none leading-relaxed'}`}>
                {msg.content}
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

        <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 shrink-0">
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
            disabled={isLoading || !input.trim()}
            className="bg-emerald-accent text-forest w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50 hover:bg-emerald-accent/90"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
