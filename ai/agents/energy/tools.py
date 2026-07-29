"""
Deterministic Calculation Tools and Rule Engine for Energy Agent.
Used for standalone rule evaluation and deterministic fallback execution when LLM is unavailable.
"""

from .schemas import EnergyInput, EnergyRecommendation, BatterySchedule, LoadShiftDetail


def detect_peak_pricing(grid_pricing: str, tariff: float) -> bool:
    """Returns True if current grid pricing tier or tariff indicates peak pricing."""
    tier_clean = grid_pricing.strip().lower()
    return tier_clean in ("on_peak", "critical_peak") or tariff >= 0.35


def calculate_battery_dispatch(battery_level: float, is_peak: bool, solar_kw: float, hvac_kw: float) -> BatterySchedule:
    """Determines battery charge/discharge schedule deterministically."""
    if is_peak and battery_level > 20.0:
        # Discharge battery to shave peak load
        discharge_rate = min(80.0, battery_level - 10.0)
        return BatterySchedule(action="discharge", rate_pct=round(discharge_rate, 1))
    elif solar_kw > hvac_kw and battery_level < 95.0:
        # Surplus solar power charges battery
        charge_rate = min(75.0, 100.0 - battery_level)
        return BatterySchedule(action="charge", rate_pct=round(charge_rate, 1))
    else:
        return BatterySchedule(action="idle", rate_pct=0.0)


def calculate_load_shift(hvac_kw: float, peak_limit: float, occupancy: int) -> LoadShiftDetail:
    """Calculates load reduction target based on HVAC load vs peak limit and occupancy."""
    if hvac_kw > peak_limit * 0.8:
        kw_to_shed = round(min(hvac_kw * 0.25, hvac_kw - (peak_limit * 0.75)), 2)
        return LoadShiftDetail(
            target_appliance="HVAC Air Handling Unit 1 & Chiller Cycle",
            kw_reduction=max(5.0, kw_to_shed),
            recommended_start="14:00",
            recommended_end="18:00"
        )
    return LoadShiftDetail(
        target_appliance="Non-critical Ventilation Fans",
        kw_reduction=0.0,
        recommended_start="00:00",
        recommended_end="00:00"
    )


def run_deterministic_fallback(input_data: EnergyInput) -> EnergyRecommendation:
    """
    Executes a deterministic rule-based optimization engine.
    Used as an operational fallback when the Groq LLM API is unreachable or fails.
    """
    is_peak = detect_peak_pricing(input_data.grid_pricing, input_data.electricity_tariff)
    battery_sched = calculate_battery_dispatch(
        input_data.battery_level,
        is_peak,
        input_data.solar_production,
        input_data.hvac_consumption
    )
    load_shift = calculate_load_shift(
        input_data.hvac_consumption,
        input_data.peak_demand,
        input_data.predicted_occupancy
    )

    # Battery power contribution estimation (assuming 50kW max battery rating)
    max_battery_kw = 50.0
    battery_kw_supplied = (max_battery_kw * (battery_sched.rate_pct / 100.0)) if battery_sched.action == "discharge" else 0.0
    battery_kw_absorbed = (max_battery_kw * (battery_sched.rate_pct / 100.0)) if battery_sched.action == "charge" else 0.0

    effective_hvac = max(0.0, input_data.hvac_consumption - load_shift.kw_reduction)
    net_grid_draw = max(0.0, effective_hvac + battery_kw_absorbed - input_data.solar_production - battery_kw_supplied)

    # Cost calculations
    unoptimized_cost = round(input_data.hvac_consumption * input_data.electricity_tariff, 2)
    optimized_cost = round(net_grid_draw * input_data.electricity_tariff, 2)
    savings = max(0.0, round(unoptimized_cost - optimized_cost, 2))

    reasoning_parts = []
    if is_peak:
        reasoning_parts.append(f"Grid pricing tier '{input_data.grid_pricing}' indicates peak demand.")
    if battery_sched.action == "discharge":
        reasoning_parts.append(f"Discharging battery at {battery_sched.rate_pct}% to offset grid load.")
    elif battery_sched.action == "charge":
        reasoning_parts.append(f"Charging battery at {battery_sched.rate_pct}% using solar generation.")

    if load_shift.kw_reduction > 0:
        reasoning_parts.append(f"Shifting {load_shift.kw_reduction} kW load from {load_shift.target_appliance}.")

    reasoning_parts.append(f"Solar generation offsets {min(input_data.solar_production, input_data.hvac_consumption)} kW directly.")
    reasoning_str = " ".join(reasoning_parts)

    strategy_name = "Peak Demand Shaving & Storage Dispatch" if is_peak else "Standard Solar Offset Strategy"

    return EnergyRecommendation(
        recommendation=f"Deterministic Rule Fallback: {strategy_name}. Target grid draw: {round(net_grid_draw, 2)} kW.",
        battery_schedule=battery_sched,
        grid_usage_kw=round(net_grid_draw, 2),
        load_shifting=load_shift,
        cost_estimation=optimized_cost,
        energy_savings=savings,
        reasoning=reasoning_str,
        confidence=0.88
    )
