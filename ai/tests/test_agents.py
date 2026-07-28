import pytest
from agents.occupancy import OccupancyAgent
from agents.thermal import ThermalAgent
from ai.state import DigitalTwinState

@pytest.fixture
def mock_twin_state():
    return DigitalTwinState(
        occupancy_metrics={"zone_a": 42},
        thermal_metrics={"zone_a_temp": 22.5}
    )

@pytest.mark.asyncio
async def test_occupancy_agent_fallback(mock_twin_state):
    # Tests that the agent returns the mocked Pydantic schema if LLM is not configured
    agent = OccupancyAgent()
    agent.llm = None
    
    state = {"twin_state": mock_twin_state}
    result = await agent.process(state)
    
    assert result.zone_id == "Zone-A"
    assert result.current_occupancy == 42
    
@pytest.mark.asyncio
async def test_thermal_agent_fallback(mock_twin_state):
    agent = ThermalAgent()
    agent.llm = None
    
    state = {"twin_state": mock_twin_state}
    result = await agent.process(state)
    
    assert result.hvac_mode in ["Heating", "Cooling", "Fan", "Off"]
