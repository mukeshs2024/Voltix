import uuid
from typing import Dict, Any, Optional
from datetime import datetime

# In-memory storage for prototype
# Structure: { session_id: { "scenario_id": str, "timestamp": str, "telemetry": dict, "agents": { agent_id: AgentSimulationResponse } } }
_SESSIONS: Dict[str, Dict[str, Any]] = {}

class SessionStore:
    @staticmethod
    def create_session(scenario_id: str, telemetry: Dict[str, Any], agent_results: Dict[str, Any]) -> str:
        session_id = f"sim_{uuid.uuid4().hex[:12]}"
        
        # Calculate overall health and status from agent results
        health_scores = []
        critical_agents = 0
        warning_agents = 0
        
        for agent_id, result in agent_results.items():
            if isinstance(result, dict):
                health = result.get("health_percentage", 100)
                status = result.get("status", "active")
            else:
                health = getattr(result, "health_percentage", 100)
                status = getattr(result, "status", "active")
                
            health_scores.append(health)
            if status == "error":
                critical_agents += 1
            elif status == "warning":
                warning_agents += 1
                
        avg_health = sum(health_scores) / len(health_scores) if health_scores else 100
        
        overall_status = "active"
        if critical_agents > 0:
            overall_status = "error"
        elif warning_agents > 0:
            overall_status = "warning"
            
        _SESSIONS[session_id] = {
            "session_id": session_id,
            "scenario_id": scenario_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "telemetry": telemetry,
            "agents": agent_results,
            "summary": {
                "overall_health": int(avg_health),
                "overall_status": overall_status,
                "total_agents": len(agent_results)
            }
        }
        return session_id

    @staticmethod
    def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        if session_id not in _SESSIONS:
            return None
            
        session_data = _SESSIONS[session_id]
        
        # Return a summary view suitable for the AI Control Center
        agents_summary = []
        for agent_id, result in session_data["agents"].items():
            if isinstance(result, dict):
                agent_name = result.get("agent_name", agent_id.capitalize())
                status = result.get("status", "active")
                health = result.get("health_percentage", 100)
                decision = result.get("decision", {})
                last_decision = decision.get("summary", "No decision recorded")
            else:
                agent_name = getattr(result, "agent_name", agent_id.capitalize())
                status = getattr(result, "status", "active")
                health = getattr(result, "health_percentage", 100)
                decision = getattr(result, "decision", None)
                last_decision = getattr(decision, "summary", "No decision recorded") if decision else "No decision recorded"
                
            agents_summary.append({
                "id": agent_id,
                "name": agent_name,
                "status": status,
                "health": health,
                "lastDecision": last_decision
            })
            
        return {
            "session_id": session_id,
            "scenario_id": session_data["scenario_id"],
            "timestamp": session_data["timestamp"],
            "summary": session_data["summary"],
            "agents": agents_summary
        }

    @staticmethod
    def get_agent_result(session_id: str, agent_id: str) -> Optional[Any]:
        session_data = _SESSIONS.get(session_id)
        if not session_data:
            return None
        return session_data["agents"].get(agent_id)

session_store = SessionStore()
