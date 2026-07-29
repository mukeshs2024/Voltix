import asyncio
import logging
from typing import Dict, Any, Optional

from backend.app.services.realtime_service import ws_manager

# Ensure Voltix root is in Python path for ai module to load if running from uvicorn in root
import sys
import os
try:
    from ai.simulation.building_simulator import BuildingSimulator
except ImportError as e:
    logging.warning(f"Could not import BuildingSimulator from ai module: {e}")
    BuildingSimulator = None

logger = logging.getLogger(__name__)


class LiveSimulatorService:
    def __init__(self):
        self.simulator = None
        self.loop = None
        
        if BuildingSimulator:
            self.simulator = BuildingSimulator(self._on_simulator_update)
            # Default to paused, wait for frontend to start
            self.simulator.stream.pause()
            self.simulator.start()

    def set_loop(self, loop: asyncio.AbstractEventLoop):
        """Set the event loop used for broadcasting websocket messages."""
        self.loop = loop

    def _on_simulator_update(self, telemetry, decision, time_str, scenario):
        if not self.loop:
            return

        try:
            # We must dump the pydantic telemetry object to a dict
            if hasattr(telemetry, "model_dump"):
                telemetry_data = telemetry.model_dump()
            elif hasattr(telemetry, "dict"):
                telemetry_data = telemetry.dict()
            else:
                telemetry_data = telemetry

            payload = {
                "type": "simulation_tick",
                "data": {
                    "telemetry": telemetry_data,
                    "decision": decision,
                    "time_str": time_str,
                    "scenario": scenario
                }
            }
            # Safely schedule the async broadcast onto the event loop
            asyncio.run_coroutine_threadsafe(
                ws_manager.broadcast(payload, channel="simulation"),
                self.loop
            )
        except Exception as e:
            logger.error(f"Error broadcasting simulation update: {e}", exc_info=True)

    def set_mode(self, mode: str, speed: int = 1):
        if not self.simulator:
            return {"status": "error", "message": "Simulator not initialized"}

        if mode == "live":
            self.simulator.stream.resume()
            self.simulator.stream.clock.set_time_scale(float(speed))
            # Just set a normal working scenario
            self.simulator.set_scenario("Morning Rush")
        elif mode == "random":
            self.simulator.stream.resume()
            self.simulator.stream.clock.set_time_scale(float(speed))
            # Or another scenario or switch randomly
            self.simulator.set_scenario("Ghost Booking") # For now, pick a known one to see anomalies
        elif mode == "pause":
            self.simulator.stream.pause()
            
        return {"status": "success", "mode": mode, "speed": speed}

live_simulator = LiveSimulatorService()
