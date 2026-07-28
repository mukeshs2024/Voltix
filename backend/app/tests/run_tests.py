import sys
import unittest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.database import get_db
from backend.app.core.security import create_access_token

# Override DB session for standalone testing without active PostgreSQL process
async def override_get_db():
    mock_session = MagicMock()
    mock_session.execute = AsyncMock()
    mock_session.add = MagicMock()
    mock_session.flush = AsyncMock()
    mock_session.commit = AsyncMock()
    mock_session.rollback = AsyncMock()
    mock_session.close = AsyncMock()
    mock_session.refresh = AsyncMock()
    yield mock_session

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)
token = create_access_token(subject="admin@voltix.ai", role="Admin")
headers = {"Authorization": f"Bearer {token}"}

class BackendTestSuite(unittest.TestCase):
    def test_01_health_check(self):
        res = client.get("/api/v1/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

    def test_02_auth_register_and_login(self):
        email = "test_user@voltix.ai"
        password = "SecurePassword123!"
        res_reg = client.post("/api/v1/auth/register", json={"email": email, "password": password, "full_name": "Test User", "role": "Admin"})
        self.assertIn(res_reg.status_code, (201, 400))

        res_login = client.post("/api/v1/auth/login", json={"email": email, "password": password})
        self.assertEqual(res_login.status_code, 200)
        data = res_login.json()
        self.assertIn("access_token", data)
        self.assertIn("refresh_token", data)

    def test_03_buildings_crud(self):
        res_list = client.get("/api/v1/buildings", headers=headers)
        self.assertEqual(res_list.status_code, 200)
        self.assertIsInstance(res_list.json(), list)

        payload = {
            "name": "Voltix HQ Tower",
            "location": "Downtown",
            "address": "1 Voltix Plaza",
            "total_floors": 12,
            "square_feet": 50000.0,
        }
        res_create = client.post("/api/v1/buildings", json=payload, headers=headers)
        self.assertEqual(res_create.status_code, 201)
        bldg_data = res_create.json()
        self.assertEqual(bldg_data["name"], payload["name"])

        res_health = client.get(f"/api/v1/buildings/{bldg_data['id']}/health", headers=headers)
        self.assertEqual(res_health.status_code, 200)
        self.assertIn("health_score", res_health.json())

    def test_04_telemetry_ingest_query_aggregate(self):
        telemetry_payload = {
            "building_id": "bldg_01",
            "zone_id": "zone_hvac_1",
            "temperature": 22.5,
            "humidity": 45.0,
            "occupancy_count": 25,
            "power_usage": 120.0,
            "co2_level": 410.0,
        }
        res_ingest = client.post("/api/v1/telemetry/ingest", json=telemetry_payload, headers=headers)
        self.assertEqual(res_ingest.status_code, 201)

        res_query = client.get("/api/v1/telemetry/query?building_id=bldg_01", headers=headers)
        self.assertEqual(res_query.status_code, 200)

        res_agg = client.get("/api/v1/telemetry/aggregate?building_id=bldg_01", headers=headers)
        self.assertEqual(res_agg.status_code, 200)

    def test_05_alerts_lifecycle(self):
        res_create = client.post(
            "/api/v1/alerts",
            json={"title": "High CO2 Warning", "description": "Zone B CO2 exceeded 800ppm", "severity": "medium"},
            headers=headers,
        )
        self.assertEqual(res_create.status_code, 201)
        alert_id = res_create.json()["id"]

        res_resolve = client.post(
            f"/api/v1/alerts/{alert_id}/resolve",
            json={"notes": "Ventilation dampers opened to 100%"},
            headers=headers,
        )
        self.assertEqual(res_resolve.status_code, 200)
        self.assertEqual(res_resolve.json()["status"], "resolved")

    def test_06_reports_generation_and_download(self):
        res_gen = client.post(
            "/api/v1/reports/generate",
            json={"title": "Weekly Energy Audit", "report_type": "energy", "format": "csv"},
            headers=headers,
        )
        self.assertEqual(res_gen.status_code, 201)
        report_id = res_gen.json()["id"]

        res_dl = client.get(f"/api/v1/reports/{report_id}/download", headers=headers)
        self.assertEqual(res_dl.status_code, 200)
        self.assertIn("text/csv", res_dl.headers["content-type"])

    def test_07_dashboard_and_analytics(self):
        res_dash = client.get("/api/v1/dashboard/overview", headers=headers)
        self.assertEqual(res_dash.status_code, 200)
        self.assertIn("total_buildings", res_dash.json())

        res_opt = client.post("/api/v1/dashboard/auto-optimize", headers=headers)
        self.assertEqual(res_opt.status_code, 200)

    def test_08_ai_endpoints(self):
        res_status = client.get("/api/v1/ai/status", headers=headers)
        self.assertEqual(res_status.status_code, 200)

        res_agents = client.get("/api/v1/ai/agents", headers=headers)
        self.assertEqual(res_agents.status_code, 200)

        res_copilot = client.post("/api/v1/ai/copilot?prompt=What%20is%20current%20hvac%20status", headers=headers)
        self.assertEqual(res_copilot.status_code, 200)

    def test_09_scenario_and_simulation(self):
        res_scenarios = client.get("/api/v1/scenarios/templates", headers=headers)
        self.assertEqual(res_scenarios.status_code, 200)
        self.assertGreater(len(res_scenarios.json()), 0)

        res_exec = client.post("/api/v1/scenarios/execute", json={"duration_minutes": 15}, headers=headers)
        self.assertEqual(res_exec.status_code, 201)

if __name__ == "__main__":
    unittest.main()
