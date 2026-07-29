import uuid
from typing import Dict, Any, List
from memory.shared_memory import AgentRecommendation, OptimizationPlan


class ConsensusEngine:
    """
    Enterprise-Grade Multi-Agent Consensus Engine for Voltix.
    Resolves agent conflicts deterministically across all 6 specialized agents:
    1. SafetyAgent
    2. EquipmentAgent
    3. ThermalAgent
    4. EnergyAgent
    5. GridAgent
    6. OccupancyAgent
    """

    @staticmethod
    def evaluate(recommendations: Dict[str, AgentRecommendation]) -> OptimizationPlan:
        plan_id = f"opt_plan_{uuid.uuid4().hex[:8]}"

        winning_agents: List[str] = []
        overridden_agents: List[str] = []
        conflicts_resolved: List[Dict[str, Any]] = []
        actions: List[str] = []

        # Extract agent recommendations
        safety_rec = recommendations.get("SafetyAgent")
        equip_rec = recommendations.get("EquipmentAgent")
        thermal_rec = recommendations.get("ThermalAgent")
        grid_rec = recommendations.get("GridAgent")
        energy_rec = recommendations.get("EnergyAgent")
        occ_rec = recommendations.get("OccupancyAgent")

        building_status = "OPTIMAL"

        # 1. Safety Emergency Overrides (Absolute Highest Priority)
        if safety_rec and safety_rec.status == "CRITICAL":
            building_status = "EMERGENCY_CRITICAL"
            winning_agents.append("SafetyAgent")
            actions.append(f"SAFETY OVERRIDE: {safety_rec.recommendation}")
            # Safety overrides all energy & thermal recommendations
            for agent_name in ["EnergyAgent", "ThermalAgent", "GridAgent"]:
                if agent_name in recommendations and agent_name not in overridden_agents:
                    overridden_agents.append(agent_name)
            conflicts_resolved.append({
                "category": "Life Safety vs Building Operations",
                "conflict": "Hazardous environmental condition detected by Safety Agent.",
                "resolution": "Emergency safety protocols engaged; all secondary energy optimizations overridden."
            })
        else:
            if safety_rec:
                winning_agents.append("SafetyAgent")

        # 2. Equipment Failure Overrides (Second Highest Priority)
        if building_status != "EMERGENCY_CRITICAL" and equip_rec and equip_rec.status == "WARNING":
            winning_agents.append("EquipmentAgent")
            actions.append(f"EQUIPMENT PROTECTION: {equip_rec.recommendation}")
            if energy_rec and energy_rec.status == "SHIFT_DEMAND":
                overridden_agents.append("EnergyAgent")
                conflicts_resolved.append({
                    "category": "Equipment Health vs Energy Shifting",
                    "conflict": "Energy Agent requested load shifting, but Equipment Agent flagged chiller duty rotation.",
                    "resolution": "Equipment duty rotation prioritized to prevent compressor failure."
                })
        else:
            if equip_rec and "EquipmentAgent" not in winning_agents:
                winning_agents.append("EquipmentAgent")

        # 3. Thermal Comfort & Occupancy Evaluation
        if thermal_rec:
            if thermal_rec.status in ["WARNING", "CRITICAL"]:
                winning_agents.append("ThermalAgent")
                actions.append(f"THERMAL CONTROL: {thermal_rec.recommendation}")
                if energy_rec and energy_rec.status == "SHIFT_DEMAND" and "EnergyAgent" not in overridden_agents:
                    overridden_agents.append("EnergyAgent")
                    conflicts_resolved.append({
                        "category": "Thermal Comfort vs Energy Curtailment",
                        "conflict": "Energy Agent proposed HVAC curtailment, but Thermal Agent detected temperature setpoint violation.",
                        "resolution": "Thermal comfort preserved for occupant productivity."
                    })
            else:
                if "ThermalAgent" not in winning_agents:
                    winning_agents.append("ThermalAgent")

        # 4. Grid Tariff Optimization
        if grid_rec and grid_rec.status in ["HIGH_PRICE", "GRID_STRESS"]:
            winning_agents.append("GridAgent")
            actions.append(f"GRID OPTIMIZATION: {grid_rec.recommendation}")
            if occ_rec and occ_rec.status == "HIGH_OCCUPANCY":
                conflicts_resolved.append({
                    "category": "Grid Tariff vs Peak Occupancy",
                    "conflict": "Grid Agent recommended battery discharge, Occupancy Agent reported high headcount.",
                    "resolution": "Discharged battery storage to cover peak occupancy load without grid peak charges."
                })
        else:
            if grid_rec and "GridAgent" not in winning_agents:
                winning_agents.append("GridAgent")

        # 5. Energy Efficiency Integration
        if energy_rec and "EnergyAgent" not in overridden_agents:
            winning_agents.append("EnergyAgent")
            actions.append(f"ENERGY EFFICIENCY: {energy_rec.recommendation}")

        # 6. Occupancy Integration
        if occ_rec and "OccupancyAgent" not in winning_agents:
            winning_agents.append("OccupancyAgent")

        # Default action fallback
        if not actions:
            actions.append("Maintain baseline optimized HVAC and energy setpoints.")

        # Calculate Expected Savings & Comfort Impact
        total_energy_savings_kw = sum(
            rec.expected_impact.get("energy_kw_delta", 0.0)
            for rec in recommendations.values()
            if rec.agent_name in winning_agents
        )
        total_cost_savings = sum(
            rec.expected_impact.get("cost_dollar_delta", 0.0)
            for rec in recommendations.values()
            if rec.agent_name in winning_agents
        )

        conf_scores = [r.confidence for r in recommendations.values() if r.agent_name in winning_agents]
        avg_confidence = round(sum(conf_scores) / len(conf_scores), 2) if conf_scores else 0.95

        # Construct Explainability Summary
        why_parts = [
            f"Evaluated all 6 specialized agents ({', '.join(recommendations.keys())}).",
            f"Winning agents ({', '.join(winning_agents)}) reached consensus.",
        ]
        if overridden_agents:
            why_parts.append(f"Overrode ({', '.join(overridden_agents)}) due to safety/thermal constraints.")
        if conflicts_resolved:
            why_parts.append(f"Resolved {len(conflicts_resolved)} cross-agent priority conflicts.")

        explainability = {
            "why": " ".join(why_parts),
            "winning_agents": winning_agents,
            "overridden_agents": overridden_agents,
            "conflicts_resolved": conflicts_resolved,
            "expected_impact": {
                "energy_kw_saved": round(total_energy_savings_kw, 2),
                "cost_dollars_saved": round(total_cost_savings, 2),
            },
            "confidence": avg_confidence,
            "trade_offs": "Safety & thermal comfort prioritized over aggressive load shedding."
        }

        return OptimizationPlan(
            plan_id=plan_id,
            timestamp=0.0,
            building_status=building_status,
            optimization_actions=actions,
            expected_savings={
                "energy_kw_saved": round(total_energy_savings_kw, 2),
                "cost_dollars_saved": round(total_cost_savings, 2),
            },
            comfort_impact="OPTIMAL_PRESERVED",
            confidence=avg_confidence,
            reasoning_summary=explainability["why"],
            winning_agents=winning_agents,
            overridden_agents=overridden_agents,
            conflicts_resolved=conflicts_resolved,
            explainability=explainability
        )
