from typing import Dict, Any
from memory.shared_memory import AgentRecommendation


class OccupancyAgent:
    """
    1. Occupancy Agent: Analyzes building headcount, occupancy trends, and room utilization.
    """
    def __init__(self):
        self.name = "OccupancyAgent"

    async def process(self, twin_state: Dict[str, Any]) -> AgentRecommendation:
        occupancy = twin_state.get("occupancy", 150)
        
        if occupancy > 250:
            status = "HIGH_OCCUPANCY"
            priority = 7
            recommendation = "Increase fresh air ventilation and HVAC airflow for high occupant density."
            reasoning = f"High building headcount detected ({occupancy} occupants). Ventilation boost required."
        elif occupancy < 20:
            status = "LOW_OCCUPANCY"
            priority = 4
            recommendation = "Set unoccupied zones to eco-mode and reduce lighting."
            reasoning = f"Low building occupancy ({occupancy} occupants). Eco-mode energy saving recommended."
        else:
            status = "OPTIMAL"
            priority = 5
            recommendation = "Maintain baseline HVAC and lighting schedule."
            reasoning = f"Occupancy is normal ({occupancy} occupants). Comfort setpoints maintained."

        return AgentRecommendation(
            agent_name=self.name,
            status=status,
            confidence=0.92,
            reasoning=reasoning,
            recommendation=recommendation,
            priority=priority,
            expected_impact={
                "energy_kw_delta": -12.5 if occupancy < 20 else 0.0,
                "cost_dollar_delta": -2.25 if occupancy < 20 else 0.0,
                "comfort_impact_pct": 98.0
            }
        )


class ThermalAgent:
    """
    2. Thermal Agent: Monitors indoor/outdoor temperatures, HVAC consumption, and thermal comfort bounds.
    """
    def __init__(self):
        self.name = "ThermalAgent"

    async def process(self, twin_state: Dict[str, Any]) -> AgentRecommendation:
        outdoor_temp = twin_state.get("outdoor_temperature", 28.0)
        indoor_temp = twin_state.get("indoor_temperature", 22.5)

        if outdoor_temp > 35.0:
            status = "CRITICAL"
            priority = 9
            recommendation = "Engage maximum precooling to protect thermal comfort before peak heat."
            reasoning = f"Extreme outdoor temperature ({outdoor_temp}°C). Precooling required to prevent indoor overheat."
        elif indoor_temp > 24.5:
            status = "WARNING"
            priority = 8
            recommendation = "Increase HVAC cooling output to pull indoor temperature down to 22.5°C."
            reasoning = f"Indoor temperature ({indoor_temp}°C) exceeds target 22.5°C threshold."
        else:
            status = "OPTIMAL"
            priority = 5
            recommendation = "Maintain current HVAC temperature setpoint (22.5°C)."
            reasoning = f"Thermal equilibrium maintained (Indoor: {indoor_temp}°C, Outdoor: {outdoor_temp}°C)."

        return AgentRecommendation(
            agent_name=self.name,
            status=status,
            confidence=0.95,
            reasoning=reasoning,
            recommendation=recommendation,
            priority=priority,
            expected_impact={
                "energy_kw_delta": 15.0 if outdoor_temp > 35.0 else 0.0,
                "cost_dollar_delta": 3.0 if outdoor_temp > 35.0 else 0.0,
                "comfort_impact_pct": 100.0
            }
        )


class EnergyAgent:
    """
    3. Energy Agent: Analyzes total building load, solar generation, and battery storage.
    """
    def __init__(self):
        self.name = "EnergyAgent"

    async def process(self, twin_state: Dict[str, Any]) -> AgentRecommendation:
        building_load = twin_state.get("building_load", 345.0)
        solar_gen = twin_state.get("solar", 120.0)
        battery_soc = twin_state.get("battery", 75.0)

        if solar_gen > 150.0 and battery_soc < 90.0:
            status = "CHARGING_OPPORTUNITY"
            priority = 6
            recommendation = f"Direct excess solar power ({solar_gen} kW) to charge Battery Storage (SoC: {battery_soc}%)."
            reasoning = f"Surplus solar generation available. Store energy for peak tariff hours."
        elif building_load > 400.0 and battery_soc > 30.0:
            status = "SHIFT_DEMAND"
            priority = 7
            recommendation = f"Discharge Battery Storage ({battery_soc}% SoC) to shave peak load by 50 kW."
            reasoning = f"High building demand ({building_load} kW). Peak shaving engaged to reduce grid import."
        else:
            status = "OPTIMAL"
            priority = 5
            recommendation = "Energy consumption within target balance limits."
            reasoning = f"Net building load ({building_load} kW) balanced with solar ({solar_gen} kW)."

        return AgentRecommendation(
            agent_name=self.name,
            status=status,
            confidence=0.90,
            reasoning=reasoning,
            recommendation=recommendation,
            priority=priority,
            expected_impact={
                "energy_kw_delta": -50.0 if building_load > 400.0 else -15.0,
                "cost_dollar_delta": -9.0 if building_load > 400.0 else -2.70,
                "comfort_impact_pct": 96.0
            }
        )


class EquipmentAgent:
    """
    4. Equipment Agent: Monitors health, runtime hours, and operational status of HVAC chillers, pumps, and fans.
    """
    def __init__(self):
        self.name = "EquipmentAgent"

    async def process(self, twin_state: Dict[str, Any]) -> AgentRecommendation:
        hvac_power = twin_state.get("hvac", 180.0)

        if hvac_power > 300.0:
            status = "WARNING"
            priority = 8
            recommendation = "Rotate primary Chiller-1 to Chiller-2 to prevent compressor thermal overload."
            reasoning = f"HVAC electrical load ({hvac_power} kW) near rating limit. Duty rotation advised."
        else:
            status = "OPTIMAL"
            priority = 5
            recommendation = "All HVAC chillers and pumps operating within normal health vibration & thermal specs."
            reasoning = f"Equipment health status green across all 12 monitored nodes."

        return AgentRecommendation(
            agent_name=self.name,
            status=status,
            confidence=0.96,
            reasoning=reasoning,
            recommendation=recommendation,
            priority=priority,
            expected_impact={
                "energy_kw_delta": 0.0,
                "cost_dollar_delta": 0.0,
                "comfort_impact_pct": 100.0
            }
        )


class GridAgent:
    """
    5. Grid Agent: Monitors real-time electricity tariff prices and grid stability signals.
    """
    def __init__(self):
        self.name = "GridAgent"

    async def process(self, twin_state: Dict[str, Any]) -> AgentRecommendation:
        price = twin_state.get("electricity_price", 0.18)
        grid_import = twin_state.get("grid_import", 225.0)

        if price > 0.30:
            status = "HIGH_PRICE"
            priority = 8
            recommendation = f"High electricity tariff (${price}/kWh). Curtail non-essential loads and maximize battery discharge."
            reasoning = f"Peak electricity price event active (${price}/kWh vs base $0.12/kWh)."
        else:
            status = "OPTIMAL"
            priority = 5
            recommendation = "Grid price normal ($0.18/kWh). Maintain standard utility import."
            reasoning = f"Grid energy import ({grid_import} kW) operating under standard rate structure."

        return AgentRecommendation(
            agent_name=self.name,
            status=status,
            confidence=0.94,
            reasoning=reasoning,
            recommendation=recommendation,
            priority=priority,
            expected_impact={
                "energy_kw_delta": -30.0 if price > 0.30 else 0.0,
                "cost_dollar_delta": -9.0 if price > 0.30 else 0.0,
                "comfort_impact_pct": 95.0
            }
        )


class SafetyAgent:
    """
    6. Safety Agent: Monitors fire alarms, environmental hazards, and emergency overrides.
    """
    def __init__(self):
        self.name = "SafetyAgent"

    async def process(self, twin_state: Dict[str, Any]) -> AgentRecommendation:
        outdoor_temp = twin_state.get("outdoor_temperature", 28.0)
        indoor_temp = twin_state.get("indoor_temperature", 22.5)

        if indoor_temp > 45.0 or outdoor_temp > 50.0:
            status = "CRITICAL"
            priority = 10
            recommendation = "EMERGENCY SAFETY OVERRIDE: Trigger fire & evacuation protocol. Shut down non-essential HVAC dampers."
            reasoning = f"Hazardous temperature detected (Indoor: {indoor_temp}°C, Outdoor: {outdoor_temp}°C). Emergency override engaged."
        else:
            status = "OPTIMAL"
            priority = 5
            recommendation = "Life safety systems, air quality indices, and emergency pathways verified nominal."
            reasoning = "All environmental safety parameters operating within certified OSHA / ASHRAE thresholds."

        return AgentRecommendation(
            agent_name=self.name,
            status=status,
            confidence=0.99,
            reasoning=reasoning,
            recommendation=recommendation,
            priority=priority,
            expected_impact={
                "energy_kw_delta": 0.0,
                "cost_dollar_delta": 0.0,
                "comfort_impact_pct": 100.0
            }
        )
