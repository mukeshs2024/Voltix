from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import create_access_token

client = TestClient(app)
token = create_access_token(subject="admin@voltix.ai", role="Admin")
headers = {"Authorization": f"Bearer {token}"}

def test_alert_lifecycle():
    create_res = client.post(
        "/api/v1/alerts",
        json={"title": "High Temperature Warning", "description": "Zone A exceeded 26C", "severity": "high"},
        headers=headers,
    )
    assert create_res.status_code == 201
    alert_id = create_res.json()["id"]

    resolve_res = client.post(
        f"/api/v1/alerts/{alert_id}/resolve",
        json={"notes": "Adjusted thermostat setpoint back to normal"},
        headers=headers,
    )
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "resolved"
