"""
1. Purpose: Prompt builder for Safety Agent LLM validation.
2. Responsibilities: Construct structured prompts for Groq LLM.
3. Folder location: ai/agents/safety/
"""

from typing import Dict, Any
import json
from .safety_schema import SafetyInputState

class SafetyPromptBuilder:
    @staticmethod
    def build_prompt(state: SafetyInputState, rule_outputs: Dict[str, Any]) -> str:
        prompt = f"""
You are the Safety Agent for an Autonomous Building Operations Platform.
Your mission is to be the final safety authority.
You are NOT an optimizer or a planner. You must validate every recommendation.
You must prevent unsafe building decisions.

CURRENT STATE:
{state.model_dump_json(indent=2)}

RULE-BASED SAFETY OUTPUTS:
{json.dumps(rule_outputs, indent=2)}

TASK:
Review the current state and preliminary rule evaluations.
Provide your final validation for the safety status, actions, and detailed reasoning.
Output ONLY valid JSON matching this schema exactly:
{{
  "reasoning": "string (explain your logic)",
  "allowed_actions": ["string"],
  "blocked_actions": ["string"]
}}
"""
        return prompt
