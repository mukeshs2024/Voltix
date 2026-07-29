"""
Simulation Demo Script for Equipment Health Agent.
Demonstrates vibration anomaly detection, thermal degradation analysis, RUL prediction, and critical maintenance alerts.
"""

import sys
import os
import json
import asyncio
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

# Add project root and AI root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
AI_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

for path in (PROJECT_ROOT, AI_ROOT):
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from ai.agents.equipment.equipment_agent import EquipmentAgent
    from ai.agents.equipment.schemas import EquipmentInput
except ImportError:
    from agents.equipment.equipment_agent import EquipmentAgent
    from agents.equipment.schemas import EquipmentInput

console = Console()


async def run_equipment_demo():
    console.print("\n[bold cyan]=========================================================[/bold cyan]")
    console.print("[bold cyan]     VOLTIX AI ENGINE - EQUIPMENT HEALTH AGENT DEMO       [/bold cyan]")
    console.print("[bold cyan]=========================================================[/bold cyan]\n")

    # Define High-Risk Mechanical Failure Telemetry Scenario
    telemetry_scenario = EquipmentInput(
        equipment_id="HVAC-Chiller-AHU-04",
        equipment_type="HVAC",
        runtime_hours=14500.0,              # High operating runtime
        motor_current=48.2,                 # Elevated motor current draw (48.2 A)
        temperature=92.5,                   # Overheating temperature (92.5°C)
        vibration=7.8,                      # Severe vibration anomaly (7.8 mm/s)
        wear_level=0.85,                    # 85% mechanical wear
        error_codes=["E-402 High Temp Alarm", "E-108 Vibration Spike"],
        maintenance_history=["Bearing lubed 2025-02-10", "Filter replaced 2025-05-12"]
    )

    console.print("[bold yellow]1. Ingesting Asset Telemetry & Sensor Stream...[/bold yellow]")
    table = Table(show_header=True, header_style="bold red")
    table.add_column("Sensor Parameter", style="dim")
    table.add_column("Value", style="bold yellow")

    table.add_row("Equipment Identifier", telemetry_scenario.equipment_id)
    table.add_row("Equipment Type", telemetry_scenario.equipment_type)
    table.add_row("Runtime Hours", f"{telemetry_scenario.runtime_hours} hrs")
    table.add_row("Vibration Amplitude", f"[bold red]{telemetry_scenario.vibration} mm/s (CRITICAL)[/bold red]")
    table.add_row("Operating Temperature", f"[bold red]{telemetry_scenario.temperature} deg C (OVERHEATING)[/bold red]")
    table.add_row("Motor Current", f"{telemetry_scenario.motor_current} Amps")
    table.add_row("Mechanical Wear Level", f"{telemetry_scenario.wear_level * 100}%")
    table.add_row("Active Error Codes", ", ".join(telemetry_scenario.error_codes))
    console.print(table)
    console.print()

    console.print("[bold yellow]2. Invoking Equipment Health Assessment Engine...[/bold yellow]")
    agent = EquipmentAgent()
    response = await agent.process_async(telemetry_scenario)

    console.print("\n[bold green][SUCCESS] Equipment Health Assessment Completed Successfully![/bold green]\n")

    # Display Result JSON in Panel
    response_json = json.dumps(response.model_dump(mode="json"), indent=2)
    console.print(Panel(response_json, title="[bold cyan]Equipment Health Agent Output JSON[/bold cyan]", expand=False))

    # Display Metrics Summary
    console.print("\n[bold yellow]3. Observability & Telemetry Metrics Summary:[/bold yellow]")
    metrics_table = Table(show_header=True, header_style="bold blue")
    metrics_table.add_column("Metric Name", style="dim")
    metrics_table.add_column("Value", style="bold white")

    for k, v in response.metrics.items():
        metrics_table.add_row(k.replace("_", " ").title(), str(v))

    console.print(metrics_table)
    console.print("\n[bold green]================ Demo Completed Successfully =================[/bold green]\n")


if __name__ == "__main__":
    asyncio.run(run_equipment_demo())
