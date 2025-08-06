from flask import Blueprint, request, jsonify
from extensions import db
from models import Task
tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

@tasks_bp.route("", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{ "id": t.id, "title": t.title } for t in tasks])

@tasks_bp.route("", methods=["POST"])
def create_task():
    data = request.json
    task = Task(title=data["title"])
    db.session.add(task)
    db.session.commit()
    return jsonify({"id": task.id, "title": task.title}), 201

@tasks_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.title = request.json.get("title", task.title)
    db.session.commit()
    return jsonify({"id": task.id, "title": task.title})

@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})