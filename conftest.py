from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
AI_ROOT = ROOT / "ai"

for path in (ROOT, AI_ROOT):
    path_str = str(path)
    if path_str not in sys.path:
        sys.path.insert(0, path_str)