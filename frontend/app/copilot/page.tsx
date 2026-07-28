"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  MessageSquare, 
  Plus, 
  Copy, 
  Check, 
  Building2, 
  Zap,
  TrendingDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  suggestions?: string[];
  metrics?: {
    saving?: string;
    impact?: string;
    score?: string;
  };
}

const INITIAL_SUGGESTIONS = [
  "Analyze current HVAC load on HQ Tower One",
  "How can we reduce energy costs in East Coast Plaza?",
  "Recommend dynamic setpoint optimizations",
  "Show peak demand forecast for tomorrow"
];

const INITIAL_CONVERSATION: Message[] = [
  {
    id: "1",
    sender: "copilot",
    text: "Hello! I am your Voltix Copilot. I have real-time access to your facility data, optimization setpoints, and carbon abatement logs. Ask me anything about your portfolio or request a dynamic optimization run.",
    timestamp: "10:00 AM"
  }
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_CONVERSATION);
  const [inputValue, setInputValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Simulate AI Copilot response
    setTimeout(() => {
      let aiText = "I've analyzed your query regarding your facility data. ";
      let suggestions: string[] | undefined = undefined;
      let metrics: Message["metrics"] = undefined;

      if (text.toLowerCase().includes("hvac") || text.toLowerCase().includes("hq tower")) {
        aiText += "HQ Tower One's HVAC systems are currently drawing 450 kW. The chiller array is operating at 88% capacity. I recommend shifting the cooling cycle forward by 45 minutes to avoid the 2:00 PM peak demand pricing window.";
        metrics = {
          saving: "12% Peak Save",
          impact: "$2,400 Monthly",
          score: "94/100 Health"
        };
        suggestions = ["Optimize HVAC schedules", "Download load profile report"];
      } else if (text.toLowerCase().includes("reduce") || text.toLowerCase().includes("optimize")) {
        aiText += "Based on historical load curves, implementing dynamic zone control in East Coast Plaza will reduce carbon emissions by approximately 4.5 tons and yield $1,200 in monthly savings.";
        metrics = {
          saving: "8% CO2 Drop",
          impact: "$1,200 Save",
          score: "85/100 Health"
        };
        suggestions = ["Apply East Coast Plaza Optimizations", "Compare with last month"];
      } else {
        aiText += "I've cross-referenced current load curves and weather profiles. Portfolio wide systems are operating nominally. East Coast Plaza requires attention due to a temperature deviation in Server Room Zone 4.";
        suggestions = ["View East Coast Plaza Alerts", "Show general load curves"];
      }

      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
        metrics
      };

      setMessages(prev => [...prev, copilotMsg]);
    }, 1000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNewChat = () => {
    setMessages(INITIAL_CONVERSATION);
  };

  return (
    <PageContainer>
      <SectionContainer>
        <PageHeader 
          title="Voltix Copilot"
          description="Interactive autonomous optimization assistant powered by Voltix AI."
          actions={
            <Button variant="outline" size="sm" onClick={startNewChat} className="bg-white gap-2 shadow-xs">
              <Plus className="w-4 h-4" /> New Session
            </Button>
          }
        />
      </SectionContainer>

      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]">
          
          {/* Conversation History Sidebar */}
          <div className="hidden lg:flex flex-col col-span-1 bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-xs p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider px-2">Active Session</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl cursor-pointer">
                <MessageSquare className="w-4 h-4 text-[#111827]" />
                <div className="truncate text-sm font-semibold text-[#111827]">
                  {messages.length > 1 ? messages[1].text : "Autonomous Portfolio Chat"}
                </div>
              </div>
            </div>
            <div className="border-t border-[#E5E7EB] pt-4">
              <div className="p-3 bg-[#F3F4F6] rounded-xl flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#6B7280]" />
                <div>
                  <div className="text-xs font-bold text-[#111827]">Voltix-Agent v2.4</div>
                  <div className="text-[10px] text-[#6B7280]">Fully Operational</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="col-span-1 lg:col-span-3 flex flex-col bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-xs h-full">
            
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar */}
                    {msg.sender === "copilot" && (
                      <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center shrink-0 shadow-xs">
                        <Bot className="w-4 h-4 text-[#111827]" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className="max-w-[80%] space-y-3">
                      <div className={`p-4 rounded-[20px] text-sm shadow-xs ${
                        msg.sender === "user" 
                          ? "bg-[#111827] text-white rounded-tr-none" 
                          : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] rounded-tl-none"
                      }`}>
                        <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                        <div className={`text-[10px] mt-2 flex items-center justify-between gap-4 ${
                          msg.sender === "user" ? "text-gray-400" : "text-[#6B7280]"
                        }`}>
                          <span>{msg.timestamp}</span>
                          {msg.sender === "copilot" && (
                            <button 
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="hover:text-[#111827] transition-colors p-0.5 rounded"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* AI Response Optimization Cards */}
                      {msg.metrics && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex flex-col justify-center shadow-xs">
                            <span className="text-[10px] font-semibold text-[#047857] flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" /> Save Rate
                            </span>
                            <span className="text-sm font-bold text-[#065F46] mt-0.5">{msg.metrics.saving}</span>
                          </div>
                          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex flex-col justify-center shadow-xs">
                            <span className="text-[10px] font-semibold text-[#1D4ED8] flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Impact
                            </span>
                            <span className="text-sm font-bold text-[#1E40AF] mt-0.5">{msg.metrics.impact}</span>
                          </div>
                          <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex flex-col justify-center shadow-xs">
                            <span className="text-[10px] font-semibold text-[#4B5563] flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> Health Score
                            </span>
                            <span className="text-sm font-bold text-[#111827] mt-0.5">{msg.metrics.score}</span>
                          </div>
                        </div>
                      )}

                      {/* Suggestions Chips inside message flow */}
                      {msg.suggestions && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(sug)}
                              className="text-xs bg-white hover:bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-full shadow-2xs font-medium transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center shrink-0 shadow-xs">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Prompts Block (Only shows if there's only one initial message) */}
            {messages.length === 1 && (
              <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#FAFAFA]">
                <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> Suggested Prompts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {INITIAL_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="text-left text-sm bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] p-3 rounded-xl shadow-2xs transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{sug}</span>
                      <Send className="w-3.5 h-3.5 text-[#6B7280]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-[#E5E7EB] bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Voltix Copilot to optimize systems..."
                  className="flex-1 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[14px] px-4 py-3 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="h-11 bg-[#111827] hover:bg-[#374151] text-white px-5 rounded-[14px]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
