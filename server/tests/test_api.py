import pytest
from app import app, db
from models import Task

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_task_crud(client):
    res = client.post("/api/tasks", json={"title": "Test Task"})
    assert res.status_code == 201
    task_id = res.get_json()["id"]

    res = client.put(f"/api/tasks/{task_id}", json={"title": "Updated Task"})
    assert res.get_json()["title"] == "Updated Task"

    res = client.delete(f"/api/tasks/{task_id}")
    assert res.status_code == 200