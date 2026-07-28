# Voltix AI Layer

This module contains the Multi-Agent System (LangGraph) for the Voltix Digital Twin. It utilizes Groq AI for lightning-fast reasoning and structured output generation.

## Setup

1. Make sure you are in the `ai` directory:
   ```bash
   cd c:\Voltix\ai
   ```

2. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

3. The `.env` file is already pre-configured with the `GROQ_API_KEY`.

## Running the Tests

To run the automated test suite (verifying graph compilation and agent schemas):

```bash
python -m pytest tests/ -v
```

## Running the Simulation

To execute a full simulation cycle with mock telemetry, passing the data through the LangGraph agents and generating an Explainability Trace:

```bash
python -m simulation.runner
```



# run the ai module 

cd C:\Voltix
python -m ai.main
