from abc import ABC, abstractmethod
from typing import Any
import os
from dotenv import load_dotenv

load_dotenv()

try:
    from langchain_groq import ChatGroq
except ImportError:
    # Fallback/stub if not installed
    ChatGroq = None

class BaseAgent(ABC):
    """
    Base class for all specialized AI agents in the system.
    """
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        if ChatGroq and os.getenv("GROQ_API_KEY"):
            self.llm = ChatGroq(temperature=0, model_name="llama-3.3-70b-versatile")
        else:
            self.llm = None 
    
    @abstractmethod
    async def process(self, state: Any) -> Any:
        """
        Process the current state and return proposed actions or insights.
        """
        pass
        
    @abstractmethod
    def get_system_prompt(self) -> str:
        """
        Return the system prompt for the agent.
        """
        pass
