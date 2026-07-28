"""
1. Objective: Engine that executes the evaluation dataset against the AI pipeline.
2. Folder location: ai/evaluation/
3. Responsibilities: Run agents, compute scores.
"""
import time
import json
from .dataset import EVALUATION_DATASET
from .metrics import MetricsEvaluator
from ai.agents.occupancy.occupancy_agent import OccupancyAgent
from ai.agents.safety.safety_agent import SafetyAgent
from ai.decision_engine.supervisor import DecisionEngineSupervisor

class EvaluationEngine:
    def __init__(self):
        self.occupancy_agent = OccupancyAgent()
        self.safety_agent = SafetyAgent()
        self.supervisor = DecisionEngineSupervisor()
        
    def run_evaluations(self):
        results = []
        
        for idx, scenario in enumerate(EVALUATION_DATASET):
            state = scenario["input_state"]
            ground_truth = scenario["ground_truth"]
            
            start_time = time.time()
            
            # 1. Run Occupancy
            occ_result = self.occupancy_agent.process(state.copy())
            
            # 2. Run Safety (if alarm is present)
            safe_result = self.safety_agent.process(state.copy())
            
            # 3. Aggregate
            proposed_actions = []
            if isinstance(occ_result, dict) and "occupancy_metrics" in occ_result:
                proposed_actions.append({"OccupancyAgent": occ_result["occupancy_metrics"]})
            if isinstance(safe_result, dict) and "safety_metrics" in safe_result:
                proposed_actions.append({"SafetyAgent": safe_result["safety_metrics"]})
                
            agg_state = {"proposed_actions": proposed_actions}
            
            # 4. Supervisor
            final_state = self.supervisor.process_state(agg_state)
            
            latency = (time.time() - start_time) * 1000
            
            # 5. Extract Outputs
            predicted_activity = "UNKNOWN"
            predicted_anomaly = False
            predicted_conf = 0.0
            
            if isinstance(occ_result, dict) and "occupancy_metrics" in occ_result:
                metrics = occ_result["occupancy_metrics"]
                predicted_activity = metrics.get("activity_level", "UNKNOWN")
                predicted_anomaly = metrics.get("anomalies_detected", False)
                predicted_conf = metrics.get("confidence_score", 0.0)
            
            decision_dict = {}
            if final_state.get("final_decision"):
                try:
                    decision_dict = json.loads(final_state["final_decision"])
                except Exception:
                    pass
                    
            winning_agents = decision_dict.get("winning_agents", [])
            reasoning = decision_dict.get("reasoning", "")
            
            # 6. Score
            scores = {
                "prediction": MetricsEvaluator.evaluate_prediction_quality(predicted_activity, ground_truth.get("expected_activity", "")),
                "anomaly": MetricsEvaluator.evaluate_anomaly_detection(predicted_anomaly, ground_truth.get("expect_anomaly", False)),
                "confidence": MetricsEvaluator.evaluate_confidence_calibration(predicted_conf, ground_truth.get("min_confidence", 0.0), ground_truth.get("max_confidence", 1.0)),
                "explainability": MetricsEvaluator.evaluate_explainability(reasoning, ground_truth.get("decision_includes", "")),
                "decision": MetricsEvaluator.evaluate_decision_correctness(winning_agents, ground_truth.get("winning_agent", "")),
                "latency_ms": latency
            }
            
            results.append({
                "scenario": scenario["scenario_name"],
                "scores": scores
            })
            
        return results
