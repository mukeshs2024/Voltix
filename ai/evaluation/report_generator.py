"""
1. Objective: Terminal UI for Evaluation Framework.
2. Folder location: ai/evaluation/
3. Responsibilities: Render scores in a beautiful rich table.
"""
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
import numpy as np
from .evaluator import EvaluationEngine

console = Console()

def generate_report():
    engine = EvaluationEngine()
    
    with console.status("[bold green]Executing Evaluation Pipeline...", spinner="dots"):
        results = engine.run_evaluations()
        
    table = Table(title="Voltix AI Pipeline Evaluation Report", style="cyan")
    table.add_column("Scenario", style="magenta")
    table.add_column("Prediction", justify="right")
    table.add_column("Anomaly", justify="right")
    table.add_column("Confidence", justify="right")
    table.add_column("Explainability", justify="right")
    table.add_column("Decision Correct", justify="right")
    table.add_column("Latency (ms)", justify="right")
    
    latencies = []
    total_score = 0
    total_metrics = 0
    
    for r in results:
        scores = r["scores"]
        
        def format_score(val):
            if val == 1.0: return "[green]1.0[/green]"
            elif val > 0.0: return f"[yellow]{val:.1f}[/yellow]"
            else: return "[red]0.0[/red]"
            
        table.add_row(
            r["scenario"],
            format_score(scores["prediction"]),
            format_score(scores["anomaly"]),
            format_score(scores["confidence"]),
            format_score(scores["explainability"]),
            format_score(scores["decision"]),
            f"{scores['latency_ms']:.1f}"
        )
        latencies.append(scores["latency_ms"])
        
        for k in ["prediction", "anomaly", "confidence", "explainability", "decision"]:
            total_score += scores[k]
            total_metrics += 1
            
    overall_accuracy = (total_score / total_metrics) * 100 if total_metrics else 0
    
    console.print("\n")
    console.print(Panel(table))
    
    summary = Table.grid(padding=1)
    summary.add_column(style="bold cyan")
    summary.add_column()
    summary.add_row("Overall AI Accuracy:", f"{overall_accuracy:.1f}%")
    summary.add_row("Average Latency:", f"{np.mean(latencies):.2f} ms")
    summary.add_row("P95 Latency:", f"{np.percentile(latencies, 95):.2f} ms")
    summary.add_row("Max Latency:", f"{np.max(latencies):.2f} ms")
    
    console.print(Panel(summary, title="Evaluation Summary", style="green"))

if __name__ == "__main__":
    generate_report()
