from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class IAIService(ABC):
    """
    Abstract AI Interface.
    backend engineers ONLY define the contract interface.
    AI functionality is implemented externally by the AI Team.
    """

    @abstractmethod
    async def analyze_telemetry_stream(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Contract for passing telemetry payload to AI engine.
        """
        pass

    @abstractmethod
    async def generate_recommendations(self, system_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Contract for requesting AI recommendations based on system state.
        """
        pass
