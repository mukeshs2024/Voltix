"""
1. Purpose: Configuration management for the Occupancy Agent.
2. Responsibilities: Centralize all magic numbers, thresholds, and tuning parameters.
3. Folder location: ai/agents/occupancy/
"""


class OccupancyConfig:
    # Activity Thresholds (Percentage)
    ACTIVITY_LOW_THRESHOLD = 0.25
    ACTIVITY_MODERATE_THRESHOLD = 0.75
    ACTIVITY_HIGH_THRESHOLD = 1.0

    # Utilization Thresholds
    UTILIZATION_UNDER_THRESHOLD = 0.4
    UTILIZATION_OPTIMAL_THRESHOLD = 0.8
    UTILIZATION_OVER_THRESHOLD = 1.0

    # Trend Thresholds
    TREND_INCREASING_THRESHOLD = 0.5

    # Base Confidence Scores
    CONFIDENCE_BASE = 0.5
    CONFIDENCE_NO_SENSOR = 0.1
    CONFIDENCE_HARD_SENSOR_BONUS = 0.3
    CONFIDENCE_CO2_BONUS = 0.1
    CONFIDENCE_PIR_BONUS = 0.05
    CONFIDENCE_STALE_PENALTY = 0.3
    CONFIDENCE_DISAGREEMENT_PENALTY = 0.2
    SENSOR_FRESHNESS_WINDOW_SECS = 300

    # Anomaly Tuning
    GHOST_MEETING_TIMEOUT_MINS = 15
    CO2_HIGH_PPM = 800
    STATIC_CROWD_THRESHOLD = 0.5
    SENSOR_DISAGREEMENT_OCCUPANCY_RATIO = 0.1

    # Prediction Lookahead
    PREDICTION_LOOKAHEAD_MINS = 30

    # Fallback Tuning
    FALLBACK_HIGH_CO2_OCCUPANCY_RATIO = 0.5
    FALLBACK_MOTION_OCCUPANCY_RATIO = 0.1
    FALLBACK_CONFIDENCE = 0.4
