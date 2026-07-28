from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import create_access_token

client = TestClient(app)
token = create_access_token(subject="admin@voltix.ai", role="Admin")
headers = {"Authorization": f"Bearer {token}"}

def test_list_buildings():
    response = client.get("/api/v1/buildings", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_building():
    payload = {
        "name": "Voltix Testing Facility",
        "location": "Sector 4",
        "address": "100 Tech Blvd",
        "total_floors": 5,
        "square_feet": 25000.0,
    }
    response = client.post("/api/v1/buildings", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert "id" in data
