from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseVectorStore(ABC):
    """
    Abstract interface for semantic similarity search.
    Used by agents to recall historical patterns and past incident responses.
    """
    
    @abstractmethod
    async def search_similar(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieve top-k most semantically similar memories.
        """
        pass
        
    @abstractmethod
    async def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        """
        Embed and store new documents/memories.
        """
        pass

class MockVectorStore(BaseVectorStore):
    """
    A simple mock implementation for local simulation.
    """
    
    async def search_similar(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        # Mock retrieval: return dummy memory
        return [
            {"content": "Historical HVAC anomaly matched.", "metadata": {"confidence": 0.88}}
        ]
        
    async def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        pass
