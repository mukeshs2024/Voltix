"""
1. Purpose: Business Rule Engine for the Safety Agent.
2. Responsibilities: Deterministically generate safety violations and check for emergencies.
3. Folder location: ai/agents/safety/
"""

from typing import Dict, Any
from .safety_schema import SafetyInputState
from .safety_constants import SafetyStatus, RiskLevel, SafetyConfig


class SafetyRulesEngine:
    @staticmethod
    def evaluate(state: SafetyInputState) -> Dict[str, Any]:
        violations = []
        recommendations = []
        emergency_flag = False
        
        # Rule: Fire Alarm -> Emergency -> Reject all optimization
        if state.fire_alarm:
            violations.append("Fire Alarm is active.")
            recommendations.append("Evacuate immediately. Reject all HVAC/optimization changes.")
            emergency_flag = True

        # Rule: Smoke detected -> Emergency
        if state.smoke_sensor:
            violations.append("Smoke detected.")
            recommendations.append("Trigger fire protocols. Evacuate.")
            emergency_flag = True
            
        # Rule: Occupancy exceeds capacity -> Overcrowding
        if state.occupancy > state.building_capacity:
            violations.append(f"Occupancy ({state.occupancy}) exceeds capacity ({state.building_capacity}).")
            recommendations.append("Overcrowding. Reduce building occupancy.")
            
        # Rule: CO2 exceeds threshold -> Increase ventilation
        if state.co2_level > SafetyConfig.CO2_THRESHOLD_CRITICAL:
            violations.append(f"CO2 level ({state.co2_level}) critically high.")
            recommendations.append("Increase ventilation to maximum.")
            emergency_flag = True
        elif state.co2_level > SafetyConfig.CO2_THRESHOLD_WARNING:
            violations.append(f"CO2 level ({state.co2_level}) is elevated.")
            recommendations.append("Increase ventilation.")

        # Rule: Temperature checks
        if state.zone_temperature > SafetyConfig.TEMP_MAX_CRITICAL:
            violations.append(f"Zone temperature ({state.zone_temperature}C) is critically high.")
            recommendations.append("Cooling required immediately.")
            
        # Rule: Emergency Exit blocked -> Critical
        if state.emergency_exit_blocked:
            violations.append("Emergency Exit is blocked.")
            recommendations.append("Clear emergency exit immediately.")
            emergency_flag = True
            
        # Overall status
        if emergency_flag or state.emergency_state:
            emergency_flag = True
            safety_status = SafetyStatus.CRITICAL
            risk_level = RiskLevel.EXTREME
        elif len(violations) > 0:
            safety_status = SafetyStatus.WARNING
            risk_level = RiskLevel.HIGH
        else:
            safety_status = SafetyStatus.SAFE
            risk_level = RiskLevel.LOW

        return {
            "safety_status": safety_status,
            "violations": violations,
            "risk_level": risk_level,
            "emergency_flag": emergency_flag,
            "recommendations": recommendations,
        }
