export type AgentId = "equipment" | "safety" | "grid" | "hvac" | "occupancy" | "carbon" | "security" | "lighting" | "water" | "energy";

export type ScenarioFieldKey = string;

export interface ScenarioFieldDefinition {
  key: string;
  label: string;
  unit?: string;
  type: "number" | "text";
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  agentId: AgentId;
  badge: string;
  defaults: Record<string, number | string>;
}

export interface AgentTelemetryField {
  key: string;
  label: string;
  unit?: string;
}

export interface AgentWorkflowStep {
  label: string;
  detail: string;
  state: "done" | "active" | "pending";
}

export interface AgentProfile {
  id: AgentId;
  title: string;
  purpose: string;
  summary: string;
  accent: string;
  surface: string;
  border: string;
  iconLabel: string;
  tabs: Array<{ id: string; label: string }>;
  workflow: AgentWorkflowStep[];
  telemetry: AgentTelemetryField[];
  predictionTitle: string;
  recommendationTitle: string;
  developerTitle: string;
  chartLabel: string;
  chartHint: string;
  simulationFields: ScenarioFieldDefinition[];
}

export interface AgentSimulationInputPayload {
  scenario_id: string;
  scenario_name: string;
  building_id: string;
  agent_id: AgentId;
  building_data: Record<string, string | number>;
  telemetry: Record<string, string | number>;
  overrides: Record<string, string | number>;
}

export type AgentSimulationResponse = any; // Polymorphic DTO handled dynamically in components

export const AGENT_PROFILES: Record<AgentId, AgentProfile> = {
  equipment: {
    id: "equipment",
    title: "Equipment Agent",
    purpose: "Predict equipment failures.",
    summary: "Monitors asset health signals and converts failure patterns into maintenance actions.",
    accent: "#0F766E",
    surface: "#F0FDFA",
    border: "#5EEAD4",
    iconLabel: "Mechanical integrity",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "diagnostics", label: "Diagnostics" },
      { id: "failures", label: "Failures" },
      { id: "maintenance", label: "Maintenance" },
      { id: "predictions", label: "Predictions" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Sensor Collection", detail: "Inputs normalized", state: "done" },
      { label: "Health Diagnostics", detail: "Diagnosing health", state: "done" },
      { label: "Fault Isolation", detail: "Isolating faults", state: "active" },
      { label: "Failure Prediction", detail: "Predicting failure", state: "pending" },
      { label: "Maintenance Decision", detail: "Deciding maintenance", state: "pending" },
    ],
    telemetry: [
      { key: "motor_vibration", label: "Motor vibration", unit: "mm/s" },
      { key: "bearing_temperature", label: "Bearing temperature", unit: "°C" },
      { key: "runtime_hours", label: "Runtime hours", unit: "h" },
      { key: "oil_pressure", label: "Oil pressure", unit: "kPa" },
      { key: "current_draw", label: "Current draw", unit: "A" },
      { key: "fault_code", label: "Fault Code", unit: "" },
      { key: "maintenance_days", label: "Maintenance Days", unit: "days" },
      { key: "compressor_pressure", label: "Compressor Pressure", unit: "kPa" },
      { key: "rpm", label: "RPM", unit: "rpm" },
      { key: "equipment_age", label: "Equipment Age", unit: "years" },
    ],
    simulationFields: [
      { key: "motor_vibration", label: "Motor Vibration", unit: "mm/s", type: "number" },
      { key: "bearing_temperature", label: "Bearing Temperature", unit: "°C", type: "number" },
      { key: "runtime_hours", label: "Runtime Hours", unit: "h", type: "number" },
    ],
    predictionTitle: "Failure horizon",
    recommendationTitle: "Maintenance actions",
    developerTitle: "Developer output",
    chartLabel: "Asset Tree",
    chartHint: "Remaining life chart and failure timeline",
  },
  safety: {
    id: "safety",
    title: "Safety Agent",
    purpose: "Monitor building safety.",
    summary: "Tracks hazard signals and turns emergency conditions into response actions.",
    accent: "#B91C1C",
    surface: "#FEF2F2",
    border: "#FCA5A5",
    iconLabel: "Life safety",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "hazards", label: "Hazards" },
      { id: "risk", label: "Risk" },
      { id: "emergency", label: "Emergency" },
      { id: "history", label: "History" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Sensor Collection", detail: "Inputs normalized", state: "done" },
      { label: "Hazard Detection", detail: "Detect hazards", state: "done" },
      { label: "Risk Evaluation", detail: "Evaluate risk", state: "active" },
      { label: "Emergency Decision", detail: "Make emergency decision", state: "pending" },
      { label: "Safety Action", detail: "Execute action", state: "pending" },
    ],
    telemetry: [
      { key: "smoke_density", label: "Smoke Density", unit: "%" },
      { key: "fire_alarm", label: "Fire Alarm", unit: "" },
      { key: "water_leak", label: "Water Leak", unit: "" },
      { key: "motion_detection", label: "Motion Detection", unit: "" },
      { key: "occupancy", label: "Occupancy", unit: "%" },
      { key: "emergency_exit_status", label: "Emergency Exit Status", unit: "" },
      { key: "door_status", label: "Door Status", unit: "" },
      { key: "toxic_gas", label: "Toxic Gas", unit: "ppm" },
      { key: "temperature", label: "Temperature", unit: "°C" },
      { key: "cctv_threat_level", label: "CCTV Threat Level", unit: "" },
    ],
    simulationFields: [
      { key: "smoke_density", label: "Smoke Density", unit: "%", type: "number" },
      { key: "toxic_gas", label: "Toxic Gas", unit: "ppm", type: "number" },
      { key: "temperature", label: "Temperature", unit: "°C", type: "number" },
    ],
    predictionTitle: "Hazard outlook",
    recommendationTitle: "Safety actions",
    developerTitle: "Developer output",
    chartLabel: "Risk Gauge",
    chartHint: "Hazard Timeline and Zone Heatmap",
  },
  grid: {
    id: "grid",
    title: "Grid Agent",
    purpose: "Optimize energy usage.",
    summary: "Balances building demand, tariff exposure, and storage behavior for demand response.",
    accent: "#1D4ED8",
    surface: "#EFF6FF",
    border: "#93C5FD",
    iconLabel: "Energy optimization",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "energy", label: "Energy" },
      { id: "forecast", label: "Forecast" },
      { id: "optimization", label: "Optimization" },
      { id: "grid-events", label: "Grid Events" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Energy Collection", detail: "Inputs normalized", state: "done" },
      { label: "Demand Forecast", detail: "Forecasting demand", state: "done" },
      { label: "Grid Optimization", detail: "Optimizing grid", state: "active" },
      { label: "Demand Response", detail: "Responding to demand", state: "pending" },
      { label: "Dispatch", detail: "Dispatching plan", state: "pending" },
    ],
    telemetry: [
      { key: "grid_load", label: "Grid Load", unit: "kW" },
      { key: "utility_demand", label: "Utility Demand", unit: "kW" },
      { key: "electricity_price", label: "Electricity Price", unit: "$/kWh" },
      { key: "solar_generation", label: "Solar Generation", unit: "kW" },
      { key: "battery_soc", label: "Battery SOC", unit: "%" },
      { key: "transformer_load", label: "Transformer Load", unit: "%" },
      { key: "peak_event", label: "Peak Event", unit: "" },
      { key: "hvac_consumption", label: "HVAC Consumption", unit: "kW" },
      { key: "frequency", label: "Frequency", unit: "Hz" },
      { key: "voltage", label: "Voltage", unit: "V" },
    ],
    simulationFields: [
      { key: "grid_load", label: "Grid Load", unit: "kW", type: "number" },
      { key: "electricity_price", label: "Electricity Price", unit: "$/kWh", type: "number" },
      { key: "solar_generation", label: "Solar Generation", unit: "kW", type: "number" },
    ],
    predictionTitle: "Load outlook",
    recommendationTitle: "Optimization actions",
    developerTitle: "Developer output",
    chartLabel: "Energy Flow",
    chartHint: "Load curve and Peak timeline",
  },
  hvac: {
    id: "hvac",
    title: "HVAC Agent",
    purpose: "Optimize thermal comfort and energy usage.",
    summary: "Balances indoor climate with equipment performance.",
    accent: "#0ea5e9",
    surface: "#e0f2fe",
    border: "#7dd3fc",
    iconLabel: "HVAC",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "thermal", label: "Thermal Analysis" },
      { id: "optimization", label: "Optimization" },
      { id: "equipment", label: "Equipment" },
      { id: "schedules", label: "Schedules" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Environmental Inputs", detail: "Inputs normalized", state: "done" },
      { label: "Comfort Analysis", detail: "Analyzing comfort", state: "done" },
      { label: "Cooling Optimization", detail: "Optimizing cooling", state: "active" },
      { label: "Equipment Balancing", detail: "Balancing equipment", state: "pending" },
      { label: "HVAC Control", detail: "Controlling HVAC", state: "pending" },
    ],
    telemetry: [
      { key: "supply_air_temp", label: "Supply Air Temp", unit: "°C" },
      { key: "return_air_temp", label: "Return Air Temp", unit: "°C" },
      { key: "damper_position", label: "Damper Position", unit: "%" },
      { key: "fan_speed", label: "Fan Speed", unit: "%" },
      { key: "chiller_status", label: "Chiller Status", unit: "" },
      { key: "ahu_status", label: "AHU Status", unit: "" },
      { key: "cooling_load", label: "Cooling Load", unit: "kW" },
      { key: "static_pressure", label: "Static Pressure", unit: "Pa" },
      { key: "humidity", label: "Humidity", unit: "%" },
      { key: "compressor_status", label: "Compressor Status", unit: "" },
    ],
    simulationFields: [
      { key: "supply_air_temp", label: "Supply Air Temp", unit: "°C", type: "number" },
      { key: "return_air_temp", label: "Return Air Temp", unit: "°C", type: "number" },
      { key: "cooling_load", label: "Cooling Load", unit: "kW", type: "number" },
    ],
    predictionTitle: "HVAC Prediction",
    recommendationTitle: "HVAC Actions",
    developerTitle: "Developer Output",
    chartLabel: "Temperature Heatmap",
    chartHint: "Cooling trend and comfort gauge",
  },
  occupancy: {
    id: "occupancy",
    title: "Occupancy Agent",
    purpose: "Analyze and optimize space utilization.",
    summary: "Tracks people flow and adjusts building systems.",
    accent: "#a855f7",
    surface: "#f3e8ff",
    border: "#d8b4fe",
    iconLabel: "Occupancy",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "space", label: "Space Utilization" },
      { id: "forecast", label: "Forecast" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Sensor Fusion", detail: "Inputs normalized", state: "done" },
      { label: "People Detection", detail: "Detecting people", state: "done" },
      { label: "Space Analysis", detail: "Analyzing space", state: "active" },
      { label: "Occupancy Prediction", detail: "Predicting occupancy", state: "pending" },
      { label: "Optimization", detail: "Optimizing space", state: "pending" },
    ],
    telemetry: [
      { key: "current_occupancy", label: "Current Occupancy", unit: "" },
      { key: "motion_sensors", label: "Motion Sensors", unit: "" },
      { key: "camera_count", label: "Camera Count", unit: "" },
      { key: "booking_status", label: "Booking Status", unit: "" },
      { key: "door_events", label: "Door Events", unit: "" },
      { key: "badge_access", label: "Badge Access", unit: "" },
      { key: "zone_density", label: "Zone Density", unit: "%" },
      { key: "meeting_schedule", label: "Meeting Schedule", unit: "" },
      { key: "historical_average", label: "Historical Average", unit: "" },
      { key: "crowd_trend", label: "Crowd Trend", unit: "" },
    ],
    simulationFields: [
      { key: "current_occupancy", label: "Current Occupancy", unit: "", type: "number" },
      { key: "zone_density", label: "Zone Density", unit: "%", type: "number" },
    ],
    predictionTitle: "Occupancy Prediction",
    recommendationTitle: "Space Actions",
    developerTitle: "Developer Output",
    chartLabel: "Floor Occupancy Map",
    chartHint: "Crowd trend and zone utilization",
  },
  carbon: {
    id: "carbon",
    title: "Carbon Agent",
    purpose: "Track and reduce carbon emissions.",
    summary: "Monitors footprint and implements offset strategies.",
    accent: "#22c55e",
    surface: "#dcfce7",
    border: "#86efac",
    iconLabel: "Carbon Tracking",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "emissions", label: "Emissions" },
      { id: "reduction", label: "Reduction" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Emission Collection", detail: "Inputs normalized", state: "done" },
      { label: "Carbon Analysis", detail: "Analyzing carbon", state: "done" },
      { label: "Reduction Strategy", detail: "Strategizing reduction", state: "active" },
      { label: "Offset Planning", detail: "Planning offsets", state: "pending" },
      { label: "Carbon Report", detail: "Reporting carbon", state: "pending" },
    ],
    telemetry: [
      { key: "grid_carbon_intensity", label: "Grid Carbon Intensity", unit: "gCO2/kWh" },
      { key: "renewable_pct", label: "Renewable %", unit: "%" },
      { key: "building_emission", label: "Building Emission", unit: "kgCO2" },
      { key: "hvac_emission", label: "HVAC Emission", unit: "kgCO2" },
      { key: "solar_output", label: "Solar Output", unit: "kW" },
      { key: "battery_usage", label: "Battery Usage", unit: "%" },
      { key: "peak_demand", label: "Peak Demand", unit: "kW" },
      { key: "fuel_consumption", label: "Fuel Consumption", unit: "L" },
      { key: "carbon_budget", label: "Carbon Budget", unit: "kgCO2" },
      { key: "daily_target", label: "Daily Target", unit: "kgCO2" },
    ],
    simulationFields: [
      { key: "grid_carbon_intensity", label: "Grid Carbon Intensity", unit: "gCO2/kWh", type: "number" },
      { key: "building_emission", label: "Building Emission", unit: "kgCO2", type: "number" },
    ],
    predictionTitle: "Carbon Prediction",
    recommendationTitle: "Offset Actions",
    developerTitle: "Developer Output",
    chartLabel: "Emissions Trend",
    chartHint: "Footprint over time",
  },
  security: {
    id: "security",
    title: "Security Agent",
    purpose: "Monitor and manage building security.",
    summary: "Tracks access and identifies security threats.",
    accent: "#64748b",
    surface: "#f1f5f9",
    border: "#cbd5e1",
    iconLabel: "Security",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "alerts", label: "Alerts" },
      { id: "access", label: "Access Control" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Security Sensors", detail: "Inputs normalized", state: "done" },
      { label: "Threat Detection", detail: "Detecting threats", state: "done" },
      { label: "Access Evaluation", detail: "Evaluating access", state: "active" },
      { label: "Security Decision", detail: "Deciding security", state: "pending" },
      { label: "Response Action", detail: "Responding", state: "pending" },
    ],
    telemetry: [
      { key: "camera_alerts", label: "Camera Alerts", unit: "" },
      { key: "unauthorized_access", label: "Unauthorized Access", unit: "" },
      { key: "door_lock_status", label: "Door Lock Status", unit: "" },
      { key: "intrusion_score", label: "Intrusion Score", unit: "" },
      { key: "visitor_count", label: "Visitor Count", unit: "" },
      { key: "security_patrol", label: "Security Patrol", unit: "" },
      { key: "alarm_status", label: "Alarm Status", unit: "" },
      { key: "badge_failure", label: "Badge Failure", unit: "" },
      { key: "threat_level", label: "Threat Level", unit: "" },
      { key: "restricted_area_status", label: "Restricted Area Status", unit: "" },
    ],
    simulationFields: [
      { key: "intrusion_score", label: "Intrusion Score", unit: "", type: "number" },
      { key: "camera_alerts", label: "Camera Alerts", unit: "", type: "number" },
    ],
    predictionTitle: "Security Prediction",
    recommendationTitle: "Security Actions",
    developerTitle: "Developer Output",
    chartLabel: "Threat Timeline",
    chartHint: "Security events over time",
  },
  lighting: {
    id: "lighting",
    title: "Lighting Agent",
    purpose: "Optimize lighting for comfort and energy.",
    summary: "Manages illumination levels based on occupancy and daylight.",
    accent: "#eab308",
    surface: "#fef9c3",
    border: "#fde047",
    iconLabel: "Lighting",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "brightness", label: "Zone Brightness" },
      { id: "energy", label: "Energy" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Light Sensors", detail: "Inputs normalized", state: "done" },
      { label: "Daylight Analysis", detail: "Analyzing daylight", state: "done" },
      { label: "Zone Optimization", detail: "Optimizing zones", state: "active" },
      { label: "Lighting Decision", detail: "Deciding lighting", state: "pending" },
      { label: "Control Action", detail: "Controlling lights", state: "pending" },
    ],
    telemetry: [
      { key: "lux_level", label: "Lux Level", unit: "lx" },
      { key: "occupancy", label: "Occupancy", unit: "%" },
      { key: "daylight", label: "Daylight", unit: "%" },
      { key: "lighting_schedule", label: "Lighting Schedule", unit: "" },
      { key: "power_usage", label: "Power Usage", unit: "kW" },
      { key: "fixture_health", label: "Fixture Health", unit: "%" },
      { key: "sensor_status", label: "Sensor Status", unit: "" },
      { key: "manual_override", label: "Manual Override", unit: "" },
      { key: "zone_brightness", label: "Zone Brightness", unit: "%" },
      { key: "energy_saving_mode", label: "Energy Saving Mode", unit: "" },
    ],
    simulationFields: [
      { key: "lux_level", label: "Lux Level", unit: "lx", type: "number" },
      { key: "daylight", label: "Daylight", unit: "%", type: "number" },
    ],
    predictionTitle: "Lighting Prediction",
    recommendationTitle: "Lighting Actions",
    developerTitle: "Developer Output",
    chartLabel: "Zone Brightness Map",
    chartHint: "Illumination levels",
  },
  water: {
    id: "water",
    title: "Water Agent",
    purpose: "Monitor and optimize water usage.",
    summary: "Tracks consumption and detects leaks.",
    accent: "#06b6d4",
    surface: "#cffafe",
    border: "#67e8f9",
    iconLabel: "Water",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "consumption", label: "Consumption" },
      { id: "leaks", label: "Leaks" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Flow Sensors", detail: "Inputs normalized", state: "done" },
      { label: "Usage Analysis", detail: "Analyzing usage", state: "done" },
      { label: "Leak Detection", detail: "Detecting leaks", state: "active" },
      { label: "Water Decision", detail: "Deciding actions", state: "pending" },
      { label: "Valve Control", detail: "Controlling valves", state: "pending" },
    ],
    telemetry: [
      { key: "water_flow", label: "Water Flow", unit: "L/min" },
      { key: "tank_level", label: "Tank Level", unit: "%" },
      { key: "pump_status", label: "Pump Status", unit: "" },
      { key: "pressure", label: "Pressure", unit: "kPa" },
      { key: "leakage", label: "Leakage", unit: "L/h" },
      { key: "valve_status", label: "Valve Status", unit: "" },
      { key: "water_quality", label: "Water Quality", unit: "" },
      { key: "daily_consumption", label: "Daily Consumption", unit: "L" },
      { key: "rainwater_level", label: "Rainwater Level", unit: "%" },
      { key: "recycling_pct", label: "Recycling %", unit: "%" },
    ],
    simulationFields: [
      { key: "water_flow", label: "Water Flow", unit: "L/min", type: "number" },
      { key: "leakage", label: "Leakage", unit: "L/h", type: "number" },
    ],
    predictionTitle: "Water Prediction",
    recommendationTitle: "Water Actions",
    developerTitle: "Developer Output",
    chartLabel: "Water Flow Trend",
    chartHint: "Consumption metrics",
  },
  energy: {
    id: "energy",
    title: "Energy Agent",
    purpose: "Track overall building energy dynamics.",
    summary: "Balances supply and demand across all building sources.",
    accent: "#f97316",
    surface: "#ffedd5",
    border: "#fdba74",
    iconLabel: "Energy",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "demand", label: "Demand" },
      { id: "supply", label: "Supply" },
      { id: "developer", label: "Developer Mode" },
    ],
    workflow: [
      { label: "Energy Collection", detail: "Inputs normalized", state: "done" },
      { label: "Balance Analysis", detail: "Analyzing balance", state: "done" },
      { label: "Source Optimization", detail: "Optimizing sources", state: "active" },
      { label: "Energy Decision", detail: "Deciding actions", state: "pending" },
      { label: "Routing Action", detail: "Routing energy", state: "pending" },
    ],
    telemetry: [
      { key: "building_demand", label: "Building Demand", unit: "kW" },
      { key: "renewable_power", label: "Renewable Power", unit: "kW" },
      { key: "battery_level", label: "Battery Level", unit: "%" },
      { key: "peak_load", label: "Peak Load", unit: "kW" },
      { key: "import", label: "Import", unit: "kW" },
      { key: "export", label: "Export", unit: "kW" },
      { key: "electricity_price", label: "Electricity Price", unit: "$/kWh" },
      { key: "generator_status", label: "Generator Status", unit: "" },
      { key: "load_forecast", label: "Load Forecast", unit: "kW" },
      { key: "energy_target", label: "Energy Target", unit: "kW" },
    ],
    simulationFields: [
      { key: "building_demand", label: "Building Demand", unit: "kW", type: "number" },
      { key: "renewable_power", label: "Renewable Power", unit: "kW", type: "number" },
    ],
    predictionTitle: "Energy Prediction",
    recommendationTitle: "Energy Actions",
    developerTitle: "Developer Output",
    chartLabel: "Energy Balance Map",
    chartHint: "Supply and demand metrics",
  },
};

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "morning-rush",
    name: "Morning Office Rush",
    description: "High occupancy, rising HVAC demand, and accelerated start-up loads.",
    agentId: "occupancy",
    badge: "Operations",
    defaults: { occupancy: 85, grid_load: 1380, electricity_price: 0.12, solar_generation: 150 },
  },
  {
    id: "weekend",
    name: "Weekend Mode",
    description: "Low occupancy, minimal cooling, and baseline operations.",
    agentId: "occupancy",
    badge: "Operations",
    defaults: { occupancy: 5, grid_load: 300, electricity_price: 0.08, solar_generation: 250 },
  },
  {
    id: "peak-pricing",
    name: "Peak Electricity Pricing",
    description: "High grid prices trigger demand response and load shedding.",
    agentId: "grid",
    badge: "Energy",
    defaults: { occupancy: 60, grid_load: 1200, electricity_price: 0.50, solar_generation: 200 },
  },
  {
    id: "high-temp",
    name: "High Outdoor Temperature",
    description: "Extreme heat wave pushes cooling systems to maximum capacity.",
    agentId: "hvac",
    badge: "Thermal",
    defaults: { occupancy: 70, grid_load: 1600, electricity_price: 0.15, solar_generation: 400, outdoor_temp: 38 },
  },
  {
    id: "low-solar",
    name: "Low Solar Generation",
    description: "Overcast conditions reduce renewable output, increasing grid reliance.",
    agentId: "energy",
    badge: "Energy",
    defaults: { occupancy: 65, grid_load: 1100, electricity_price: 0.12, solar_generation: 10 },
  },
  {
    id: "battery-opt",
    name: "Battery Optimization",
    description: "Charging and discharging cycles for maximum tariff arbitrage.",
    agentId: "grid",
    badge: "Energy",
    defaults: { occupancy: 50, grid_load: 800, electricity_price: 0.05, solar_generation: 300, battery_soc: 20 },
  },
  {
    id: "hvac-drop",
    name: "HVAC Efficiency Drop",
    description: "Chiller performance degrades, prompting maintenance alerts.",
    agentId: "equipment",
    badge: "Maintenance",
    defaults: { occupancy: 75, grid_load: 1400, electricity_price: 0.14, solar_generation: 200, chiller_health: 65 },
  },
  {
    id: "wear-increase",
    name: "Equipment Wear Increase",
    description: "Vibration anomalies detected in critical air handling units.",
    agentId: "equipment",
    badge: "Maintenance",
    defaults: { occupancy: 80, grid_load: 1200, electricity_price: 0.12, solar_generation: 150, motor_vibration: 12.5 },
  },
  {
    id: "low-occ",
    name: "Low Occupancy",
    description: "Unexpectedly low turnout allows aggressive energy savings.",
    agentId: "occupancy",
    badge: "Operations",
    defaults: { occupancy: 15, grid_load: 600, electricity_price: 0.10, solar_generation: 150 },
  },
  {
    id: "high-occ",
    name: "High Occupancy",
    description: "Full capacity stresses safety, thermal, and security systems.",
    agentId: "safety",
    badge: "Safety",
    defaults: { occupancy: 100, grid_load: 1500, electricity_price: 0.16, solar_generation: 200, co2_level: 900 },
  },
];

export function getScenarioById(scenarioId: string) {
  return SIMULATION_SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? SIMULATION_SCENARIOS[0];
}

export function getAgentProfile(agentId: AgentId) {
  return AGENT_PROFILES[agentId];
}

export function getSimulationStorageKey() {
  return `voltix.session.current`;
}

export function resolveBackendUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");
}

export function toNumericValue(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function runDigitalTwin(payload: any): Promise<{ session_id: string }> {
  const response = await fetch(`${resolveBackendUrl()}/api/v1/simulation/digital-twin/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getDigitalTwinSession(sessionId: string): Promise<any> {
  const response = await fetch(`${resolveBackendUrl()}/api/v1/simulation/session/${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch session: ${response.status}`);
  }
  return response.json();
}

export async function getAgentSessionResult(sessionId: string, agentId: string): Promise<any> {
  const response = await fetch(`${resolveBackendUrl()}/api/v1/simulation/session/${sessionId}/${agentId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch agent result: ${response.status}`);
  }
  return response.json();
}
