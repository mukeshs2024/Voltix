from pydantic import BaseModel, Field
from typing import List

class ThermalState(BaseModel):
    current_temperature: float = Field(..., description="Current zone temperature")
    current_setpoint: float = Field(..., description="Current HVAC setpoint")
    hvac_mode: str = Field(..., description="Current mode (HEAT, COOL, AUTO)")

class ThermalOutput(BaseModel):
    recommended_setpoint: float = Field(..., description="Agent recommended setpoint")
    hvac_mode: str = Field(..., description="Recommended HVAC mode")
    reasoning: str = Field(..., description="Explanation of thermal decision")
    anomalies: List[str] = Field(default_factory=list)
