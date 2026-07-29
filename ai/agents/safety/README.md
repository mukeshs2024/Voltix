# Safety Agent

The Safety Agent is the final safety authority. It validates recommendations against safety constraints (fire, smoke, capacity, CO2) before execution.

## Architecture

Follows the exact architecture of the Occupancy Agent.

- **safety_agent.py**: Pipeline runner
- **safety_intelligence.py**: Orchestrator
- **safety_rules.py**: Deterministic safety rules
- **safety_validator.py**: Validates allowed and blocked actions
- **safety_schema.py**: Pydantic models
- **safety_constants.py**: Enums
- **safety_confidence.py**: Confidence calculator
- **safety_prompt.py**: Prompt builder
- **safety_explainer.py**: Reasoner
