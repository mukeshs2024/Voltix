"""
1. Purpose: Explainability engine for Grid Agent.
2. Responsibilities: Generate human-readable reasoning for grid decisions.
3. Folder location: ai/agents/grid/
"""

from typing import Dict, Any
from .grid_schema import GridInputState

class GridExplainabilityEngine:
    @staticmethod
    def generate_reasoning(
        state: GridInputState,
        rule_outputs: Dict[str, Any],
        confidence: float
    ) -> str:
        tier = rule_outputs.get("pricing_tier", "UNKNOWN")
        strategy = rule_outputs.get("battery_strategy", "UNKNOWN")
        
        reasoning = (
            f"Based on current grid price of {state.current_grid_price} and building load of {state.current_building_load_kw}kW, "
            f"the pricing tier is {tier}. Battery strategy is set to {strategy}. "
        )
        
        if state.demand_response_event:
            reasoning += "A Demand Response event is active, forcing load reduction. "
            
        reasoning += f"Confidence in these recommendations is {confidence:.0%}."
        
        return reasoning
