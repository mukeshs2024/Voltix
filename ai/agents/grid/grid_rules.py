"""
1. Purpose: Business Rule Engine for the Grid Agent.
2. Responsibilities: Deterministically generate recommendations and actions based on Grid states.
3. Folder location: ai/agents/grid/
"""

from typing import List, Dict, Any
from .grid_schema import GridInputState
from .grid_constants import PricingTier, BatteryStrategy, CarbonLevel, GridStatus, GridConfig


class GridRulesEngine:
    @staticmethod
    def evaluate(state: GridInputState) -> Dict[str, Any]:
        recommendations = []
        battery_strategy = BatteryStrategy.HOLD
        
        # We need to determine the pricing tier based on some proxy logic or pass it.
        # Let's assume price thresholds:
        price = state.current_grid_price
        # Basic thresholds (mock)
        pricing_tier = PricingTier.MID_PEAK
        if price < 0.05:
            pricing_tier = PricingTier.OFF_PEAK
        elif price > 0.15:
            pricing_tier = PricingTier.ON_PEAK
            
        carbon_level = CarbonLevel.MEDIUM
        if state.grid_carbon_intensity < 200:
            carbon_level = CarbonLevel.LOW
        elif state.grid_carbon_intensity > 500:
            carbon_level = CarbonLevel.HIGH

        grid_status = GridStatus.NORMAL
        
        # Rule: Price is OFF_PEAK, Battery below 80% -> Recommend charging
        if pricing_tier == PricingTier.OFF_PEAK and state.battery_soc < GridConfig.BATTERY_CHARGE_THRESHOLD:
            recommendations.append("Price is OFF_PEAK and battery is below 80%. Recommend charging battery.")
            battery_strategy = BatteryStrategy.CHARGE
            
        # Rule: Solar generation exceeds building load -> Recommend charging battery
        if state.solar_generation_kw > state.current_building_load_kw:
            recommendations.append("Solar generation exceeds building load. Recommend charging battery with excess solar.")
            if battery_strategy != BatteryStrategy.DISCHARGE:
                battery_strategy = BatteryStrategy.CHARGE
                
        # Rule: Demand Response Event -> Recommend reducing non-critical load
        if state.demand_response_event:
            recommendations.append("Demand Response Event active. Recommend reducing non-critical load.")
            grid_status = GridStatus.CRITICAL
            battery_strategy = BatteryStrategy.DISCHARGE
            
        # Rule: Carbon intensity is HIGH -> Recommend delaying flexible loads
        if carbon_level == CarbonLevel.HIGH:
            recommendations.append("Carbon intensity is HIGH. Recommend delaying flexible loads.")
            
        # Rule: Peak pricing AND Battery > 70% -> Recommend battery discharge
        if pricing_tier in [PricingTier.ON_PEAK, PricingTier.CRITICAL] and state.battery_soc > GridConfig.BATTERY_DISCHARGE_THRESHOLD:
            recommendations.append("Peak pricing active and battery > 70%. Recommend battery discharge.")
            battery_strategy = BatteryStrategy.DISCHARGE
            
        # Rule: Grid unstable (proxy by extreme price or DR event) -> Recommend reducing building demand
        if state.demand_response_event or pricing_tier == PricingTier.CRITICAL:
            recommendations.append("Grid unstable. Recommend reducing building demand immediately.")
            grid_status = GridStatus.CRITICAL

        return {
            "pricing_tier": pricing_tier,
            "battery_strategy": battery_strategy,
            "carbon_level": carbon_level,
            "grid_status": grid_status,
            "recommendations": recommendations,
        }
