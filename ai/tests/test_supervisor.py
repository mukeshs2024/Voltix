import pytest
from decision_engine.supervisor import DecisionEngineSupervisor
from ai.state import DigitalTwinState

def test_supervisor_static_routing_fallback():
    supervisor = DecisionEngineSupervisor()
    supervisor.llm = None # Force fallback behavior
    
    state = {
        "twin_state": DigitalTwinState(),
        "proposed_actions": []
    }
    
    # Initially should route to the first agent
    result = supervisor.process_state(state)
    assert result["active_agent"] is not None
    assert result["consensus_reached"] is False
    
    # Simulate all agents have executed
    state["proposed_actions"] = [{agent: {}} for agent in supervisor.available_agents]
    result2 = supervisor.process_state(state)
    
    # Should reach consensus
    assert result2["active_agent"] is None
    assert result2["consensus_reached"] is True
