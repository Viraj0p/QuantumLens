
import React, { useState, useRef, useEffect } from 'react';
import { chatWithQuantumExpert } from '../services/geminiService';
import { Icons } from '../constants';
import MathDisplay from './MathDisplay';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Greetings! I am QuantumLens AI. How can I assist you with your quantum physics inquiries today? Feel free to ask about wavefunctions, spin, or the standard model." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithQuantumExpert(input, messages);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "Apologies, my quantum coherence was disrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    return content.split(/(\$\$.*?\$\$|\$.*?\$)/gs).map((part, i) => {
      if (part.startsWith('$$')) {
        return <MathDisplay key={i} math={part.slice(2, -2)} block />;
      } else if (part.startsWith('$')) {
        return <MathDisplay key={i} math={part.slice(1, -1)} />;
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col p-4 md:p-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-sky-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {renderContent(msg.content)}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-transparent px-4 py-2 text-slate-200 focus:outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-xl transition-all disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
