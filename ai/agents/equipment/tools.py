"""
Deterministic Calculation Tools and Rule Engine for Equipment Health Agent.
Evaluates physics-based degradation models and serves as deterministic fallback when LLM is unavailable.
"""

from .schemas import EquipmentInput, EquipmentRecommendation


def detect_vibration_anomaly(vibration: float) -> str:
    """Classifies vibration level based on ISO 10816 industrial standards."""
    if vibration >= 7.0:
        return "CRITICAL_VIBRATION_SEVERITY"
    elif vibration >= 4.5:
        return "HIGH_VIBRATION_WARNING"
    elif vibration >= 2.5:
        return "MODERATE_VIBRATION_ELEVATED"
    return "NORMAL_VIBRATION"


def calculate_rul_physics(runtime_hours: float, wear_level: float, temp: float, vibration: float) -> float:
    """
    Calculates Remaining Useful Life (RUL) in operating days using degradation physics parameters.
    Standard lifetime assumption: 30,000 operational hours (~1,250 operating days).
    """
    base_max_hours = 30000.0
    remaining_hours = max(0.0, base_max_hours - runtime_hours)

    # Acceleration degradation multipliers
    thermal_penalty = 1.5 if temp > 85.0 else (1.2 if temp > 75.0 else 1.0)
    vibration_penalty = 2.0 if vibration > 7.0 else (1.4 if vibration > 4.5 else 1.0)
    wear_penalty = 1.0 + (wear_level * 1.5)

    composite_stress_factor = thermal_penalty * vibration_penalty * wear_penalty
    effective_rul_hours = remaining_hours / composite_stress_factor
    effective_rul_days = round(effective_rul_hours / 24.0, 1)

    return max(0.0, effective_rul_days)


def run_deterministic_fallback(input_data: EquipmentInput) -> EquipmentRecommendation:
    """
    Executes a deterministic rule engine for equipment health assessment.
    Serves as an operational fallback when Groq LLM API is unavailable.
    """
    vib_severity = detect_vibration_anomaly(input_data.vibration)
    rul_days = calculate_rul_physics(
        input_data.runtime_hours,
        input_data.wear_level,
        input_data.temperature,
        input_data.vibration
    )

    # Calculate baseline health score (100 - cumulative deductions)
    health = 100.0
    health -= (input_data.wear_level * 35.0)
    health -= (30.0 if input_data.vibration >= 7.0 else (15.0 if input_data.vibration >= 4.5 else 0.0))
    health -= (25.0 if input_data.temperature >= 85.0 else (10.0 if input_data.temperature >= 75.0 else 0.0))
    health -= (len(input_data.error_codes) * 8.0)
    health = max(0.0, min(100.0, round(health, 1)))

    # Compute failure probability
    failure_prob = round(max(0.0, min(1.0, (100.0 - health) / 100.0)), 2)

    # Classify urgency & procedure
    if health < 40.0 or input_data.vibration >= 7.0 or failure_prob >= 0.7:
        urgency = "critical"
        rec = "IMMEDIATE SHUTDOWN & BEARING REPLACEMENT: High vibration and thermal degradation detected."
    elif health < 65.0 or input_data.vibration >= 4.5 or failure_prob >= 0.4:
        urgency = "high"
        rec = "SCHEDULE PREVENTIVE MAINTENANCE: Lubricate bearings, inspect motor alignment within 48 hours."
    elif health < 82.0 or failure_prob >= 0.2:
        urgency = "medium"
        rec = "INSPECT AT NEXT SHIFT: Clean air filters and monitor motor winding resistance."
    else:
        urgency = "low"
        rec = "NORMAL OPERATION: Continue routine monitoring according to maintenance schedule."

    reasoning_str = (
        f"Deterministic Rule Fallback: Asset '{input_data.equipment_id}' evaluated. "
        f"Vibration severity: {vib_severity} ({input_data.vibration} mm/s), Operating Temp: {input_data.temperature}°C, "
        f"Wear Level: {input_data.wear_level * 100}%, Active Errors: {len(input_data.error_codes)}. "
        f"Calculated health score {health}/100 with estimated RUL of {rul_days} days."
    )

    return EquipmentRecommendation(
        health_score=health,
        remaining_useful_life_days=rul_days,
        maintenance_recommendation=rec,
        failure_probability=failure_prob,
        urgency=urgency,
        affected_equipment=input_data.equipment_id,
        reasoning=reasoning_str,
        confidence=0.91
    )
