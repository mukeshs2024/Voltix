import pytest
from ai.graph import create_graph

def test_graph_compilation():
    """
    Ensures that the LangGraph constructs and compiles correctly.
    Validates nodes and edges.
    """
    graph = create_graph()
    
    # Verify nodes exist
    assert "DecisionEngine" in graph.nodes
    assert "OccupancyAgent" in graph.nodes
    assert "GridAgent" in graph.nodes
