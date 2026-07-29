"""
Simulation Demo Script for Energy Agent.
Demonstrates peak demand shaving, battery dispatch, solar offset, and load shifting.
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
    from ai.agents.energy.energy_agent import EnergyAgent
    from ai.agents.energy.schemas import EnergyInput
except ImportError:
    from agents.energy.energy_agent import EnergyAgent
    from agents.energy.schemas import EnergyInput

console = Console()


async def run_energy_demo():
    console.print("\n[bold cyan]=========================================================[/bold cyan]")
    console.print("[bold cyan]        VOLTIX AI ENGINE - ENERGY AGENT DEMO             [/bold cyan]")
    console.print("[bold cyan]=========================================================[/bold cyan]\n")

    # Define High-Demand / Critical Peak Pricing Scenario
    telemetry_scenario = EnergyInput(
        electricity_tariff=0.45,         # High on-peak tariff ($0.45/kWh)
        battery_level=70.0,              # Battery charged at 70%
        solar_production=45.0,           # 45 kW active solar generation
        hvac_consumption=180.0,          # High HVAC power draw (180 kW)
        predicted_occupancy=150,         # High building occupancy
        temperature=88.0,                # High ambient temperature (88°F)
        weather="Hot & Sunny",
        grid_pricing="critical_peak",    # Critical peak pricing tier
        peak_demand=150.0,               # Peak demand threshold (150 kW)
        historical_energy_usage=[140.0, 155.0, 170.0, 180.0]
    )

    console.print("[bold yellow]1. Ingesting Real-Time Telemetry & Environmental Scenario...[/bold yellow]")
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Parameter", style="dim")
    table.add_column("Value", style="bold green")

    table.add_row("Electricity Tariff", f"${telemetry_scenario.electricity_tariff}/kWh")
    table.add_row("Grid Pricing Tier", telemetry_scenario.grid_pricing.upper())
    table.add_row("HVAC Consumption", f"{telemetry_scenario.hvac_consumption} kW")
    table.add_row("Peak Demand Threshold", f"{telemetry_scenario.peak_demand} kW")
    table.add_row("Solar Production", f"{telemetry_scenario.solar_production} kW")
    table.add_row("Battery State of Charge", f"{telemetry_scenario.battery_level}%")
    table.add_row("Occupancy / Ambient Temp", f"{telemetry_scenario.predicted_occupancy} occupants / {telemetry_scenario.temperature} deg F")
    console.print(table)
    console.print()

    console.print("[bold yellow]2. Invoking Energy Agent Optimization Engine...[/bold yellow]")
    agent = EnergyAgent()
    response = await agent.process_async(telemetry_scenario)

    console.print("\n[bold green][SUCCESS] Energy Optimization Completed Successfully![/bold green]\n")

    # Display Result JSON in Panel
    response_json = json.dumps(response.model_dump(mode="json"), indent=2)
    console.print(Panel(response_json, title="[bold cyan]Energy Agent Output JSON[/bold cyan]", expand=False))

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
    asyncio.run(run_energy_demo())
