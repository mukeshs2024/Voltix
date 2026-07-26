'use client';

import React, { useState } from 'react';
import { Bot, User, Search, ArrowRight, BarChart2 } from 'lucide-react';
import { DemandChart } from '@/components/charts/DemandChart';

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello Mukesh. I am monitoring 8 buildings and all systems are healthy. How can I help you optimize the campus today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Fake response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I noticed a 15% increase in the Auditorium HVAC load starting at 8:00 AM. This correlates with a scheduled event. I recommend pre-cooling the space now to avoid peak tariff charges later.',
        showChart: true
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto border border-zinc-800 rounded-2xl overflow-hidden glass-card">
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-aiBlue/10 flex items-center justify-center border border-aiBlue/20">
               <Bot className="w-5 h-5 text-aiBlue" />
            </div>
            <div>
               <h2 className="font-semibold text-zinc-100 tracking-tight">Voltix Copilot</h2>
               <p className="text-[11px] text-zinc-500 font-mono">Powered by Voltix AI Engine v2.4</p>
            </div>
         </div>
         <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Online
         </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-300' : 'bg-aiBlue/10 text-aiBlue border border-aiBlue/20'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
             </div>
             <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-200 rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none shadow-sm'}`}>
                {msg.content}
                
                {(msg as any).showChart && (
                   <div className="mt-4 border-t border-zinc-800 pt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
                         <BarChart2 className="w-4 h-4" /> Supporting Data
                      </div>
                      <div className="h-48">
                         <DemandChart />
                      </div>
                      <div className="flex gap-2 mt-4">
                         <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-colors">Approve Pre-cooling</button>
                         <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-700 transition-colors">View Details</button>
                      </div>
                   </div>
                )}
             </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="relative">
           <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              type="text" 
              placeholder="Ask Voltix about campus energy..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
           />
           <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-aiBlue text-white rounded-lg hover:bg-blue-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
