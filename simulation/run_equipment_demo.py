"""
Root level entrypoint for Equipment Health Agent Demo.
Executes ai/simulation/run_equipment_demo.py directly.
"""

import sys
import os
import importlib.util

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AI_ROOT = os.path.join(PROJECT_ROOT, "ai")
TARGET_SCRIPT = os.path.join(AI_ROOT, "simulation", "run_equipment_demo.py")

for p in (AI_ROOT, PROJECT_ROOT):
    if p not in sys.path:
        sys.path.insert(0, p)

if __name__ == "__main__":
    spec = importlib.util.spec_from_file_location("ai_run_equipment_demo", TARGET_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules["ai_run_equipment_demo"] = module
    spec.loader.exec_module(module)
