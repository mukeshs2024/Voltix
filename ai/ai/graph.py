from langgraph.graph import StateGraph, END
from ai.state import AgentState
from decision_engine.supervisor import DecisionEngineSupervisor

# Import actual agents
from agents.occupancy import OccupancyAgent
from agents.thermal import ThermalAgent
from agents.energy import EnergyAgent
from agents.equipment import EquipmentAgent
from agents.grid import GridAgent
from agents.safety import SafetyAgent

# Instantiate components
supervisor = DecisionEngineSupervisor()
occupancy_agent = OccupancyAgent()
thermal_agent = ThermalAgent()
energy_agent = EnergyAgent()
equipment_agent = EquipmentAgent()
grid_agent = GridAgent()
safety_agent = SafetyAgent()

def decision_engine_node(state: AgentState):
    """
    Supervisor node that decides which agent should act next or if consensus is reached.
    """
    return supervisor.process_state(state)

def agent_router(state: AgentState):
    """
    Routes to the active agent or ends if consensus is reached.
    """
    if state.get("consensus_reached"):
        return END
    return state.get("active_agent")

def _wrap_agent(agent_instance):
    """Helper to wrap async agent processing into a LangGraph node"""
    async def node_func(state: AgentState):
        result = await agent_instance.process(state)
        # Append proposal to state
        proposals = state.get("proposed_actions", [])
        dumped_result = result if isinstance(result, dict) else result.model_dump()
        proposals.append({agent_instance.name: dumped_result})
        return {"proposed_actions": proposals}
    return node_func

def create_graph() -> StateGraph:
    """
    Constructs the Multi-Agent LangGraph.
    """
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("DecisionEngine", decision_engine_node)
    
    workflow.add_node("OccupancyAgent", _wrap_agent(occupancy_agent))
    workflow.add_node("ThermalAgent", _wrap_agent(thermal_agent))
    workflow.add_node("EnergyAgent", _wrap_agent(energy_agent))
    workflow.add_node("EquipmentAgent", _wrap_agent(equipment_agent))
    workflow.add_node("GridAgent", _wrap_agent(grid_agent))
    workflow.add_node("SafetyAgent", _wrap_agent(safety_agent))
    
    # Add edges
    workflow.set_entry_point("DecisionEngine")
    
    workflow.add_conditional_edges(
        "DecisionEngine",
        agent_router
    )
    
    # All agents return to the Decision Engine
    workflow.add_edge("OccupancyAgent", "DecisionEngine")
    workflow.add_edge("ThermalAgent", "DecisionEngine")
    workflow.add_edge("EnergyAgent", "DecisionEngine")
    workflow.add_edge("EquipmentAgent", "DecisionEngine")
    workflow.add_edge("GridAgent", "DecisionEngine")
    workflow.add_edge("SafetyAgent", "DecisionEngine")
    
    return workflow.compile()
