# Occupancy Agent Documentation

## 1. Purpose
The Occupancy Agent is responsible for predicting, tracking, and optimizing building occupancy in real-time. It acts as the foundational layer for thermal and energy optimization, ensuring the system accurately understands how humans are utilizing the physical space.

## 2. Architecture
The agent leverages an orchestrated, modular pipeline architecture:
- **Pipeline Runner**: Wraps execution in observability and error handling.
- **Intelligence Facade**: Central orchestrator that merges outputs from deterministic engines and the LLM.
- **Micro-Engines**: Specialized modules for rules, predictions, explainability, and confidence calculation.

## 3. Inputs
The agent ingests a `SharedState` schema that includes:
- **Zone Topology**: Capacity and square footage.
- **Sensors**: Real-time PIR, TOF, CO2, ACS, and Wi-Fi data.
- **Calendar**: Expected meeting schedules and attendee counts.

## 4. Outputs
The agent outputs `OccupancyOutput` embedded directly into the state model, providing:
- **Occupancy Metrics**: Current count, percentage, activity level, and utilization status.
- **Trend & Predictions**: Direction of occupancy change and 15/30/60-minute predictions.
- **Anomalies**: Any detected irregularities (e.g., tailgating, ghost meetings).
- **Reasoning & Confidence**: Explanations of how the metrics were derived.

## 5. Workflow
1. The pipeline receives the `raw_state` dictionary.
2. Validates the state via `SharedState` Pydantic models.
3. The `OccupancyIntelligenceFacade` orchestrates execution:
   - Evaluates deterministic rules (current occupancy, trends).
   - Calculates data confidence based on sensor health.
   - Pings Groq LLM for probabilistic predictions and anomalies.
   - Merges rule logs with LLM reasoning.
4. Wraps the results in the `SharedState` model and returns the full JSON-serialized dict.

## 6. Prompt
The `OccupancyPromptBuilder` constructs a strict JSON-enforced prompt containing:
- Live sensor telemetry.
- Current occupancy rule evaluations.
- It instructs the LLM to output specific predictions, anomalies, reasoning, and confidence factors in an exact JSON schema.

## 7. Business Rules
The `OccupancyRulesEngine` computes deterministic facts:
- Aggregates Time-of-Flight (TOF) inputs for absolute counts.
- Uses PIR sensors to establish baseline activity levels (LOW, MEDIUM, HIGH).
- Validates trends by comparing recent historical windows to current counts.

## 8. Reasoning
The `OccupancyExplainabilityEngine` pairs deterministic rule traces (e.g., "TOF sensors detected 45 people") with LLM-generated intuition (e.g., "PIR activity indicates high movement typical of a shift change") into a cohesive, human-readable string.

## 9. Confidence
The `OccupancyConfidenceEngine` calculates a score (0.0 to 1.0) mathematically:
- Missing critical sensors lower confidence.
- Mismatches between Wi-Fi counts and TOF counts introduce uncertainty.

## 10. Failure Handling
The `FallbackEngine` ensures the agent never crashes. If the Groq LLM times out or hallucinates an invalid JSON schema, the `rescue_state` mechanism safely wraps the deterministic rule outputs in a safe baseline schema and flags an error for the supervisor.

## 11. Groq Integration
Uses Groq's high-speed inference for:
- Predicting occupancy 15, 30, and 60 minutes into the future based on calendar events vs actual presence.
- Detecting complex anomalies like "Ghost Meetings" (calendar says 20, sensors say 0).
The `OccupancyPredictionEngine` uses a standardized `_call_llm` execution block with JSON extraction.

## 12. Folder Structure
```text
ai/agents/occupancy/
├── __init__.py
├── fallback.py
├── occupancy_agent.py
├── occupancy_confidence.py
├── occupancy_constants.py
├── occupancy_explainer.py
├── occupancy_intelligence.py
├── occupancy_prediction.py
├── occupancy_prompt.py
├── occupancy_rules.py
├── occupancy_schema.py
├── README.md
└── tests/
    └── test_occupancy.py
```

## 13. Testing
Tests reside in `tests/test_occupancy.py` and include:
- **Unit Tests**: Verifying schema adherence and fallback execution during corrupted payloads.
- **Integration Tests**: Utilizing a `MockLLMClient` to ensure the entire pipeline executes, parses JSON, and merges strings perfectly without failure.
