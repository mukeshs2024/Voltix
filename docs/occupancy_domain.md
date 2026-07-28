# Voltix - Phase 0: Domain Research - Occupancy Management Systems

## 1. Occupancy Management Concepts
Occupancy management in commercial buildings involves tracking, analyzing, and optimizing the presence of people within a space. It forms the foundational layer for dynamic building operations, driving decisions related to HVAC, lighting, security, and space utilization. In a modern Autonomous Building Operations Platform, real-time and predictive occupancy data allows systems to proactively adjust environments rather than reacting to static schedules.

## 2. Building Automation Background
Building Automation Systems (BAS) or Building Management Systems (BMS) traditionally operate on hard-coded schedules and PID loops. They lack context about human behavior. Next-generation systems integrate IoT sensors and AI to shift from schedule-based control to demand-based control, significantly reducing energy waste and improving occupant comfort.

## 3. Sensor Types
To build a robust Occupancy Agent, Voltix will rely on multi-modal sensor telemetry:
- **PIR (Passive Infrared) Sensors:** Detect motion. Good for basic presence, poor for static occupancy.
- **Badge Swipes / Access Control (ACS):** Provide hard counts of entrances/exits, but suffer from tailgating and don't provide zone-level granularity.
- **Wi-Fi / Bluetooth (BLE) Beacons:** Track device MAC addresses to estimate crowd density and movement.
- **Thermal Cameras / Time-of-Flight (ToF) Sensors:** Count people crossing a threshold accurately while maintaining privacy.
- **CO2 Sensors:** Indirectly measure occupancy density based on exhalation rates over time in closed zones.
- **Desk Sensors:** Under-desk sensors (usually IR or ultrasonic) indicating specific workstation utilization.

## 4. Occupancy KPIs
The agent must track and optimize against specific Key Performance Indicators:
- **Utilization Rate:** Percentage of total capacity actively used.
- **Peak Occupancy:** Maximum number of occupants in a zone during a given period.
- **Dwell Time:** Average time occupants spend in a specific zone.
- **Vacancy Rate:** Periods where scheduled spaces remain unoccupied (ghost bookings).
- **Space Efficiency:** Revenue or cost-savings per square foot based on usage.

## 5. Commercial Solutions
Existing industry leaders include:
- **VergeSense:** Focuses on optical/radar sensors for deep spatial intelligence.
- **Density.io:** Uses radar and ToF sensors for anonymous people counting.
- **Honeywell Forge / Siemens Desigo:** Enterprise BMS platforms moving toward AI-driven optimization.
- **Johnson Controls OpenBlue:** Comprehensive digital twin and smart building ecosystem.
Voltix aims to orchestrate these inputs better by using specialized LLM agents for complex decision-making.

## 6. AI Opportunities
- **Predictive Occupancy:** Forecasting future occupancy based on historical data, weather, and calendar events.
- **Sensor Fusion:** Combining disparate, noisy sensor data (e.g., PIR + CO2) to determine true occupancy state and confidence levels.
- **Dynamic Zoning:** Recommending logical zone regroupings based on actual usage patterns instead of architectural boundaries.
- **Contextual Reasoning:** Differentiating between a cleaner entering a room at night vs. an employee working late.

## 7. Possible Anomalies
- **Sensor Failure/Drift:** CO2 sensor stuck at 400ppm or PIR sensor constantly triggered.
- **Ghost Bookings:** Meeting room booked in calendar but physical sensors show zero occupancy for >15 mins.
- **Overcrowding:** Zone occupancy exceeds physical or safety capacity limits.
- **Unusual After-Hours Activity:** High density in non-working hours without scheduled maintenance or events.
- **Tailgating:** Discrepancy between ACS badge swipes and ToF people counter at main entrances.

## 8. Inputs
- Real-time telemetry (PIR, CO2, ToF, Wi-Fi)
- Historical occupancy timeseries
- Building topology (zones, capacity limits)
- External schedules (Exchange/Google Workspace integration)
- Current time/date and facility operating hours

## 9. Outputs
- Current estimated occupancy count per zone
- Occupancy classification (Empty, Low, Medium, High, Overcrowded)
- Occupancy prediction for next 1h, 4h, 24h
- Confidence score (0.0 - 1.0) of the current estimate
- Anomaly alerts (e.g., sensor malfunction, ghost booking)
- Reasoning trace (explanation of how the agent derived the current state)

## 10. References
- ASHRAE Guideline 36 (High-Performance Sequences of Operation for HVAC Systems)
- WELL Building Standard (Focus on occupant health and comfort)
- IEEE Papers on Sensor Fusion for Occupancy Detection
