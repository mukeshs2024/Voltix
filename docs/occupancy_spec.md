# Voltix - Phase 1: Functional Specification - Occupancy Agent

## 1. Overview
The Occupancy Agent is the foundational intelligence node of the Voltix Multi-Agent Building Operations Platform. It is responsible for continuously processing real-time sensor telemetry to determine the true occupancy state of building zones and predicting future usage patterns.

## 2. Responsibilities
- Aggregate and fuse data from multi-modal sensors (PIR, ToF, CO2, ACS).
- Determine current occupancy count and density classification per zone.
- Predict short-term (1h, 4h) and long-term (24h) occupancy trends.
- Detect occupancy anomalies (e.g., ghost bookings, tailgating, sensor drift).
- Emit a confidence score with every state estimation to inform downstream agents.
- Generate human-readable reasoning traces for its classifications and predictions.
- Provide a resilient fallback mechanism if the primary LLM/Decision engine is unavailable.

## 3. Non-Responsibilities
- Controlling HVAC equipment directly (this is the Thermal/Equipment Agent's job).
- Controlling lighting or smart plugs (Energy Agent's job).
- Handling physical security interventions (Safety Agent's job).
- Directly querying raw building databases (it assumes data is provided via a Shared State / Message Bus).

## 4. Inputs
- **Real-Time Telemetry:** Continuous streams of sensor data (motion events, people counts, CO2 ppm).
- **Zone Topology:** Static configuration of the space (capacity limits, square footage, sensor mapping).
- **Calendar Data:** Scheduled meetings, expected attendee counts, facility hours.
- **Historical Context:** Past occupancy patterns for the specific zone and time of day.

## 5. Outputs
- **Current State:** Estimated head count, utilization percentage, classification (Empty, Low, Medium, High, Overcrowded).
- **Predictions:** Expected occupancy for upcoming time horizons.
- **Anomalies:** List of detected anomalies with severity and type.
- **Metadata:** Confidence score (0.0 - 1.0), processing latency, and reasoning trace.

## 6. Decision Boundaries
- The agent operates strictly within the domain of *understanding people movement and presence*.
- It does not make decisions on *how to react* to that presence; it merely provides the highest-quality ground truth to the Consensus Agent and domain-specific agents.
- If confidence drops below `0.4`, the agent will flag the state as `UNRELIABLE` and trigger a fallback heuristic.

## 7. Functional Requirements
- **FR1 (Ingestion):** Must accept state payloads conforming to the `OccupancyInput` schema.
- **FR2 (Processing):** Must invoke the LLM pipeline to analyze complex scenarios when heuristic rules are insufficient.
- **FR3 (Reasoning):** Must provide a step-by-step reasoning string explaining how the occupancy state was determined.
- **FR4 (Anomaly Detection):** Must flag ghost bookings (scheduled >0, actual = 0 for >15 mins) and overcrowding (actual > physical capacity).
- **FR5 (Fallback):** Must instantly return a rule-based occupancy estimate if the LLM times out (>5s) or returns malformed JSON.

## 8. Non-Functional Requirements
- **NFR1 (Latency):** Total processing time (including LLM call) must not exceed 5000ms.
- **NFR2 (Reliability):** 99.9% uptime, handled via robust fallbacks and retries.
- **NFR3 (Scalability):** Stateless architecture capable of processing thousands of zones concurrently.
- **NFR4 (Observability):** Every invocation must log token usage, latency, input payload size, and error rates.

## 9. Assumptions
- Telemetry data is pre-cleaned and standardized by an upstream ingestion service before reaching the agent.
- LLM endpoints (e.g., OpenAI, Anthropic, or local models) provide structured JSON outputs consistently.
- Zone definitions and capacities are accurate and up-to-date.

## 10. Limitations
- The agent cannot visually verify occupancy (unless provided explicit ToF/Camera counts).
- Extremely complex sensor fusion (e.g., distinguishing pets from humans in PIR data) is outside the current scope.
- Pure LLM inference may be too slow for real-time safety shutoffs; hence the need for a fast rule-based fallback.

## 11. Acceptance Criteria
- **AC1:** The agent successfully parses a complex shared state and returns a valid `OccupancyOutput` Pydantic model.
- **AC2:** Given a ghost booking scenario in the test suite, the agent correctly flags the `GHOST_BOOKING` anomaly.
- **AC3:** The fallback engine engages automatically and returns a valid response when the LLM is mocked to timeout.
- **AC4:** All outputs strictly adhere to the defined JSON schema without hallucinated fields.
