import asyncio
import logging
import math
import time
from typing import Dict, Any, Optional, Callable
from backend.app.domain.schemas.digital_twin import DigitalTwinState, ScenarioConfig

logger = logging.getLogger(__name__)

# Predefined Deterministic Scenarios
PREDEFINED_SCENARIOS: Dict[str, ScenarioConfig] = {
    "morning_peak": ScenarioConfig(
        scenario_id="morning_peak",
        scenario_name="Morning Peak Demand",
        description="High building occupancy with rising solar generation and peak morning HVAC load.",
        duration_seconds=3600,
        base_occupancy=280,
        temp_peak=32.0,
        temp_base=22.0,
        solar_peak_kw=200.0,
        price_peak_dollars=0.28,
        price_base_dollars=0.14,
    ),
    "heatwave_grid_stress": ScenarioConfig(
        scenario_id="heatwave_grid_stress",
        scenario_name="Extreme Summer Heatwave",
        description="Extreme outdoor temperatures causing maximum HVAC demand and high electricity prices.",
        duration_seconds=7200,
        base_occupancy=320,
        temp_peak=41.0,
        temp_base=28.0,
        solar_peak_kw=320.0,
        price_peak_dollars=0.55,
        price_base_dollars=0.22,
    ),
    "night_charging_baseload": ScenarioConfig(
        scenario_id="night_charging_baseload",
        scenario_name="Night-time Battery Charging & Baseload",
        description="Low building occupancy with off-peak electricity grid charging.",
        duration_seconds=3600,
        base_occupancy=15,
        temp_peak=22.0,
        temp_base=18.0,
        solar_peak_kw=0.0,
        price_peak_dollars=0.10,
        price_base_dollars=0.08,
    )
}


class DigitalTwinStateStore:
    """
    Authoritative Digital Twin State Store.
    Thread-safe single state store with atomic read/write.
    """
    def __init__(self):
        self._state = DigitalTwinState()
        self._lock = asyncio.Lock()

    async def get_state(self) -> DigitalTwinState:
        async with self._lock:
            return self._state.model_copy()

    async def update_state(self, new_state: DigitalTwinState) -> DigitalTwinState:
        async with self._lock:
            self._state = new_state.model_copy()
            return self._state.model_copy()

    async def reset_state(self) -> DigitalTwinState:
        async with self._lock:
            self._state = DigitalTwinState()
            return self._state.model_copy()


class SimulationEngine:
    """
    Production Simulation Engine.
    Advances digital twin state every 2 seconds following smooth, deterministic curves.
    Never uses random numbers.
    """
    def __init__(self, state_store: DigitalTwinStateStore):
        self.state_store = state_store
        self.is_running: bool = False
        self.is_paused: bool = False
        self.tick_interval: float = 2.0  # Advances every 2 seconds
        self.speed_multiplier: float = 1.0
        self.current_step: int = 0
        self.active_scenario: ScenarioConfig = PREDEFINED_SCENARIOS["morning_peak"]
        self._task: Optional[asyncio.Task] = None
        self._subscribers: list[Callable[[DigitalTwinState], None]] = []

    def register_subscriber(self, callback: Callable[[DigitalTwinState], None]):
        """Register subscriber callback for state updates (WebSocket streaming)."""
        if callback not in self._subscribers:
            self._subscribers.append(callback)

    def load_scenario(self, scenario_id: str):
        if scenario_id in PREDEFINED_SCENARIOS:
            self.active_scenario = PREDEFINED_SCENARIOS[scenario_id]
            logger.info(f"Loaded scenario: {self.active_scenario.scenario_name}")
        else:
            logger.warning(f"Scenario {scenario_id} not found. Defaulting to morning_peak.")
            self.active_scenario = PREDEFINED_SCENARIOS["morning_peak"]

    async def start(self, scenario_id: Optional[str] = None):
        if scenario_id:
            self.load_scenario(scenario_id)
        
        self.is_running = True
        self.is_paused = False
        if not self._task or self._task.done():
            self._task = asyncio.create_task(self._run_loop())
        logger.info("Simulation Engine started.")

    async def pause(self):
        self.is_paused = True
        logger.info("Simulation Engine paused.")

    async def resume(self):
        self.is_paused = False
        logger.info("Simulation Engine resumed.")

    async def reset(self):
        self.current_step = 0
        await self.state_store.reset_state()
        logger.info("Simulation Engine reset.")

    async def stop(self):
        self.is_running = False
        self.is_paused = False
        if self._task and not self._task.done():
            self._task.cancel()
        logger.info("Simulation Engine stopped.")

    def set_speed(self, multiplier: float):
        self.speed_multiplier = max(0.1, min(multiplier, 10.0))
        logger.info(f"Simulation speed set to {self.speed_multiplier}x")

    async def _run_loop(self):
        while self.is_running:
            try:
                if not self.is_paused:
                    self.current_step += 1
                    new_state = await self._calculate_next_state()
                    await self.state_store.update_state(new_state)

                    # Notify WebSocket subscribers
                    for cb in self._subscribers:
                        try:
                            if asyncio.iscoroutinefunction(cb):
                                await cb(new_state)
                            else:
                                cb(new_state)
                        except Exception as sub_err:
                            logger.error(f"Subscriber notification error: {sub_err}")

                sleep_time = max(0.1, self.tick_interval / self.speed_multiplier)
                await asyncio.sleep(sleep_time)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in simulation loop: {e}", exc_info=True)
                await asyncio.sleep(self.tick_interval)

    async def _calculate_next_state(self) -> DigitalTwinState:
        """
        Deterministic state calculation using sine/cosine harmonic curves.
        Never generates random values.
        """
        cfg = self.active_scenario
        step = self.current_step

        # Smooth cyclic phase over 100 ticks
        phase = (step % 100) / 100.0 * 2.0 * math.pi

        # Deterministic Outdoor Temperature Curve
        outdoor_temp = cfg.temp_base + (cfg.temp_peak - cfg.temp_base) * 0.5 * (1 + math.sin(phase - math.pi / 2))
        
        # Indoor Temperature smooth response curve
        indoor_temp = 21.5 + 1.5 * math.sin(phase / 2.0)

        # Occupancy Curve
        occupancy_ratio = max(0.0, math.sin(phase))
        occupancy = int(cfg.base_occupancy * occupancy_ratio)

        # Solar Generation (kW)
        solar_ratio = max(0.0, math.sin(phase))
        solar = round(cfg.solar_peak_kw * solar_ratio, 2)

        # HVAC Consumption (kW) proportional to thermal gap & occupancy
        thermal_load = max(0.0, outdoor_temp - 22.0) * 12.0
        hvac = round(100.0 + thermal_load + (occupancy * 0.25), 2)

        # Lighting Consumption (kW) inversely proportional to solar
        lighting = round(30.0 + 35.0 * (1.0 - solar_ratio), 2)

        # Total Building Load (kW)
        building_load = round(hvac + lighting + 40.0, 2)

        # Battery State of Charge (%) smooth charging/discharging
        battery = round(50.0 + 35.0 * math.cos(phase), 2)

        # Net Grid Import (kW)
        grid_import = max(0.0, round(building_load - solar, 2))

        # Electricity Price ($/kWh)
        price = round(cfg.price_base_dollars + (cfg.price_peak_dollars - cfg.price_base_dollars) * max(0.0, math.sin(phase)), 3)

        return DigitalTwinState(
            timestamp=time.time(),
            outdoor_temperature=round(outdoor_temp, 2),
            indoor_temperature=round(indoor_temp, 2),
            occupancy=occupancy,
            solar=solar,
            battery=battery,
            hvac=hvac,
            lighting=lighting,
            grid_import=grid_import,
            building_load=building_load,
            electricity_price=price,
        )


# Global Singleton Instances
digital_twin_store = DigitalTwinStateStore()
simulation_engine = SimulationEngine(digital_twin_store)
