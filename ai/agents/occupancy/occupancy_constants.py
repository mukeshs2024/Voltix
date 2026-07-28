"""
1. Purpose: Defines strict enumerations and constants for the Occupancy Agent.
2. Responsibilities: Maintain consistent types for Activity Levels, Utilization, Trends, and Anomalies.
3. Folder location: ai/agents/occupancy/
"""
from enum import Enum

class ActivityLevel(str, Enum):
    EMPTY = "EMPTY"
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    PEAK = "PEAK"

class UtilizationStatus(str, Enum):
    UNDERUTILIZED = "UNDERUTILIZED"
    OPTIMAL = "OPTIMAL"
    OVERUTILIZED = "OVERUTILIZED"
    CRITICAL = "CRITICAL"

class TrendDirection(str, Enum):
    INCREASING = "INCREASING"
    STABLE = "STABLE"
    DECREASING = "DECREASING"

class AnomalySeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class SensorType(str, Enum):
    PIR = "PIR"
    TOF = "TOF"
    CO2 = "CO2"
    ACS = "ACS"
    WIFI = "WIFI"
