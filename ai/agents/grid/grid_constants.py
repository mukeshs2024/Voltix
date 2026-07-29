"""
1. Purpose: Defines strict enumerations and constants for the Grid Agent.
2. Responsibilities: Maintain consistent types for Pricing Tiers, Battery Strategies, Carbon Levels, and Grid Status.
3. Folder location: ai/agents/grid/
"""

from enum import Enum


class PricingTier(str, Enum):
    OFF_PEAK = "OFF_PEAK"
    MID_PEAK = "MID_PEAK"
    ON_PEAK = "ON_PEAK"
    CRITICAL = "CRITICAL"


class BatteryStrategy(str, Enum):
    CHARGE = "CHARGE"
    HOLD = "HOLD"
    DISCHARGE = "DISCHARGE"
    LOAD_SHIFT = "LOAD_SHIFT"


class CarbonLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class GridStatus(str, Enum):
    NORMAL = "NORMAL"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class GridConfig:
    BATTERY_CHARGE_THRESHOLD = 80.0
    BATTERY_DISCHARGE_THRESHOLD = 70.0
