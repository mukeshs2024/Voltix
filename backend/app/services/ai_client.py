import logging
from typing import Any, Dict
import httpx

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class AIClient:
    """
    HTTP Client connector for communicating with external Multi-Agent AI Service.
    """

    def __init__(self, base_url: str = settings.AI_SERVICE_URL, timeout: float = settings.AI_TIMEOUT_SECONDS):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    async def run_simulation(self, telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Post telemetry JSON data to AI service (/ai/run) and return agent simulation decisions.
        """
        endpoint = f"{self.base_url}/ai/run"
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(endpoint, json=telemetry_data)
                
                if response.status_code == 200:
                    return response.json()
                
                logger.warning(f"AI Service returned status code {response.status_code}: {response.text}")
                return self._fallback_response(telemetry_data, reason=f"AI Service HTTP {response.status_code}")

        except httpx.TimeoutException:
            logger.error(f"AI Service request timed out after {self.timeout}s")
            return self._fallback_response(telemetry_data, reason="AI Service connection timeout")
        except Exception as e:
            logger.error(f"Failed to communicate with AI Service: {str(e)}")
            return self._fallback_response(telemetry_data, reason=f"AI Service unavailable ({str(e)})")

    def _fallback_response(self, telemetry_data: Dict[str, Any], reason: str) -> Dict[str, Any]:
        """
        Generates a safe fallback simulation decision when AI service is uncontactable.
        """
        building_id = telemetry_data.get("building_id", "UNKNOWN")
        zone_id = telemetry_data.get("zone_id", "UNKNOWN")

        return {
            "status": "completed_with_fallback",
            "decision": {
                "action": "Maintain baseline HVAC setpoints (23.5°C) and activate eco-mode",
                "reason": f"Fallback rule engaged: {reason}",
                "confidence": 0.50,
            },
            "agent_reports": [
                {
                    "agent": "SafetyComplianceAgent",
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
                    "content": f"Automated fallback engaged for telemetry payload: {reason}",
                }
            ],
        }


ai_client = AIClient()
