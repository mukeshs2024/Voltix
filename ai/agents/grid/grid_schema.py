from pydantic import BaseModel, Field

class GridState(BaseModel):
    current_price_kwh: float = Field(..., description="Current utility price")
    demand_response_event: bool = Field(default=False)

class GridOutput(BaseModel):
    cost_optimization_strategy: str = Field(..., description="Strategy to deploy")
    reasoning: str = Field(..., description="Explanation of grid decision")
