import asyncio
import logging
from typing import Dict, Any, List
from typing_extensions import TypedDict

from agents.all_agents import (
    OccupancyAgent,
    ThermalAgent,
    EnergyAgent,
    EquipmentAgent,
    GridAgent,
    SafetyAgent,
)
from decision_engine.consensus import ConsensusEngine
from memory.shared_memory import shared_memory, AgentRecommendation, OptimizationPlan

logger = logging.getLogger(__name__)


# Instantiate ALL 6 Specialized AI Agents
occupancy_agent = OccupancyAgent()
thermal_agent = ThermalAgent()
energy_agent = EnergyAgent()
equipment_agent = EquipmentAgent()
grid_agent = GridAgent()
safety_agent = SafetyAgent()


class AIOrchestrator:
    """
    Main Multi-Agent Orchestrator for Voltix.
    Integrates all 6 specialized agents (Occupancy, Thermal, Energy, Equipment, Grid, Safety)
    to process the Digital Twin telemetry, communicate via shared memory, and generate 
    a single unified Optimization Plan through Consensus Engine conflict resolution.
    """
    @staticmethod
    async def run_cycle(twin_state: Dict[str, Any]) -> OptimizationPlan:
        # Run all 6 agent intelligence analysis pipelines concurrently
        tasks = [
            occupancy_agent.process(twin_state),
            thermal_agent.process(twin_state),
            energy_agent.process(twin_state),
            equipment_agent.process(twin_state),
            grid_agent.process(twin_state),
            safety_agent.process(twin_state),
        ]
        
        recs_list = await asyncio.gather(*tasks)
        
        agent_recs: Dict[str, AgentRecommendation] = {
            rec.agent_name: rec for rec in recs_list
        }

        # Evaluate consensus across all 6 agents and resolve conflicts
        plan: OptimizationPlan = ConsensusEngine.evaluate(agent_recs)

        # Store complete traces in shared memory
        await shared_memory.store_twin_state(twin_state)
        await shared_memory.store_agent_recommendations(agent_recs)
        await shared_memory.store_optimization_plan(plan)

        return plan
