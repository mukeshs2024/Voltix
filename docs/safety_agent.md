# Safety Agent Documentation

## 1. Purpose
The Safety Agent is the absolute authority in the Voltix system. It acts as the final gatekeeper, evaluating all optimizations and building recommendations against critical life-safety constraints (fire, smoke, CO2, occupancy limits, and blocked exits) to ensure no action harms occupants.

## 2. Architecture
The agent is designed for extreme reliability, mimicking the exact modular structure of the Occupancy Agent but tailored for validation rather than generation:
- **Pipeline Runner**: Central `SafetyAgent` wrapper.
- **Intelligence Facade**: Coordinates validation checks.
- **Micro-Engines**: Dedicated rules, validator, fallback, and explainer engines.

## 3. Inputs
Accepts `SafetyInputState` containing life-safety telemetry:
- **Sensors**: Fire alarms, smoke detectors, CO2 levels, zone temperatures.
- **Status**: Occupancy counts vs building capacity, emergency exit status.
- **Actions**: The `current_building_recommendations` queue from upstream agents.

## 4. Outputs
Outputs are saved into `safety_metrics` on the state via `SafetyOutput`:
- **Status**: SAFE, WARNING, CRITICAL.
- **Action Queues**: Segregated lists of `allowed_actions` and `blocked_actions`.
- **Emergency Flag**: Boolean flag that instantly triggers building-wide overrides.

## 5. Workflow
1. The `SafetyAgent` receives the global state and isolates safety parameters.
2. The `SafetyRulesEngine` deterministically scans for critical triggers (e.g., fire alarm = True).
3. The `SafetyValidator` loops through all upstream recommendations, blocking anything that violates current emergency states.
4. The `SafetyIntelligenceFacade` requests Groq to provide deeper context or catch nuanced risks in allowed actions.
5. `safety_metrics` is attached and returned to the LangGraph supervisor.

## 6. Prompt
The `SafetyPromptBuilder` issues a strict JSON schema prompt to Groq demanding final evaluation of `reasoning`, `allowed_actions`, and `blocked_actions`.

## 7. Business Rules
The `SafetyRulesEngine` is non-negotiable and deterministic:
- Fire/Smoke detected -> Trigger Emergency protocols, block optimizations.
- CO2 > 1000ppm -> Increase ventilation.
- Occupancy > Capacity -> Overcrowding violations.
- Emergency Exit Blocked -> Immediate CRITICAL status.

## 8. Reasoning
The `SafetyExplainabilityEngine` surfaces exact deterministic violations (e.g., "CO2 level critically high") and merges them with LLM context to provide facilities managers with clear, actionable rationale as to why specific HVAC commands were blocked.

## 9. Confidence
The `SafetyConfidenceEngine` reduces safety scores if `equipment_health` is UNKNOWN or `hvac_status` is unresponsive, explicitly communicating that the agent cannot guarantee safety if it cannot see the equipment.

## 10. Failure Handling
The `SafetyFallbackEngine` (`safety_fallback.py`) provides absolute resilience. If the primary LLM pipeline fails for any reason, the system falls back exclusively to the deterministic `SafetyRulesEngine`. It will proactively flag emergencies if the fallback payload is fundamentally corrupted.

## 11. Groq Integration
While rules handle hard constraints, Groq evaluates the nuance of the `current_building_recommendations` queue against the building's current state. It uses the standard `_call_llm` and robust JSON extraction to populate the allowed/blocked queues.

## 12. Folder Structure
```text
ai/agents/safety/
├── __init__.py
├── safety_agent.py
├── safety_confidence.py
├── safety_constants.py
├── safety_explainer.py
├── safety_fallback.py
├── safety_intelligence.py
├── safety_prompt.py
├── safety_rules.py
├── safety_schema.py
├── safety_validator.py
├── README.md
└── tests/
    └── test_safety.py
```

## 13. Testing
Tested in `tests/test_safety.py` covering:
- Deterministic boundary conditions (e.g., CO2 warnings, blocked emergency exits).
- Schema failure trapping (triggering `CRITICAL` default).
- E2E Integration using `MockLLMClient` to ensure payload dictionaries properly attach to `safety_metrics`.
