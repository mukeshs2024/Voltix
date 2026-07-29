# Grid Agent

The Grid Agent represents the building's view of the electrical grid.
It analyzes external electrical conditions and recommends strategies without directly controlling equipment.

## Architecture

Follows the exact architecture of the Occupancy Agent.

- **grid_agent.py**: Pipeline runner
- **grid_intelligence.py**: Orchestrator
- **grid_rules.py**: Deterministic business logic
- **grid_schema.py**: Pydantic models
- **grid_constants.py**: Enums
- **grid_prediction.py**: LLM-based forecaster
- **grid_confidence.py**: Confidence calculator
- **grid_prompt.py**: Prompt builder
- **grid_explainer.py**: Reasoner
