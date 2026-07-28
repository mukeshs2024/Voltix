"""
1. Objective: Asynchronous stream that continuously emits telemetry.
2. Folder location: ai/simulation/
3. Responsibilities: Push updates to the agent pipeline.
"""
import time
import threading
from datetime import datetime
from .building_clock import BuildingClock
from .scenario_manager import ScenarioManager
from .sensor_models import EnterpriseTelemetry

class TelemetryStream:
    def __init__(self, callback, interval_seconds: float = 2.0):
        self.clock = BuildingClock(datetime.now(), time_scale=1.0)
        self.scenario_manager = ScenarioManager()
        self.callback = callback
        self.interval_seconds = interval_seconds
        self.running = False
        self.thread = None
        
    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._loop, daemon=True)
            self.thread.start()
        
    def pause(self):
        self.clock.pause()
        
    def resume(self):
        self.clock.resume()
        
    def set_scenario(self, scenario: str):
        self.scenario_manager.set_scenario(scenario)
        
    def get_current_scenario(self) -> str:
        return self.scenario_manager.current_scenario
        
    def get_virtual_time(self) -> datetime:
        return self.clock.virtual_time
        
    def _loop(self):
        while self.running:
            if not self.clock.is_paused:
                v_time = self.clock.tick()
                telemetry = self.scenario_manager.generate_telemetry(v_time, "Meeting Room A")
                self.callback(telemetry)
            time.sleep(self.interval_seconds)
            
    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join()
