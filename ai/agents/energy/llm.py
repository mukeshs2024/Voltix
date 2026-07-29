"""
Groq LLM Client and Invoker for Energy Agent.
Features Tenacity retries, strict JSON schema parsing, 30s timeout, and fallback handling.
"""

import os
import json
import logging
from typing import Tuple, Dict, Any, Optional
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from .schemas import EnergyInput, EnergyRecommendation
from .prompts import ENERGY_SYSTEM_PROMPT, ENERGY_HUMAN_PROMPT_TEMPLATE
from .tools import run_deterministic_fallback

load_dotenv()

logger = logging.getLogger(__name__)

# Try importing langchain_groq
try:
    from langchain_groq import ChatGroq
    from langchain_core.messages import SystemMessage, HumanMessage
except ImportError:
    ChatGroq = None
    SystemMessage = None
    HumanMessage = None


class EnergyLLMInvoker:
    """Invoker for Groq API with llama-3.3-70b-versatile model."""

    def __init__(self, model_name: str = "llama-3.3-70b-versatile", temperature: float = 0.1, timeout: float = 30.0):
        self.model_name = model_name
        self.temperature = temperature
        self.timeout = timeout
        self.api_key = os.getenv("GROQ_API_KEY")

        if ChatGroq and self.api_key:
            try:
                self.llm = ChatGroq(
                    model_name=self.model_name,
                    temperature=self.temperature,
                    groq_api_key=self.api_key,
                    timeout=self.timeout
                )
            except Exception as e:
                logger.warning(f"Failed to initialize ChatGroq with model {self.model_name}: {e}. Falling back to rule engine.")
                self.llm = None
        else:
            self.llm = None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=4),
        retry=retry_if_exception_type((TimeoutError, Exception)),
        reraise=True
    )
    async def _invoke_llm_with_retry(self, human_prompt: str) -> str:
        """Invokes Groq LLM with tenacity retry policy (up to 3 attempts)."""
        if not self.llm or not SystemMessage or not HumanMessage:
            raise RuntimeError("Groq LLM is not initialized or GROQ_API_KEY is missing.")

        messages = [
            SystemMessage(content=ENERGY_SYSTEM_PROMPT),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content

    async def generate_recommendation(self, input_data: EnergyInput) -> Tuple[EnergyRecommendation, bool, int, int]:
        """
        Generates EnergyRecommendation using Groq LLM or falls back to deterministic rule engine.
        Returns: (recommendation_obj, is_fallback, retries_count, tokens_estimated)
        """
        human_prompt = ENERGY_HUMAN_PROMPT_TEMPLATE.format(
            electricity_tariff=input_data.electricity_tariff,
            battery_level=input_data.battery_level,
            solar_production=input_data.solar_production,
            hvac_consumption=input_data.hvac_consumption,
            predicted_occupancy=input_data.predicted_occupancy,
            temperature=input_data.temperature,
            weather=input_data.weather,
            grid_pricing=input_data.grid_pricing,
            peak_demand=input_data.peak_demand,
            historical_energy_usage=input_data.historical_energy_usage
        )

        retries_used = 0
        if self.llm:
            try:
                logger.info(f"Calling Groq LLM ({self.model_name}) for Energy Agent recommendation...")
                raw_response_content = await self._invoke_llm_with_retry(human_prompt)
                
                # Clean up any potential markdown code block wrappers
                clean_json_str = raw_response_content.strip()
                if clean_json_str.startswith("```json"):
                    clean_json_str = clean_json_str[7:]
                if clean_json_str.startswith("```"):
                    clean_json_str = clean_json_str[3:]
                if clean_json_str.endswith("```"):
                    clean_json_str = clean_json_str[:-3]
                clean_json_str = clean_json_str.strip()

                parsed_dict = json.loads(clean_json_str)
                recommendation = EnergyRecommendation.model_validate(parsed_dict)
                tokens_est = len(human_prompt.split()) + len(raw_response_content.split())
                
                logger.info("Successfully parsed structured JSON response from Groq LLM.")
                return recommendation, False, retries_used, tokens_est

            except Exception as e:
                logger.warning(f"Groq LLM invocation or parsing failed ({e}). Triggering deterministic fallback mode.", exc_info=True)
                retries_used = 3

        # Deterministic fallback mode
        fallback_rec = run_deterministic_fallback(input_data)
        tokens_est = len(human_prompt.split())
        return fallback_rec, True, retries_used, tokens_est
