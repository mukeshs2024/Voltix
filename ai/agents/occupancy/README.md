# Voltix Occupancy Agent

## Overview
The Occupancy Agent is the flagship reference implementation of a Voltix Domain Agent. It strictly adheres to Clean Architecture, SOLID principles, and enterprise production standards.

It is responsible for parsing raw building telemetry (sensors, calendars, zone topologies) and generating highly structured, deterministic, and explainable insights regarding the real-time occupancy state of a building.

## Architecture Pipeline

1. **`occupancy_agent.py`**: The main entry point. Ingests the raw JSON `SharedState` and handles fallback/recovery if parsing fails.
2. **`occupancy_schema.py`**: Enforces strict input/output bounds using Pydantic `model_validators`.
3. **`occupancy_intelligence.py`**: The central facade that orchestrates all sub-modules.
4. **`occupancy_rules.py`**: Deterministic business rules engine for detecting anomalies (e.g. Overcrowding, Ghost Bookings).
5. **`occupancy_confidence.py`**: Calculates a rigorous confidence score (0.0 to 1.0) based on sensor health, data freshness, and telemetry conflicts.
6. **`occupancy_prediction.py`**: Heuristic and LLM-augmented short-term predictive modeling.
7. **`occupancy_explainer.py`**: Translates the raw telemetry and anomalies into human-readable causal reasoning.

## Configuration
All magic numbers and tuning parameters have been extracted to `config.py`.

## Testing
This module is fully supported by Pytest suites located in the `tests/` directory:
- `test_occupancy_agent.py`: Isolated component unit tests.
- `test_occupancy_integration.py`: End-to-end pipeline execution tests.
