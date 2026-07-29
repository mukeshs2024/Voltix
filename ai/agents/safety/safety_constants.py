"""
1. Purpose: Defines strict enumerations and constants for the Safety Agent.
2. Responsibilities: Maintain consistent types for Safety Status, Risk Level, and common constants.
3. Folder location: ai/agents/safety/
"""

from enum import Enum


class SafetyStatus(str, Enum):
    SAFE = "SAFE"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    EXTREME = "EXTREME"


class SafetyConfig:
    CO2_THRESHOLD_WARNING = 1000
    CO2_THRESHOLD_CRITICAL = 2000
    TEMP_MAX_CRITICAL = 35.0
    TEMP_MIN_CRITICAL = 10.0
