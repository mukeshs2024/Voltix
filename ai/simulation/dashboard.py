"""
1. Objective: Provide a professional Building Operations Terminal Dashboard.
2. Folder location: ai/simulation/
3. Responsibilities: Render live telemetry and AI state securely using rich.
"""
from rich.live import Live
from rich.table import Table
from rich.panel import Panel
from rich.layout import Layout
from rich.text import Text
from rich.console import Console
from rich.progress import Progress, BarColumn, TextColumn
import msvcrt
import time
import os

from .building_simulator import BuildingSimulator
from ai.evaluation.report_generator import generate_report
from ai.simulation.stress_tester import StressTester

console = Console()

class EnterpriseDashboard:
    def __init__(self):
        self.simulator = BuildingSimulator(self.update_data)
        
        self.telemetry = None
        self.decision = {}
        self.time_str = "--:--:--"
        self.scenario = "Initializing..."
        self.running = True
        self.mode = "DASHBOARD"
        
    def update_data(self, telemetry, decision, time_str, scenario):
        self.telemetry = telemetry
        self.decision = decision
        self.time_str = time_str
        self.scenario = scenario
        
    def generate_layout(self) -> Layout:
        layout = Layout(name="root")
        
        layout.split(
            Layout(name="header", size=3),
            Layout(name="main"),
            Layout(name="footer", size=5)
        )
        layout["main"].split_row(
            Layout(name="left", ratio=1),
            Layout(name="right", ratio=1)
        )
        layout["left"].split(
            Layout(name="telemetry", size=10),
            Layout(name="occupancy_gauge")
        )
        layout["right"].split(
            Layout(name="supervisor", size=10),
            Layout(name="anomalies")
        )
        
        # Header
        header_text = Text(f"Voltix BMS | Time: {self.time_str} | Scenario: {self.scenario}", style="bold cyan", justify="center")
        layout["header"].update(Panel(header_text, style="white on blue"))
        
        if not self.telemetry:
            return layout
            
        # Left - Telemetry
        t = Table.grid(padding=1)
        t.add_column(style="cyan")
        t.add_column(style="magenta")
        t.add_row("Zone:", self.telemetry.zone_id)
        t.add_row("Temp:", f"{self.telemetry.environment.temperature} °C")
        t.add_row("CO2:", f"{self.telemetry.environment.co2} ppm")
        t.add_row("HVAC Pwr:", f"{self.telemetry.equipment.hvac_power_kw} kW")
        t.add_row("Grid Price:", f"${self.telemetry.energy.grid_price}")
        layout["left"]["telemetry"].update(Panel(t, title="Live Telemetry Stream"))
        
        # Left - Occupancy Gauge
        occ_current = self.telemetry.occupancy.current
        occ_cap = self.telemetry.occupancy.capacity
        perc = (occ_current / occ_cap) * 100 if occ_cap > 0 else 0
        color = "green" if perc < 70 else "yellow" if perc < 90 else "red"
        
        gauge = Progress(TextColumn("[progress.description]{task.description}"), BarColumn(complete_style=color), TextColumn("[progress.percentage]{task.percentage:>3.0f}%"))
        task_id = gauge.add_task("Occupancy", total=100)
        gauge.update(task_id, completed=perc)
        
        layout["left"]["occupancy_gauge"].update(Panel(gauge, title="Occupancy %"))
        
        # Right - Supervisor
        t2 = Table.grid(padding=1)
        t2.add_column(style="bold yellow")
        t2.add_column(style="white")
        decision_text = self.decision.get("decision", "Awaiting Data...")
        reasoning = self.decision.get("reasoning", "...")
        
        dec_color = "red" if "Emergency" in decision_text else "green"
        t2.add_row("Decision:", Text(decision_text, style=f"bold {dec_color}"))
        t2.add_row("Reasoning:", Text(reasoning, style="italic"))
        layout["right"]["supervisor"].update(Panel(t2, title="AI Supervisor"))
        
        # Right - Anomalies
        conflicts = self.decision.get("conflicts", [])
        if conflicts:
            anomaly_str = "\n".join([f"⚠ {c.get('category', 'Unknown Conflict')}" for c in conflicts])
            anomaly_text = Text(anomaly_str, style="bold red")
        else:
            anomaly_text = Text("✓ Normal Operation", style="bold green")
            
        layout["right"]["anomalies"].update(Panel(anomaly_text, title="Detected Anomalies"))
        
        # Footer
        footer_cmds = (
            "[1] Morning Rush | [2] Conference | [3] Ghost Booking | [4] Fire Drill\n"
            "[5] Empty | [6] Holiday | [8] Stress Test | [9] AI Eval | [Q] Quit"
        )
        layout["footer"].update(Panel(footer_cmds, title="Voltix AI Commands", style="white on black"))
        
        return layout

    def _check_keys(self):
        if msvcrt.kbhit():
            key = msvcrt.getch().decode('utf-8').lower()
            if key == '1': self.simulator.set_scenario("Morning Rush")
            elif key == '2': self.simulator.set_scenario("Conference")
            elif key == '3': self.simulator.set_scenario("Ghost Booking")
            elif key == '4': self.simulator.set_scenario("Fire Drill")
            elif key == '5': self.simulator.set_scenario("Empty Building")
            elif key == '6': self.simulator.set_scenario("Holiday")
            elif key == '8': self.mode = "STRESS_TEST"
            elif key == '9': self.mode = "EVALUATION"
            elif key == 'q': 
                self.running = False
                self.mode = "QUIT"

    def run(self):
        self.simulator.start()
        
        while self.running:
            self.mode = "DASHBOARD"
            
            with Live(self.generate_layout(), refresh_per_second=10, screen=True) as live:
                while self.running and self.mode == "DASHBOARD":
                    self._check_keys()
                    live.update(self.generate_layout())
                    time.sleep(0.1)
                    
            if self.mode == "EVALUATION":
                console.clear()
                generate_report()
                console.print("\n[bold yellow]Press ENTER to return to Dashboard...[/bold yellow]")
                input()
            elif self.mode == "STRESS_TEST":
                console.clear()
                tester = StressTester(iterations=100)
                tester.run_stress_test()
                console.print("\n[bold yellow]Press ENTER to return to Dashboard...[/bold yellow]")
                input()
                
        self.simulator.stop()
        
if __name__ == "__main__":
    app = EnterpriseDashboard()
    app.run()
