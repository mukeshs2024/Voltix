"""
1. Objective: Run hundreds or thousands of scenarios automatically.
2. Folder location: ai/simulation/
3. Responsibilities: Load scenarios, inject failures, and benchmark the pipeline.
"""
from ai.simulation.scenario_library import SCENARIO_LIBRARY
from ai.simulation.benchmark import BenchmarkGenerator
from ai.simulation.failure_injector import FailureInjector
from ai.agents.occupancy.occupancy_agent import OccupancyAgent

def run_stress_test():
    print("Initiating Voltix Stress Tester...")
    
    # 1. Run Benchmark
    state = SCENARIO_LIBRARY["MORNING_RUSH"]
    BenchmarkGenerator.run_benchmark(OccupancyAgent, state, iterations=100)
    
    # 2. Test Failure Injections on OccupancyAgent
    agent = OccupancyAgent()
    print("Testing Failure Injections...")
    
    fail_types = ["MISSING_OCCUPANCY_DATA", "INVALID_TEMPERATURE", "CORRUPTED_JSON", "EMPTY_STATE"]
    for ftype in fail_types:
        bad_state = FailureInjector.corrupt_state(state, ftype)
        print(f"\nInjecting: {ftype}")
        try:
            result = agent.process(bad_state)
            if isinstance(result, dict) and "errors" in result and result["errors"]:
                print(f"-> Handled gracefully. Fallback triggered: {result['errors'][0]}")
            else:
                print("-> Handled gracefully (No explicit errors caught by fallback, or valid return).")
        except Exception as e:
            print(f"-> CRASHED: {e}")

if __name__ == "__main__":
    run_stress_test()
