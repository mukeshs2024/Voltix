"""
1. Objective: Map EnterpriseTelemetry into SharedState and route it into the AI pipeline.
2. Folder location: ai/simulation/
3. Responsibilities: Act as the bridge between IoT (Simulator) and Voltix AI.
"""
from typing import Dict, Any, List
import json
from .sensor_models import EnterpriseTelemetry
from .telemetry_stream import TelemetryStream
from ai.decision_engine.orchestrator import Orchestrator
from ai.agents.occupancy.occupancy_agent import OccupancyAgent
from ai.agents.thermal.thermal_agent import ThermalAgent
from ai.agents.energy.energy_agent import EnergyAgent
from ai.agents.equipment.equipment_agent import EquipmentAgent
from ai.agents.grid.grid_agent import GridAgent
from ai.agents.safety.safety_agent import SafetyAgent

class BuildingSimulator:
    def __init__(self, ui_callback):
        self.stream = TelemetryStream(self._on_telemetry, interval_seconds=2.0)
        self.ui_callback = ui_callback
        self.orchestrator = Orchestrator()
        self.agents = [
            OccupancyAgent(), ThermalAgent(), EnergyAgent(),
            EquipmentAgent(), GridAgent(), SafetyAgent()
        ]
        
    def start(self):
        self.stream.start()
        
    def stop(self):
        self.stream.stop()
        
    def set_scenario(self, scenario: str):
        self.stream.set_scenario(scenario)
        
    def _map_to_shared_state(self, telemetry: EnterpriseTelemetry) -> Dict[str, Any]:
        """Convert standard enterprise IoT telemetry to our internal SharedState."""
        return {
            "zone": {
                "zone_id": telemetry.zone_id,
                "name": telemetry.zone_id,
                "capacity": telemetry.occupancy.capacity,
                "sq_ft": 5000.0
            },
            "sensors": [
                {"sensor_id": "pir1", "sensor_type": "PIR", "value": 1 if telemetry.occupancy.motion_detected else 0, "timestamp": telemetry.timestamp, "is_active": True},
                {"sensor_id": "acs1", "sensor_type": "ACS", "value": telemetry.occupancy.current, "timestamp": telemetry.timestamp, "is_active": True},
                {"sensor_id": "co21", "sensor_type": "CO2", "value": telemetry.environment.co2, "timestamp": telemetry.timestamp, "is_active": True},
            ],
            "calendar": [],
            "proposed_actions": [],
            # Additional fields required by agents
            "current_temperature": telemetry.environment.temperature,
            "current_setpoint": 24.0, # Defaulting to a safe setpoint
            "hvac_mode": telemetry.equipment.ahu_status,
            "current_kw": telemetry.energy.building_power_kw,
            "peak_limit_kw": 500.0, # Mock value
            "equipment_id": "AHU-1", # Mock value
            "runtime_hours": 120, # Mock value
            "current_price_kwh": telemetry.energy.grid_price
        }

    def _on_telemetry(self, telemetry: EnterpriseTelemetry):
        try:
            # 1. Map to AI Pipeline format
            shared_state = self._map_to_shared_state(telemetry)
            
            # 2. Run Agents
            proposed_actions = []
            for agent in self.agents:
                result = agent.process(shared_state.copy())
                
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
                        
            # 3. Run Orchestrator
            agg_state = {"proposed_actions": proposed_actions}
            decision_pkg = self.orchestrator.process(agg_state)
            
            # 4. Extract Decision
            decision_dict = decision_pkg.model_dump()
                
            # 5. Send to UI
            self.ui_callback(
                telemetry=telemetry,
                decision=decision_dict,
                time_str=self.stream.get_virtual_time().strftime("%H:%M:%S"),
                scenario=self.stream.get_current_scenario()
            )
        except Exception as e:
            import traceback
            with open("simulator_crash.log", "a") as f:
                f.write(traceback.format_exc() + "\n")
            print(f"CRASH IN TELEMETRY LOOP: {e}")
