import logging
from typing import Any, Dict
import httpx
import sys
import os

from backend.app.core.config import settings

# Add AI module directory to path for direct in-process integration
ai_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ai"))
if ai_dir not in sys.path:
    sys.path.insert(0, ai_dir)

try:
    from decision_graph import AIOrchestrator
except ImportError as e:
    AIOrchestrator = None
    logging.warning(f"Could not import AIOrchestrator: {e}")

logger = logging.getLogger(__name__)


class AIClient:
    """
    Direct in-process & HTTP Client connector for communicating with Multi-Agent AI System.
    """

    def __init__(self, base_url: str = settings.AI_SERVICE_URL, timeout: float = settings.AI_TIMEOUT_SECONDS):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    async def check_health(self) -> bool:
        return True

    async def run_simulation(self, telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs the 6-Agent AI Decision Layer directly on telemetry data.
        """
        if AIOrchestrator:
            try:
                # Direct in-process execution through 6-Agent Decision Graph
                plan = await AIOrchestrator.run_cycle(telemetry_data)
                
                agent_reports = []
                for agent_name in plan.winning_agents:
                    agent_reports.append({
                        "agent": agent_name,
                        "proposal": plan.optimization_actions[0] if plan.optimization_actions else "Maintain baseline",
                        "impact": f"energy_saved: {plan.expected_savings.get('energy_kw_saved')}kW",
                        "reasoning": plan.reasoning_summary,
                        "confidence": plan.confidence
                    })

                negotiation_trace = []
                for c in plan.conflicts_resolved:
                    negotiation_trace.append({
                        "from_agent": c.get("category", "ConsensusEngine"),
                        "message_type": "conflict_resolved",
                        "content": f"{c.get('conflict')} -> {c.get('resolution')}"
                    })

                return {
                    "status": "completed",
                    "decision": {
                        "action": "; ".join(plan.optimization_actions),
                        "reason": plan.reasoning_summary,
                        "confidence": plan.confidence,
                    },
                    "agent_reports": agent_reports,
                    "negotiation_trace": negotiation_trace,
                }
            except Exception as e:
                logger.error(f"In-process AIOrchestrator execution error: {e}", exc_info=True)

        return self._fallback_response(telemetry_data, reason="AI Service fallback")

    def _fallback_response(self, telemetry_data: Dict[str, Any], reason: str) -> Dict[str, Any]:
        building_id = telemetry_data.get("building_id", "UNKNOWN")
        zone_id = telemetry_data.get("zone_id", "UNKNOWN")

        return {
            "status": "completed_with_fallback",
            "decision": {
                "action": "Maintain baseline HVAC setpoints (22.5°C) and activate eco-mode",
                "reason": f"Fallback rule engaged: {reason}",
                "confidence": 0.50,
            },
            "agent_reports": [
                {
                    "agent": "SafetyAgent",
                    "proposal": f"Maintain default safe operation for {building_id}:{zone_id}",
                    "impact": "energy: baseline, risk: minimal",
                    "reasoning": reason,
                    "confidence": 0.50,
                }
            ],
            "negotiation_trace": [
                {
                    "from_agent": "SystemFallbackHandler",
                    "message_type": "fallback_triggered",
                    "content": f"Automated fallback engaged: {reason}",
                }
            ],
        }


ai_client = AIClient()

