from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import create_access_token

client = TestClient(app)
token = create_access_token(subject="admin@voltix.ai", role="Admin")
headers = {"Authorization": f"Bearer {token}"}

def test_telemetry_ingest_and_query():
    telemetry_payload = {
        "building_id": "bldg_test_01",
        "zone_id": "zone_test_A",
        "temperature": 22.4,
        "humidity": 48.0,
        "occupancy_count": 14,
        "power_usage": 85.5,
        "co2_level": 415.0,
    }
    ingest_res = client.post("/api/v1/telemetry/ingest", json=telemetry_payload, headers=headers)
    assert ingest_res.status_code == 201
    data = ingest_res.json()
    assert data["building_id"] == "bldg_test_01"

    query_res = client.get("/api/v1/telemetry/query?building_id=bldg_test_01", headers=headers)
    assert query_res.status_code == 200
    assert len(query_res.json()) >= 1
