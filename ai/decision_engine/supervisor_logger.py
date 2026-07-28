"""
1. Objective: Provide structured logging for the Supervisor.
2. Folder location: ai/decision_engine/
3. Responsibilities: Log inputs, conflicts, priorities, consensus, latency, and output.
"""
import logging
from typing import Dict, Any

logger = logging.getLogger("DecisionEngineSupervisor")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

class SupervisorLogger:
    @staticmethod
    def log_decision_cycle(inputs: Dict[str, Any], decision_schema: Any, latency_ms: float):
        """
        Logs the full trace of the consensus evaluation.
        """
        logger.info(f"--- SUPERVISOR CYCLE COMPLETED IN {latency_ms:.2f}ms ---")
        logger.info(f"Input Agents Present: {list(inputs.keys())}")
        
        if decision_schema.conflicts:
            logger.warning(f"Conflicts Detected: {len(decision_schema.conflicts)}")
            for c in decision_schema.conflicts:
                logger.warning(f" - [{c.category}] between {c.agents}")
        else:
            logger.info("No conflicts detected.")
            
        logger.info(f"Winning Agents: {decision_schema.winning_agents}")
        if decision_schema.overridden_agents:
            logger.info(f"Overridden Agents: {decision_schema.overridden_agents}")
            
        logger.info(f"Final Confidence Score: {decision_schema.confidence}")
        logger.info(f"Actionable Decision: {decision_schema.decision}")
