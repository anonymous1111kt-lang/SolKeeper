import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';

export function AIChat({ tokenData }: { tokenData: any }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `Hi! I'm your AI Security Analyst. I've analyzed the live on-chain data for ${tokenData.tokenName}. What would you like to know?` }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, tokenData: tokenData })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', text: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered a network error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[400px] shadow-2xl">
      <div className="bg-gray-800/80 p-4 border-b border-gray-700 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 rounded-lg border border-purple-500/30">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">AI Security Analyst</h3>
          <p className="text-xs text-blue-400 font-medium">Strictly powered by live on-chain data</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none shadow-md'}`}>
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-sm text-gray-400">Reviewing ledger data...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-gray-900/80 border-t border-gray-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this token's specific risks..."
            className="w-full bg-gray-950 text-white rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 transition-colors shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
