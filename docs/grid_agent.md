# Grid Agent Documentation

## 1. Purpose
The Grid Agent acts as the financial and carbon-aware layer of the system. It monitors external grid signals, dynamic pricing, and carbon intensity to optimize the building's energy consumption schedule without compromising safety or occupancy comfort.

## 2. Architecture
The agent perfectly mirrors the Occupancy Agent architecture to ensure horizontal scaling and maintenance ease:
- **Pipeline Runner**: Central `GridAgent` executing the flow.
- **Intelligence Facade**: Orchestrates the interaction between deterministic rules and Groq LLM predictions.
- **Micro-Engines**: Segmented into Rules, Predictions, Confidence, and Fallback.

## 3. Inputs
Ingests a `GridInputState` schema containing:
- **Pricing & Carbon**: Current grid price and carbon intensity values.
- **Energy Context**: Current building load and available battery state-of-charge (SoC).
- **Time Context**: Current time and peak pricing schedules.

## 4. Outputs
Outputs are embedded into the `grid_metrics` key on the state, structured by `GridOutput`:
- **Pricing Tier**: CHEAP, NORMAL, PEAK, CRITICAL.
- **Battery Strategy**: CHARGE, HOLD, DISCHARGE.
- **Load Queues**: `recommended_loads`, `delayable_loads`, `critical_loads`.
- **Reasoning**: A combined string of deterministic bounds and LLM analysis.

## 5. Workflow
1. The `GridAgent` catches the `raw_state` and validates the Grid-specific fields.
2. The `GridRulesEngine` evaluates immediate cost boundaries and sets baseline battery strategies (e.g., discharge if peak price).
3. The `GridIntelligenceFacade` injects the LLM via `GridPromptBuilder` to intelligently categorize building loads based on the deterministic limits.
4. Output is attached to `state.grid_metrics` and the full state is dumped back to the LangGraph supervisor.

## 6. Prompt
The `GridPromptBuilder` enforces a strict JSON schema explicitly demanding keys for `reasoning`, `recommendations`, `recommended_loads`, `delayable_loads`, and `critical_loads`.

## 7. Business Rules
The `GridRulesEngine` operates deterministically:
- Categorizes grid pricing against configured thresholds.
- Assigns a firm battery strategy (e.g., if PEAK -> DISCHARGE; if CHEAP -> CHARGE).
- Evaluates carbon intensity against strict sustainability targets.

## 8. Reasoning
The `GridExplainabilityEngine` merges the deterministic logs (e.g., "Grid price is $0.50 (PEAK)") with the LLM's dynamic load management reasoning (e.g., "Delaying EV charging until off-peak hours to save $45").

## 9. Confidence
The `GridConfidenceEngine` drops confidence mathematically if critical signals (like `historical_load_trend`) are missing or corrupted, ensuring the broader system knows when the Grid Agent is operating "blind".

## 10. Failure Handling
The `GridFallbackEngine` (`grid_fallback.py`) guarantees continuous operation. If Groq times out or returns malformed JSON, the fallback engages, returning safe baseline pricing tiers and preventing the system from making reckless financial trades.

## 11. Groq Integration
Uses Groq to dynamically assess the nuance of specific loads and recommend exactly which heavy equipment to delay vs run. It uses `_call_llm` logic directly in the intelligence facade to parse and extract the structured responses.

## 12. Folder Structure
```text
ai/agents/grid/
├── __init__.py
├── grid_agent.py
├── grid_confidence.py
├── grid_constants.py
├── grid_explainer.py
├── grid_fallback.py
├── grid_intelligence.py
├── grid_prediction.py
├── grid_prompt.py
├── grid_rules.py
├── grid_schema.py
├── README.md
└── tests/
    └── test_grid.py
```

## 13. Testing
Tested in `tests/test_grid.py` with:
- Invalid schema trapping (triggering `CRITICAL` fallback).
- End-to-End LLM logic using `MockLLMClient` to ensure payload dictionaries are correctly merged into `grid_metrics` without destroying Graph State properties.
