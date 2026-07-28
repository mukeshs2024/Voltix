"""
1000-cycle stress test for the Occupancy Agent.

Measures end-to-end latency and memory stability across representative scenarios.
"""

from __future__ import annotations

import argparse
import statistics
import time
import tracemalloc
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ai.agents.occupancy.occupancy_agent import OccupancyAgent
from ai.agents.occupancy.occupancy_scenarios import SCENARIOS


class MockLLM:
    def generate(self, system, user):
        return '{"15_min": 5, "30_min": 6, "60_min": 7}'


def main(cycles: int) -> None:
    agent = OccupancyAgent(llm_client=MockLLM())
    scenarios = list(SCENARIOS.values())
    durations_ms = []

    tracemalloc.start()
    start_wall = time.perf_counter()

    for index in range(cycles):
        scenario = scenarios[index % len(scenarios)]
        payload = scenario.model_dump(mode="json")

        cycle_start = time.perf_counter()
        result = agent.process(payload)
        durations_ms.append((time.perf_counter() - cycle_start) * 1000)

        metrics = result["occupancy_metrics"]
        if metrics["current_occupancy"] < 0:
            raise AssertionError("current_occupancy must never be negative")

    elapsed_ms = (time.perf_counter() - start_wall) * 1000
    current_bytes, peak_bytes = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    avg_ms = statistics.mean(durations_ms)
    p95_ms = statistics.quantiles(durations_ms, n=20)[18] if len(durations_ms) >= 20 else max(durations_ms)

    print(f"cycles={cycles}")
    print(f"avg_latency_ms={avg_ms:.3f}")
    print(f"p95_latency_ms={p95_ms:.3f}")
    print(f"max_latency_ms={max(durations_ms):.3f}")
    print(f"total_elapsed_ms={elapsed_ms:.3f}")
    print(f"current_memory_kb={current_bytes / 1024:.3f}")
    print(f"peak_memory_kb={peak_bytes / 1024:.3f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cycles", type=int, default=1000)
    args = parser.parse_args()
    main(args.cycles)