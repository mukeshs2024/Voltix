"""
1. Objective: Simulate an entire 24-hour building cycle.
2. Folder location: ai/simulation/
3. Responsibilities: Evolve the state hour by hour, passing it through all agents and the supervisor.
"""
from typing import Dict, Any
import time
import json
from ai.decision_engine.supervisor import DecisionEngineSupervisor
from ai.simulation.scenario_library import SCENARIO_LIBRARY

# Import all agents
from ai.agents.occupancy.occupancy_agent import OccupancyAgent
from ai.agents.thermal.thermal_agent import ThermalAgent
from ai.agents.energy.energy_agent import EnergyAgent
from ai.agents.equipment.equipment_agent import EquipmentAgent
from ai.agents.grid.grid_agent import GridAgent
from ai.agents.safety.safety_agent import SafetyAgent

def simulate_day():
    print("=========================================")
    print("  VOLTIX 24-HOUR END-TO-END SIMULATION  ")
    print("=========================================\n")
    
    timeline = [
        ("06:00 Building Empty", SCENARIO_LIBRARY["EMPTY_BUILDING"]),
        ("08:00 Employees Arrive", SCENARIO_LIBRARY["MORNING_RUSH"]),
        ("10:00 Meetings", SCENARIO_LIBRARY["CONFERENCE"]),
        ("13:00 Lunch", SCENARIO_LIBRARY["EMPTY_BUILDING"]),
        ("15:00 Conference", SCENARIO_LIBRARY["CONFERENCE"]),
        ("18:00 Employees Leave", SCENARIO_LIBRARY["NIGHT_SHIFT"]),
        ("22:00 Night Shift", SCENARIO_LIBRARY["NIGHT_SHIFT"]),
        ("02:00 Empty Building", SCENARIO_LIBRARY["EMPTY_BUILDING"])
    ]
    
    agents = [
        OccupancyAgent(), ThermalAgent(), EnergyAgent(),
        EquipmentAgent(), GridAgent(), SafetyAgent()
    ]
    
    supervisor = DecisionEngineSupervisor()
    
    for time_label, state in timeline:
        print(f"\n--- TIME: {time_label} ---")
        
        # 1. Agents process the state
        proposed_actions = []
        for agent in agents:
            # Pass a clean copy of the state to each agent
            result = agent.process(state.copy())
            if isinstance(result, dict):
                key = agent.__class__.__name__
                if key == "OccupancyAgent" and "occupancy_metrics" in result:
                    proposed_actions.append({key: result["occupancy_metrics"]})
                elif key == "ThermalAgent" and "thermal_metrics" in result:
                    proposed_actions.append({key: result["thermal_metrics"]})
                elif key == "EnergyAgent" and "energy_metrics" in result:
                    proposed_actions.append({key: result["energy_metrics"]})
                elif key == "GridAgent" and "grid_metrics" in result:
                    proposed_actions.append({key: result["grid_metrics"]})
                elif key == "SafetyAgent" and "safety_metrics" in result:
                    proposed_actions.append({key: result["safety_metrics"]})
                elif key == "EquipmentAgent" and "equipment_metrics" in result:
                    proposed_actions.append({key: result["equipment_metrics"]})
                else:
                    proposed_actions.append({key: {}})
        
        # 2. Supervisor processes the aggregated proposals
        agg_state = {"proposed_actions": proposed_actions}
        final_decision = supervisor.process_state(agg_state)
        
        try:
            decision_dict = json.loads(final_decision["final_decision"])
            print(f">> DECISION: {decision_dict.get('decision')}")
            print(f">> REASONING: {decision_dict.get('reasoning')}")
        except Exception as e:
            print(f">> Final Decision Payload Error: {e}")
            
        time.sleep(0.5)

if __name__ == "__main__":
    simulate_day()
