"""
1. Objective: Measure agent latency and success rates.
2. Folder location: ai/simulation/
3. Responsibilities: Run agents X times and produce an enterprise report.
"""
import time
import numpy as np
from typing import List

class BenchmarkGenerator:
    @staticmethod
    def run_benchmark(agent_class, state: dict, iterations: int = 100):
        agent = agent_class()
        latencies = []
        successes = 0
        
        print(f"Benchmarking {agent.__class__.__name__} over {iterations} iterations...")
        
        for _ in range(iterations):
            start = time.time()
            try:
                result = agent.process(state)
                # Check for explicit pipeline errors
                if isinstance(result, dict) and "errors" not in result:
                    successes += 1
                elif isinstance(result, dict) and not result.get("errors"):
                    successes += 1
            except Exception as e:
                pass
            latency_ms = (time.time() - start) * 1000
            latencies.append(latency_ms)
            
        avg_latency = np.mean(latencies)
        p95_latency = np.percentile(latencies, 95)
        max_latency = np.max(latencies)
        
        print("\n--- Benchmark Report ---")
        print(f"Agent: {agent.__class__.__name__}")
        print(f"Average latency: {avg_latency:.2f} ms")
        print(f"95th percentile: {p95_latency:.2f} ms")
        print(f"Maximum: {max_latency:.2f} ms")
        print(f"Success: {(successes/iterations)*100:.1f}%")
        print(f"Failures: {iterations - successes}")
        print("------------------------\n")
