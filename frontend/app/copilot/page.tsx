"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Plus,
  Copy,
  Check,
  Building2,
  Zap,
  TrendingDown,
  Thermometer,
  Users,
  AlertTriangle,
  Cloud,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  typing?: boolean;
  suggestions?: string[];
  metrics?: { label: string; value: string; color: string }[];
}

const SUGGESTED_PROMPTS = [
  "Analyze current HVAC load on HQ Tower One",
  "How can we reduce energy costs this week?",
  "Show peak demand forecast for tomorrow",
  "What caused the Zone 3 temperature deviation?",
  "Recommend dynamic setpoint optimizations",
  "Summarize today's AI agent decisions",
];

const MOCK_RESPONSES: Record<string, { text: string; metrics?: Message["metrics"]; suggestions?: string[] }> = {
  default: {
    text: "I've cross-referenced current load curves and weather profiles. Portfolio-wide systems are operating nominally. East Coast Plaza requires attention due to a temperature deviation in Server Room Zone 4.",
    suggestions: ["View East Coast Plaza Alerts", "Show general load curves"],
  },
  hvac: {
    text: "HQ Tower One's HVAC systems are currently drawing 450 kW. The chiller array is operating at 88% capacity. I recommend shifting the cooling cycle forward by 45 minutes to avoid the 2:00 PM peak demand pricing window. This will reduce peak demand charges by an estimated 12%.",
    metrics: [
      { label: "Peak Save", value: "12%", color: "#22C55E" },
      { label: "Monthly Impact", value: "$2,400", color: "#3B82F6" },
      { label: "Health Score", value: "94/100", color: "#6366F1" },
    ],
    suggestions: ["Optimize HVAC schedules", "Download load profile report"],
  },
  energy: {
    text: "Based on historical load curves, implementing dynamic zone control in East Coast Plaza will reduce carbon emissions by approximately 4.5 tons and yield $1,200 in monthly savings. The AI Energy Agent has already flagged a tariff spike window at 14:00–16:00 today.",
    metrics: [
      { label: "CO2 Reduction", value: "4.5 tons", color: "#22C55E" },
      { label: "Monthly Save", value: "$1,200", color: "#3B82F6" },
      { label: "Tariff Risk", value: "High", color: "#EF4444" },
    ],
    suggestions: ["Apply East Coast Plaza Optimizations", "Compare with last month"],
  },
  agents: {
    text: "Today's AI agents have executed 99 decisions across 6 agents. The Occupancy Agent led with 34 decisions, primarily HVAC zone adjustments. The Energy Agent issued 1 warning due to a grid tariff spike. Supervisor consensus was achieved in all cases with an average agreement score of 91%.",
    metrics: [
      { label: "Total Decisions", value: "99", color: "#6366F1" },
      { label: "Consensus Rate", value: "100%", color: "#22C55E" },
      { label: "Avg Confidence", value: "90%", color: "#F59E0B" },
    ],
    suggestions: ["View AI Control Center", "Show decision timeline"],
  },
};

function getResponse(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("hvac") || lower.includes("hq tower") || lower.includes("chiller")) return MOCK_RESPONSES.hvac;
  if (lower.includes("energy") || lower.includes("cost") || lower.includes("tariff") || lower.includes("setpoint")) return MOCK_RESPONSES.energy;
  if (lower.includes("agent") || lower.includes("decision") || lower.includes("ai")) return MOCK_RESPONSES.agents;
  return MOCK_RESPONSES.default;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#9CA3AF]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  sender: "assistant",
  text: "Hello. I'm the Voltix Enterprise Assistant — your autonomous building intelligence interface. I have real-time access to your facility telemetry, AI agent decisions, energy tariffs, and optimization recommendations. How can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const id = `msg-${Date.now()}`;
    const userMsg: Message = {
      id,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const resp = getResponse(text);
      const assistantMsg: Message = {
        id: `${id}-resp`,
        sender: "assistant",
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metrics: resp.metrics,
        suggestions: resp.suggestions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1400);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <PageContainer>
      <SectionContainer>
        <PageHeader
          title="AI Copilot"
          description="Enterprise building intelligence assistant — powered by Voltix AI."
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setMessages([INITIAL_MESSAGE]); setInput(""); }}
              className="bg-white gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" /> New Session
            </Button>
          }
        />
      </SectionContainer>

      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ minHeight: 680 }}>

          {/* Left: Live Context Panel */}
          <div className="hidden lg:flex flex-col gap-4 col-span-1">
            {/* Live Building Context */}
            <Card className="p-4 flex-1">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">Live Building Context</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span className="text-xs text-[#6B7280]">Weather</span>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">28°C Sunny</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="text-xs text-[#6B7280]">Energy</span>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">450 kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span className="text-xs text-[#6B7280]">Occupancy</span>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span className="text-xs text-[#6B7280]">Avg Temp</span>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">22.4°C</span>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="text-xs text-[#6B7280]">Active Alerts</span>
                  </div>
                  <Badge variant="warning">3</Badge>
                </div>
                <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-3">
                  <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Current AI Decision</div>
                  <div className="text-xs text-[#111827] leading-snug">Zone 3 HVAC reduced 40% — low occupancy</div>
                </div>
              </div>
            </Card>

            {/* Recommendation Cards */}
            <Card className="p-4">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3 text-[#F59E0B]" /> Recommendations
              </div>
              <div className="space-y-2">
                {[
                  { text: "Pre-cool Zone 2 before 16:00", save: "180 kWh" },
                  { text: "Extend Zone 3 reduction 30 min", save: "45 kWh" },
                ].map((r, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(r.text)}
                    className="w-full text-left p-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl hover:bg-[#F3F4F6] transition-colors"
                  >
                    <div className="text-xs text-[#111827] font-medium leading-snug">{r.text}</div>
                    <div className="text-[10px] text-[#22C55E] font-semibold mt-0.5">{r.save}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Agent Status */}
            <Card className="p-4">
              <div className="flex items-center gap-2 p-2.5 bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl">
                <Bot className="w-4 h-4 text-[#22C55E]" />
                <div>
                  <div className="text-xs font-bold text-[#111827]">Voltix Assistant</div>
                  <div className="text-[10px] text-[#6B7280]">All systems operational</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse ml-auto" />
              </div>
            </Card>
          </div>

          {/* Right: Chat Interface */}
          <div className="col-span-1 lg:col-span-3 flex flex-col bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-soft" style={{ minHeight: 600 }}>

            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-3 bg-[#FAFAFA]">
              <div className="w-8 h-8 rounded-xl bg-[#111827] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#111827]">Voltix Enterprise Assistant</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-[10px] text-[#6B7280]">Online · Real-time building data</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", msg.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    {msg.sender === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-[#111827]" />
                      </div>
                    )}
                    <div className="max-w-[78%] space-y-2">
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm shadow-xs",
                        msg.sender === "user"
                          ? "bg-[#111827] text-white rounded-tr-none"
                          : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] rounded-tl-none"
                      )}>
                        <div className="leading-relaxed whitespace-pre-line">{msg.text}</div>
                        <div className={cn(
                          "text-[10px] mt-2 flex items-center justify-between gap-3",
                          msg.sender === "user" ? "text-gray-400" : "text-[#9CA3AF]"
                        )}>
                          <span>{msg.timestamp}</span>
                          {msg.sender === "assistant" && (
                            <button onClick={() => handleCopy(msg.id, msg.text)} className="hover:text-[#111827] transition-colors">
                              {copiedId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Metric Cards */}
                      {msg.metrics && (
                        <div className="grid grid-cols-3 gap-2">
                          {msg.metrics.map((m, i) => (
                            <div key={i} className="p-2.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xs text-center">
                              <div className="text-xs font-bold" style={{ color: m.color }}>{m.value}</div>
                              <div className="text-[9px] text-[#6B7280] mt-0.5">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestion Chips */}
                      {msg.suggestions && (
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(s)}
                              className="flex items-center gap-1 text-xs bg-white border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-full shadow-xs hover:bg-[#FAFAFA] transition-colors font-medium"
                            >
                              {s} <ChevronRight className="w-3 h-3 text-[#9CA3AF]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#111827]" />
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl rounded-tl-none shadow-xs">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Prompts — shown only on fresh session */}
            {messages.length === 1 && (
              <div className="px-5 py-4 border-t border-[#E5E7EB] bg-[#FAFAFA]">
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Suggested Prompts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(p)}
                      className="text-left text-xs bg-white border border-[#E5E7EB] text-[#111827] px-3 py-2.5 rounded-xl hover:bg-[#F9FAFB] transition-colors flex items-center justify-between gap-2 shadow-xs"
                    >
                      <span>{p}</span>
                      <Send className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-[#E5E7EB] bg-white">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about energy, occupancy, equipment, or AI decisions..."
                  className="flex-1 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[14px] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isTyping || !input.trim()}
                  className="h-11 px-5 rounded-[14px] shrink-0"
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
