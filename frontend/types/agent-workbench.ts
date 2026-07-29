export type AgentIdType = 
    | "equipment" 
    | "safety" 
    | "grid" 
    | "hvac" 
    | "occupancy" 
    | "carbon" 
    | "security" 
    | "lighting" 
    | "water" 
    | "energy";

export interface SimulationOperatorInput {
    scenario_id: string;
    scenario_name: string;
    building_id: string;
    agent_id: AgentIdType;
    building_data: Record<string, any>;
    telemetry: Record<string, any>;
    overrides: Record<string, any>;
}

export interface AgentWorkflowStep {
    label: string;
    detail: string;
    state: "done" | "active" | "pending";
}

export interface AgentDeveloperMetadata {
    agent_name: string;
    source: string;
    raw_ai_response: Record<string, any>;
    mapped_dto: Record<string, any>;
    execution_time_ms: number;
    token_usage: number;
    normalized_at: string;
}

export interface AIDecisionBlock {
    summary: string;
    priority: string;
    severity: string;
    expected_impact: string;
    reason: string;
    business_impact: string;
}

export interface RecommendationCard {
    title: string;
    description: string;
    urgency: string;
}

export interface TimelineEvent {
    time: string;
    message: string;
    is_active: boolean;
}

export interface BaseAgentResponse {
    agent_id: AgentIdType;
    agent_name: string;
    purpose: string;
    status: string;
    last_execution: string;
    scenario_id: string;
    scenario_name: string;
    execution_mode: string;
    health_percentage: number;
    
    input: SimulationOperatorInput;
    workflow: AgentWorkflowStep[];
    decision: AIDecisionBlock;
    recommendations: RecommendationCard[];
    timeline: TimelineEvent[];
    developer_metadata: AgentDeveloperMetadata;
    logs: string[];
}

export interface EquipmentAgentResponse extends BaseAgentResponse {
    sensors: Record<string, any>[];
    analytics: Record<string, any>;
}

export interface SafetyAgentResponse extends BaseAgentResponse {
    sensors: Record<string, any>[];
    analytics: Record<string, any>;
    hazards: Record<string, any>[];
}

export interface GridAgentResponse extends BaseAgentResponse {
    sensors: Record<string, any>[];
    analytics: Record<string, any>;
}

export type AgentSimulationResponseUnion = 
    | EquipmentAgentResponse 
    | SafetyAgentResponse 
    | GridAgentResponse 
    | BaseAgentResponse;
