# Voltix - Phase 11: Demo Assets & Presentation Script

## 1. Architecture Explanation (For Judges/Stakeholders)
"Welcome to Voltix, our Enterprise Autonomous Building Operations Platform. What we are presenting today is the foundational node of our multi-agent architecture: the **Occupancy Agent**. 
Unlike traditional Building Management Systems that rely on dumb, hard-coded schedules, Voltix uses a sophisticated LangGraph-based AI pipeline to understand the *human context* of a building in real time. We ingest multi-modal telemetry—PIR motion, CO2 levels, and Access Control Swipes—and fuse that with Calendar data to determine the absolute ground-truth of room occupancy.

But we didn't just build a ChatGPT wrapper. This is enterprise software. We implemented a 'Parse, Don't Validate' Pydantic pipeline, an Intelligence Engine to mathematically constrain the AI, and a deterministic Fallback Engine that guarantees sub-millisecond reliability if the LLM goes down. Let's look at the scenarios."

## 2. Demo Scenarios & Sample Telemetry

### Scenario A: The Ghost Booking (Anomaly Detection)
**Context:** A meeting room was booked for 10 people, but no one showed up. Traditional systems would blast the AC for an hour, wasting energy.
**Input Telemetry (JSON):**
```json
{
  "zone": {"zone_id": "conf_01", "name": "Boardroom", "capacity": 12, "sq_ft": 400.0},
  "sensors": [
    {"sensor_id": "pir_1", "sensor_type": "PIR", "value": 0, "is_active": true, "timestamp": "2026-07-28T16:00:00Z"},
    {"sensor_id": "co2_1", "sensor_type": "CO2", "value": 410, "is_active": true, "timestamp": "2026-07-28T16:00:00Z"}
  ],
  "calendar": [
    {"event_id": "meet_99", "expected_attendees": 10, "start_time": "2026-07-28T15:30:00Z", "end_time": "2026-07-28T16:30:00Z"}
  ]
}
```
**Expected Output:** The agent classifies it as `EMPTY` and flags a `GHOST_BOOKING` anomaly because 30 minutes have passed with zero motion.

### Scenario B: Tailgating & Sensor Fusion (Overcrowding)
**Context:** Only 5 people badged in (ACS), but the Time-of-Flight (ToF) camera counted 15 people walking in. The room capacity is 10.
**Input Telemetry (JSON):**
```json
{
  "zone": {"zone_id": "lab_01", "name": "Research Lab", "capacity": 10, "sq_ft": 300.0},
  "sensors": [
    {"sensor_id": "acs_1", "sensor_type": "ACS", "value": 5, "is_active": true, "timestamp": "2026-07-28T16:15:00Z"},
    {"sensor_id": "tof_1", "sensor_type": "TOF", "value": 15, "is_active": true, "timestamp": "2026-07-28T16:15:00Z"}
  ]
}
```
**Expected Output:** The agent prioritizes the ToF hard count over the ACS swipes, classifying the room as `OVERCROWDED` (15/10), triggering a `CRITICAL` anomaly for the Safety Agent to handle.

### Scenario C: The Fallback Rescue (Total Network Failure)
**Context:** We simulate pulling the plug on the building's internet connection. The OpenAI endpoint is unreachable.
**Action:** We trigger a simulated `TimeoutException` in the core pipeline.
**Expected Output:** Within 1 millisecond, the Fallback Engine intercepts the error, reads the CO2 sensor (e.g., 900ppm), applies Rule 2, and returns a perfectly formatted schema showing `MEDIUM` occupancy with a confidence score of `0.4`, keeping the building's HVAC running safely.

## 3. Presentation Workflow
1. **Introduction (1 min):** Explain the difference between schedule-based BMS and AI-driven BMS.
2. **Architecture Diagram (2 mins):** Show the Mermaid flow from Phase 2 (Ingress -> Pydantic -> LLM -> Fallback).
3. **Live Execution (3 mins):** Run the Python unit tests built in Phase 8 to prove the math and logic work instantly.
4. **Code Walkthrough (2 mins):** Show the `IntelligenceEngine` (business rules) and the `@track_execution` decorator (observability).
5. **Conclusion (1 min):** Summarize how this Occupancy Agent acts as the baseline for the future Thermal, Energy, and Safety agents.
