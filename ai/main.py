import time
from rich.console import Console

console = Console()

def boot_sequence():
    console.clear()
    console.print("\n[bold cyan]=========================================================[/bold cyan]")
    console.print("[bold cyan]        VOLTIX AI ENGINE[/bold cyan]")
    console.print("[bold cyan]=========================================================[/bold cyan]\n")
    
    steps = [
        "Loading Occupancy Agent",
        "Loading Supervisor",
        "Loading Consensus Engine",
        "Loading Telemetry Simulator",
        "Loading Scenario Manager",
        "Loading Shared State",
        "Loading Metrics",
        "Loading Logging"
    ]
    
    for step in steps:
        time.sleep(0.1) # Simulate loading
        console.print(f"[bold green]✓[/bold green] {step}")
        
    time.sleep(0.3)
    console.print("\n[bold yellow]System Ready[/bold yellow]\n")
    time.sleep(0.5)

if __name__ == "__main__":
    boot_sequence()
    from ai.simulation.dashboard import EnterpriseDashboard
    app = EnterpriseDashboard()
    app.run()
