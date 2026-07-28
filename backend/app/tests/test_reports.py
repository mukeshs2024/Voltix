from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import create_access_token

client = TestClient(app)
token = create_access_token(subject="admin@voltix.ai", role="Admin")
headers = {"Authorization": f"Bearer {token}"}

def test_report_generation_and_download():
    gen_res = client.post(
        "/api/v1/reports/generate",
        json={"title": "Monthly Energy Efficiency Audit", "report_type": "energy", "format": "csv"},
        headers=headers,
    )
    assert gen_res.status_code == 201
    report_id = gen_res.json()["id"]

    download_res = client.get(f"/api/v1/reports/{report_id}/download", headers=headers)
    assert download_res.status_code == 200
    assert "text/csv" in download_res.headers["content-type"]
