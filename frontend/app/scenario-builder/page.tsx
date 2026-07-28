"use client";

import React, { useState } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Save, 
  Trash2, 
  Plus, 
  Sliders, 
  Activity,
  Cpu, 
  Info,
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Volume2
} from "lucide-react";

interface WorkflowNode {
  id: string;
  name: string;
  type: "trigger" | "condition" | "action";
  status: "idle" | "running" | "success" | "error";
  description: string;
  config: Record<string, string>;
}

const DEFAULT_NODES: WorkflowNode[] = [
  {
    id: "node-1",
    name: "Occupancy Drops Below 30%",
    type: "trigger",
    status: "success",
    description: "Triggers when facility occupancy rate falls below a specified limit.",
    config: { threshold: "30%", target: "HQ Tower One" }
  },
  {
    id: "node-2",
    name: "Is Peak Demand Hours?",
    type: "condition",
    status: "success",
    description: "Evaluates if current time is within utility provider peak tariff windows.",
    config: { start: "14:00", end: "18:00" }
  },
  {
    id: "node-3",
    name: "Reduce HVAC Setpoints by 2°C",
    type: "action",
    status: "idle",
    description: "Dispatches commands to increase HVAC cooling target by 2°C for load shedding.",
    config: { delta: "+2.0°C", mode: "Eco" }
  }
];

export default function ScenarioBuilderPage() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(DEFAULT_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-1");
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "System: Scenario Editor loaded successfully."
  ]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
  };

  const handleUpdateConfig = (key: string, value: string) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(node => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          config: {
            ...node.config,
            [key]: value
          }
        };
      }
      return node;
    }));
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Simulation started...`]);

    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === "node-1" ? { ...n, status: "running" } : n));
      setSimulationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Trigger evaluated: Occupancy is 22% (Success)`]);
    }, 800);

    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === "node-2" ? { ...n, status: "running" } : n));
      setSimulationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Condition evaluated: Current time falls in peak window (Success)`]);
    }, 1600);

    setTimeout(() => {
      setNodes(prev => prev.map(n => {
        if (n.id === "node-3") return { ...n, status: "success" };
        if (n.type === "trigger" || n.type === "condition") return { ...n, status: "success" };
        return n;
      }));
      setSimulationLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Action executed: Dispatched Eco Setpoints (+2.0°C) to HQ Tower One`,
        `[${new Date().toLocaleTimeString()}] Simulation completed successfully. Estimated savings: 45 kWh.`
      ]);
      setIsRunning(false);
    }, 2400);
  };

  const handleAddNode = (type: "trigger" | "condition" | "action") => {
    const newId = `node-${Date.now()}`;
    const name = type === "trigger" ? "New Sensor Trigger" : type === "condition" ? "New Parameter Check" : "New Device Control";
    const newNode: WorkflowNode = {
      id: newId,
      name,
      type,
      status: "idle",
      description: `Customize parameters in the right properties panel.`,
      config: type === "trigger" ? { sensor: "Temperature" } : type === "condition" ? { value: "85" } : { action: "Power Off" }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  return (
    <PageContainer>
      <SectionContainer>
        <PageHeader 
          title="Scenario Builder"
          description="Design, test, and dispatch custom autonomous building optimization strategies."
          actions={
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRunSimulation} 
                disabled={isRunning}
                className="bg-white gap-2 shadow-xs"
              >
                <Play className="w-4 h-4 text-green-600" /> Run Simulation
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-[#111827] hover:bg-[#374151] text-white border-none gap-2"
              >
                <Save className="w-4 h-4" /> Save Scenario
              </Button>
            </div>
          }
        />
      </SectionContainer>

      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          
          {/* Left Node Palette Panel */}
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-xs p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4 px-2">Node Palette</h3>
              <div className="space-y-3">
                <div 
                  onClick={() => handleAddNode("trigger")}
                  className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] hover:bg-[#E0E7FF] rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-[#818CF8] text-white rounded">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#111827]">Sensor Trigger</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1.5">Monitors dynamic sensor values (e.g. occupancy, temperature).</p>
                </div>

                <div 
                  onClick={() => handleAddNode("condition")}
                  className="p-3 bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-[#FBBF24] text-white rounded">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#111827]">Logical Check</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1.5">Evaluates logical statements, schedules, or pricing windows.</p>
                </div>

                <div 
                  onClick={() => handleAddNode("action")}
                  className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-[#34D399] text-white rounded">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#111827]">Device Control</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1.5">Dispatches commands directly to HVAC, Lighting, or Server infrastructure.</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-[#E5E7EB] pt-4">
              <div className="flex items-start gap-2 bg-[#FAFAFA] border border-[#E5E7EB] p-3 rounded-xl">
                <Info className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
                <span className="text-[10px] text-[#6B7280] leading-normal">
                  Click a palette block above to place it on the canvas view.
                </span>
              </div>
            </div>
          </div>

          {/* Center Canvas Grid View */}
          <div className="lg:col-span-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-xs relative flex flex-col justify-between">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#111827 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
            
            {/* Canvas Nodes View */}
            <div className="flex-1 p-6 relative overflow-y-auto flex flex-col items-center justify-center space-y-6 z-10">
              {nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => handleNodeClick(node.id)}
                    className={`w-64 p-4 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                      selectedNodeId === node.id 
                        ? "border-[#111827] shadow-md ring-2 ring-[#111827]/10" 
                        : "border-[#E5E7EB] shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        node.type === "trigger" ? "bg-[#EEF2FF] text-[#4F46E5]" :
                        node.type === "condition" ? "bg-[#FFFBEB] text-[#D97706]" :
                        "bg-[#ECFDF5] text-[#059669]"
                      }`}>
                        {node.type}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          node.status === "success" ? "bg-[#10B981]" :
                          node.status === "running" ? "bg-[#3B82F6]" :
                          "bg-[#9CA3AF]"
                        }`} />
                        <span className="text-[10px] text-[#6B7280]">{node.status}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#111827] mt-2">{node.name}</h4>
                    <p className="text-[10px] text-[#6B7280] mt-1 line-clamp-1">{node.description}</p>
                  </div>
                  {index < nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center text-[#9CA3AF]">
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bottom Simulation Logs Panel */}
            <div className="h-32 bg-[#FAFAFA] border-t border-[#E5E7EB] p-4 font-mono text-[10px] text-[#4B5563] overflow-y-auto z-10">
              <div className="font-bold text-[#111827] mb-1.5">Simulation Terminal</div>
              {simulationLogs.map((log, i) => (
                <div key={i} className="mb-0.5">{log}</div>
              ))}
            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-xs p-4 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2 px-2">Properties</h3>
                  <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                    <div className="text-xs font-semibold text-[#111827]">{selectedNode.name}</div>
                    <div className="text-[10px] text-[#6B7280] mt-1">{selectedNode.description}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#111827]">Parameters</h4>
                  {Object.entries(selectedNode.config).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{key}</label>
                      <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => handleUpdateConfig(key, e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-[#6B7280] text-xs">
                Select a node to edit properties.
              </div>
            )}

            {selectedNodeId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
                  setSelectedNodeId(null);
                }}
                className="w-full text-red-600 hover:text-red-700 bg-white border-red-200 hover:bg-red-50 mt-4"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Node
              </Button>
            )}
          </div>

        </div>
      </SectionContainer>
    </PageContainer>
  );
}
