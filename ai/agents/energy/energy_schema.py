from pydantic import BaseModel, Field

class EnergyState(BaseModel):
    current_kw: float = Field(..., description="Current power draw in kW")
    peak_limit_kw: float = Field(..., description="Peak load limit in kW")

class EnergyOutput(BaseModel):
    shedding_recommended: bool = Field(..., description="Whether to trigger load shedding")
    target_kw_reduction: float = Field(..., description="Amount of kW to shed")
    reasoning: str = Field(..., description="Explanation of energy decision")
