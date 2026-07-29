import asyncio
import json
import time
from decision_graph import AIOrchestrator


async def test_ai_layer():
    print("=" * 60)
    print("      VOLTIX AI DECISION LAYER - VERIFICATION RUN")
    print("=" * 60)

    # Sample Digital Twin State
    mock_digital_twin_state = {
        "timestamp": time.time(),
        "outdoor_temperature": 36.5,  # High heatwave temperature
        "indoor_temperature": 24.8,   # Comfort threshold exceeded
        "occupancy": 310,            # High occupant headcount
        "solar": 220.0,              # Strong solar output
        "battery": 75.0,             # Battery ready
        "hvac": 315.0,               # High HVAC load
        "lighting": 45.0,
        "grid_import": 250.0,
        "building_load": 415.0,
        "electricity_price": 0.35    # High electricity tariff
    }

    print("\n[1] Input Digital Twin Telemetry Received:")
    print(json.dumps(mock_digital_twin_state, indent=2))

    print("\n[2] Executing Multi-Agent LangGraph Decision Cycle...")
    start_time = time.time()
    plan = await AIOrchestrator.run_cycle(mock_digital_twin_state)
    latency_ms = round((time.time() - start_time) * 1000, 2)

    print(f"\n[3] AI Decision Cycle Completed in {latency_ms} ms!")
    print("\n================ UNIFIED OPTIMIZATION PLAN ================")
    print(f" Plan ID            : {plan.plan_id}")
    print(f" Building Status    : {plan.building_status}")
    print(f" Confidence Score   : {plan.confidence * 100}%")
    print(f" Winning Agents     : {', '.join(plan.winning_agents)}")
    if plan.overridden_agents:
        print(f" Overridden Agents  : {', '.join(plan.overridden_agents)}")
    print("\n Optimization Actions:")
    for i, act in enumerate(plan.optimization_actions, 1):
        print(f"   {i}. {act}")

    print("\n Expected Impact & Savings:")
    print(f"   - Energy Saved   : {plan.expected_savings.get('energy_kw_saved')} kW")
    print(f"   - Cost Saved     : ${plan.expected_savings.get('cost_dollars_saved')}")
    print(f"   - Comfort Impact : {plan.comfort_impact}")

    print("\n Explainability Summary:")
    print(f"   Why: {plan.explainability.get('why')}")
    print(f"   Trade-offs: {plan.explainability.get('trade_offs')}")

    if plan.conflicts_resolved:
        print("\n Resolved Conflicts:")
        for c in plan.conflicts_resolved:
            print(f"   - [{c.get('category')}]: {c.get('conflict')} --> Resolution: {c.get('resolution')}")

    print("===========================================================\n")


if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_ai_layer())
