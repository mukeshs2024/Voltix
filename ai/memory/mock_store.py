from typing import List, Dict, Any
from memory.history import BaseMemoryStore

class MockMemoryStore(BaseMemoryStore):
    """
    Mock implementation of BaseMemoryStore for local testing and simulation.
    """
    
    def __init__(self):
        self._storage: Dict[str, List[Dict[str, Any]]] = {}

    async def get_recent_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        history = self._storage.get(session_id, [])
        return history[-limit:]
        
    async def save_interaction(self, session_id: str, interaction: Dict[str, Any]) -> None:
        if session_id not in self._storage:
            self._storage[session_id] = []
        self._storage[session_id].append(interaction)
