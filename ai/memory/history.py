from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseMemoryStore(ABC):
    """
    Abstract interface for memory retrieval.
    Assume backend exists and implements this.
    """
    
    @abstractmethod
    async def get_recent_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch short-term memory / recent interactions.
        """
        pass
        
    @abstractmethod
    async def save_interaction(self, session_id: str, interaction: Dict[str, Any]) -> None:
        """
        Persist an interaction to memory.
        """
        pass
