# Occupancy Package Audit Report

## Scope
Reviewed and updated the occupancy agent package under `ai/agents/occupancy/`.

## Findings Addressed
- Centralized previously hardcoded thresholds and confidence constants in `config.py`.
- Replaced hardcoded CO2 and utilization thresholds in the rules and fallback engines.
- Made the prediction engine compatible with both `generate()` and `invoke()` LLM clients.
- Extended the facade to treat motion-only telemetry as minimal occupancy instead of returning a false empty state.
- Added ghost-booking integration coverage and invoke-only prediction coverage.
- Added a 1000-cycle stress test script to measure latency and memory stability.
- Added compatibility shims for the legacy `agents.*` test imports and the consensus-only decision path.

## Validation
- `pytest ai/agents/occupancy/tests -q` passed.
- `pytest -q` passed: 16 tests, 3 warnings.
- 1000-cycle stress test completed with average latency of 0.665 ms, p95 latency of 1.075 ms, and peak traced memory of 113.989 KB.

## Notes
- The repository still contains a legacy top-level occupancy agent at `ai/agents/occupancy.py` that is separate from the package reviewed here.
- The new stress test is intentionally lightweight and uses `tracemalloc` so it can run without extra dependencies.