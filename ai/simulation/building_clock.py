"""
1. Objective: Virtual clock for the telemetry simulator.
2. Folder location: ai/simulation/
3. Responsibilities: Maintain simulated time, support time acceleration, allow pause/resume.
"""
import time
from datetime import datetime, timedelta

class BuildingClock:
    def __init__(self, start_time: datetime, time_scale: float = 1.0):
        self.virtual_time = start_time
        self.time_scale = time_scale
        self.is_paused = False
        self._last_tick_real_time = time.time()

    def tick(self) -> datetime:
        """Advance the virtual clock based on real-world elapsed time and the time_scale."""
        now = time.time()
        elapsed_real = now - self._last_tick_real_time
        self._last_tick_real_time = now
        
        if not self.is_paused:
            elapsed_virtual = elapsed_real * self.time_scale
            self.virtual_time += timedelta(seconds=elapsed_virtual)
            
        return self.virtual_time

    def pause(self):
        self.is_paused = True

    def resume(self):
        self._last_tick_real_time = time.time()
        self.is_paused = False

    def set_time_scale(self, scale: float):
        self.time_scale = scale
        self._last_tick_real_time = time.time()
