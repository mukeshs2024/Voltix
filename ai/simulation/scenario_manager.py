"""
1. Objective: Manage dynamic simulation curves.
2. Folder location: ai/simulation/
3. Responsibilities: Generate realistic sensor data based on the current active scenario.
"""
import math
from datetime import datetime
from .sensor_models import EnterpriseTelemetry, OccupancyTelemetry, EnvironmentTelemetry, EquipmentTelemetry, EnergyTelemetry

class ScenarioManager:
    def __init__(self):
        self.current_scenario = "Morning Rush"
        self.capacity = 100
        
    def set_scenario(self, scenario: str):
        self.current_scenario = scenario
        
    def _get_base_metrics(self) -> tuple[int, int, int]:
        """Returns (occupancy, entry_rate, exit_rate) based on scenario"""
        s = self.current_scenario
        if s == "Morning Rush": return (85, 15, 2)
        elif s == "Conference": return (98, 5, 5)
        elif s == "Ghost Booking": return (5, 0, 0)
        elif s == "Fire Drill": return (0, 0, 80)
        elif s == "Sensor Failure": return (150, 0, 0) # Impossible number
        elif s == "Holiday": return (2, 0, 0)
        elif s == "Empty Building": return (0, 0, 0)
        return (50, 5, 5)
        
    def generate_telemetry(self, virtual_time: datetime, zone_id: str) -> EnterpriseTelemetry:
        base_occ, en_rate, ex_rate = self._get_base_metrics()
        
        # Add a tiny bit of sine wave drift based on minutes, to simulate realistic non-random fluctuation
        drift = math.sin(virtual_time.minute / 60.0 * math.pi * 2)
        
        occ_current = max(0, int(base_occ + (drift * 2)))
        co2 = 400 + (occ_current * 8)
        temp = 22.0 + (occ_current * 0.05)
        
        if self.current_scenario == "Fire Drill":
            temp += 5.0 # Simulated heat
            
        motion = occ_current > 0
        if self.current_scenario == "Sensor Failure":
            motion = False # Contradiction: 150 people but no motion
            
        return EnterpriseTelemetry(
            timestamp=virtual_time.isoformat(),
            zone_id=zone_id,
            occupancy=OccupancyTelemetry(
                current=occ_current, capacity=self.capacity,
                entry_rate=en_rate, exit_rate=ex_rate, motion_detected=motion
            ),
            environment=EnvironmentTelemetry(
                temperature=round(temp, 1), humidity=round(45.0 + drift, 1),
                co2=int(co2), light_level=600 if occ_current > 0 else 100
            ),
            equipment=EquipmentTelemetry(
                ahu_status="RUNNING" if occ_current > 5 else "STANDBY",
                hvac_power_kw=round(10.0 + (temp - 22)*2, 1),
                fan_speed=80 if occ_current > 50 else 30
            ),
            energy=EnergyTelemetry(
                building_power_kw=round(150.0 + (occ_current * 0.5), 1),
                grid_price=0.25 if virtual_time.hour > 14 else 0.15
            )
        )
