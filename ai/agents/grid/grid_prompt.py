"""
1. Purpose: Prompt builder for Grid Agent LLM reasoning.
2. Responsibilities: Construct structured prompts for Groq LLM.
3. Folder location: ai/agents/grid/
"""

from typing import Dict, Any
import json
from .grid_schema import GridInputState

class GridPromptBuilder:
    @staticmethod
    def build_prompt(state: GridInputState, rule_outputs: Dict[str, Any]) -> str:
        prompt = f"""
You are the Grid Agent for an Autonomous Building Operations Platform.
Your mission is to represent the building's view of the electrical grid.
You do NOT change HVAC directly, control equipment, or change occupancy.
You only analyze external electrical conditions and recommend strategies.

CURRENT STATE:
{state.model_dump_json(indent=2)}

RULE-BASED PRELIMINARY OUTPUTS:
{json.dumps(rule_outputs, indent=2)}

TASK:
Review the current state and preliminary rule evaluations.
Provide your final reasoning, recommendations, and lists of loads (recommended to run, delayable, critical).
Output ONLY valid JSON matching this schema exactly:
{{
  "reasoning": "string (explain your logic)",
  "recommendations": ["string", "string"],
  "recommended_loads": ["string"],
  "delayable_loads": ["string"],
  "critical_loads": ["string"]
}}
"""
        return prompt
